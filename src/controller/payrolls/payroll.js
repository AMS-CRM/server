const asyncHandler = require("express-async-handler");
const { validationResult, matchedData } = require("express-validator");
const Payroll = require("../../models/payrolls.model");
const Contacts = require("../../models/contacts.model");
const fetch = require("node-fetch");
const axios = require("axios");
const mongoose = require("mongoose");
const { S3, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Temp add func
const add = (...args) => {
  const result = args.reduce((total, num) => {
    return num * 100 + total;
  }, 0);
  return result / 100;
};

const subtract = (...args) => {
  const result = args.reduceRight((total, num) => {
    return num * 100 - total;
  }, 0);
  return result / 100;
};

// Get the details of an individual payroll
const getPayrollData = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(304).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { payroll } = req.params;
    const { _id: user } = req.user;

    const payrollData = await Payroll.findOne({
      user,
      payrollNo: payroll,
    })
      .populate({
        path: "payroll",
        populate: {
          path: "user",
          select: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
          },
        },
      })
      .populate("payroll.transactionRef");

    if (!payrollData) {
      res.status(400).setCode(349);
      throw new Error("No payroll found for this user");
    }

    return res.status(200).setCode(400).setPayload(payrollData).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to approve a new payroll
const approve = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(304).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { payroll } = req.body;
    const { _id: user } = req.user;

    const approve = await Payroll.findOneAndUpdate(
      {
        user,
        _id: payroll,
      },
      {
        status: "Pending",
      }
    ).populate("user");

    if (!approve) {
      res.status(400).setCode(349);
      throw new Error("No payroll found for this user");
    }

    // Check if the user have enough balance to run the payroll
    const balanceCheck =
      approve.payrollSummary.grossAmount > approve.user.balance;

    if (balanceCheck) {
      throw new Error("You don't have enough balance to run the payroll");
    }

    // Send the payroll request with the payroll id
    const payrollRequest = await axios.post(
      process.env.WEBHOOKS_ENDPOINT,
      { _id: approve._id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.headers.authorization.split(" ")[1]}`,
        },
      }
    );

    if (!payrollRequest) {
      throw new Error("Request failed");
    }

    return res.status(200).setCode(400).setPayload(approve).respond();
  } catch (error) {
    res.status(400).setCode(343).setPayload(error);
    throw new Error(error);
  }
});

// Controller to create a new payroll
const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).setCode(673).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { _id: user } = req.user;
    let { selectAll, user: users, ...search } = matchedData(req);
    let searchKey = Object.keys(search)[0];
    let searchQuery = {};
    if (searchKey != undefined) {
      search = {
        [searchKey]: new RegExp(`.*${search[searchKey]}.*`, "i"),
      };
    }

    let query = {
      users,
      status: "include",
    };

    // Check if everything was seleted
    if (selectAll) {
      query.status = "exclude";
    }

    // Get the count of existing payrolls
    const count = (await Payroll.find({ user }).count()) + 1;

    const usersIds = users.map((id) => {
      return mongoose.Types.ObjectId(id);
    });

    if (selectAll && users.length > 0) {
      searchQuery = { _id: { $nin: usersIds } };
    }

    if (!selectAll && users.length > 0) {
      searchQuery = { _id: { $in: usersIds } };
    }

    // Get the list of the users
    const usersList = await Contacts.find(
      { ...searchQuery, ...search, status: "Active" },
      {
        _id: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        payroll: 1,
        salary: 1,
      }
    );

    if (!usersList) {
      res.stutus(400).setCode(384);
      throw new Error("No users found");
    }

    const errors = [];
    const usersData = [];
    const responseData = [];
    let grossAmount = 0;
    let payrollSummary = {
      ITD: 0,
      CPP: 0,
      EI: 0,
      ITDfed: 0,
      ITDprov: 0,
      totalDeductions: 0,
      netAmount: 0,
      grossAmount: 0,
    };

    // Loop through the list of the users
    for (let i = 0; i < usersList.length; i++) {
      const user = usersList[i];
      const { email, firstName, lastName, payroll, salary } = user;

      if (payroll.amount == 0) {
        errors.push({
          email,
          firstName,
          lastName,
          payroll,
          message: "The amount should be greater than $0",
        });
      }

      // If no error exits add the users to final data
      if (errors.length == 0) {
        let payCycle = 52;
        // Get this data from backend
        switch (salary.payCycle) {
          case "Daily":
            payCycle = 240;
            break;
          case "Weekly":
            payCycle = 52;
            break;
          case "Bi-Weekly":
            payCycle = 26;
            break;
          case "Semi-Monthly":
            payCycle = 24;
            break;
          case "Monthly":
            payCycle = 12;
            break;
          case "Annual":
            payCycle = 1;
            break;
        }

        const amount = payroll.amount;
        // Calculate the payroll for the user
        const response = await fetch(
          "https://api.metca.net/cptl/tax/calculate",
          {
            headers: {
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json",
              "sec-ch-ua":
                '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"macOS"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "cross-site",
              "x-api-key": "AZWjxlCDYZ8DSDLEOJt1w4pZb0WhzVvO1fboG2iX",
            },
            referrerPolicy: "strict-origin-when-cross-origin",
            body:
              '{"province":"ON","annualPayPeriods":' +
              payCycle +
              ',"birthDate":" ","federalTD1":{"totalClaimAmount":1,"noIncomeTaxDeductions":false,"HD":0,"L":0,"CRA_F1":0,"CRA_K3":0},"federalTD1X":{"I1":0,"E":0},"provincialTD1P":{"totalClaimAmount":1,"noIncomeTaxDeductions":false,"CRA_K3P":0,"CRA_Y":0},"exemptions":{"CPP":false,"EI":false,"PPIP":false},"ytdPayroll":{"ytdIncome":{"wages":0,"pension":0,"vacationPay":0,"bonus":0,"comm":0,"txCashBenefits":0,"txNonCashBenefits":0},"ytdDeductions":{"CPP":0,"EI":0,"PPIP":0,"ITD":0,"LSFp":0,"LSFpProv":0,"LSFp_P":0,"F":0,"U1":0,"F2":0,"L":0}},"currentPayroll":{"payDate":"2023-04-27","calcType":1,"calcMethod":0,"payPeriod":0,"cntPP":0,"noCppBasicExemption":false,"employerEIfactor":0,"income":{"wages":"' +
              amount +
              '","vacationPay":0,"retroPayPeriods":1,"daysSincePrevCommPmt":0,"txCashBenefits":0,"txNonCashBenefits":0},"deductions":{"F":0,"U1":0,"F2":0,"bonus":0,"retroPay":0}}}',
            method: "POST",
            mode: "cors",
            credentials: "omit",
          }
        );

        // Get the json response
        const responseJson = await response.json();

        // Calculate the sum

        // Current employee calculations
        const totalDeductions = add(
          responseJson.employeePayrollDeductions.CPP,
          responseJson.employeePayrollDeductions.EI,
          responseJson.employeePayrollDeductions.ITD
        );
        const netAmount = subtract(amount, totalDeductions);
        grossAmount = add(amount + grossAmount);
        // Calulate the total summary for this payroll
        payrollSummary.ITD = add(
          payrollSummary.ITD,
          responseJson.employeePayrollDeductions.ITD
        );
        payrollSummary.CPP = add(
          payrollSummary.CPP,
          responseJson.employeePayrollDeductions.CPP
        ); // responseJson.employeePayrollDeductions.CPP;
        payrollSummary.EI = add(
          payrollSummary.EI,
          responseJson.employeePayrollDeductions.EI
        ); // responseJson.employeePayrollDeductions.EI;
        payrollSummary.ITDfed = add(
          payrollSummary.ITDfed,
          responseJson.employeePayrollDeductions.ITDfed
        ); // responseJson.employeePayrollDeductions.ITDfed;
        payrollSummary.ITDprov = add(
          payrollSummary.ITDprov,
          responseJson.employeePayrollDeductions.ITDprov
        ); // responseJson.employeePayrollDeductions.ITDprov;
        payrollSummary.totalDeductions = add(
          payrollSummary.totalDeductions,
          totalDeductions
        ); // totalDeductions;
        payrollSummary.netAmount = add(payrollSummary.netAmount, netAmount); // netAmount;
        payrollSummary.grossAmount = grossAmount; // payroll.amount;

        responseData.push({
          name: `${firstName} ${lastName}`,
          email: email,
          hours: payroll.hours,
          extraPay: payroll.extraPay,
          payRate: salary.wage,
          securityQuestion: payroll.securityQuestion,
          securityAnswer: payroll.securityAnswer,
          CPP: responseJson.employeePayrollDeductions.CPP,
          EI: responseJson.employeePayrollDeductions.EI,
          ITD: responseJson.employeePayrollDeductions.ITD,
          ITDfed: responseJson.employeePayrollDeductions.ITDfed,
          ITDprov: responseJson.employeePayrollDeductions.ITDprov,
          totalDeductions: totalDeductions,
          grossAmount: amount,
          netAmount: netAmount,
        });

        usersData.push({
          user: user._id,
          data: {
            ...payroll,
            hours: payroll.hours,
            extraPay: payroll.extraPay,
            payCycle: salary.payCycle,
            payRate: salary.wage,
            netAmount: netAmount,
            totalDeductions: totalDeductions,
            employeePayrollDeductions: responseJson.employeePayrollDeductions,
            employeeEarnings: responseJson.employeeEarnings,
            employerCosts: responseJson.employerCosts,
          },
        });
      }
    }

    // Check if any errors exits
    if (errors.length != 0) {
      res.status(400).setCode(303).setPayload(errors);
      throw new Error("The payroll data need fixes");
    }

    const newPayroll = {
      payrollNo: count,
      user,
      payrollSummary,
      query,
      payroll: usersData,
    };

    // Create new payroll
    const response = await Payroll.create(newPayroll);

    if (!response) {
      res.status(400).setCode(394);
      throw new Error("Something went wrong when creating a payroll");
    }

    res
      .status(200)
      .setPayload({
        payroll: response._id,
        totalAmount: grossAmount,
        users: responseData,
      })
      .setCode(877)
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Route to generate the paystub download link
const paySubDownloadLink = asyncHandler(async (req, res) => {
  try {
    // Get the paystub file name
    const { userId, payrollId } = req.body;

    const findPayStub = await Payroll.findOne(
      {
        user: req.user._id,
        _id: payrollId,
        $and: [{ "payroll.user": userId }],
      },
      { "payroll.$": 1, payrollNo: 1 }
    ).populate("payroll.user");

    console.log(JSON.stringify(findPayStub));

    if (!findPayStub) {
      throw new Error("Cannot find the payroll");
    }
    const s3Client = new S3({
      forcePathStyle: false, // Configures to use subdomain/virtual calling format.
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
      },
    });

    // Compose a new filename
    // Generate the download temp download link
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: "paystub",
        Key: findPayStub.payroll[0].payStub,
        ResponseContentDisposition: `attachment; filename="Payroll-${findPayStub.payrollNo}-${findPayStub.payroll[0].user.firstName} ${findPayStub.payroll[0].user.lastName}.pdf"`,
      }),
      { expiresIn: 15 * 60 }
    ); // Adjustable expiration.

    if (!url) {
      throw new Error("Cannot generate the download URL");
    }

    return res.status(200).setCode(893).setPayload({ url: url }).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get the breakdown of a individual payroll
const payrollBreakdown = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(757).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { payrollNo, employeeId } = req.body;
    // Search a particular payroll
    const searchPayroll = await Payroll.findOne(
      {
        user: req.user._id,
        payrollNo,
        "payroll.user": employeeId,
      },
      { "payroll.$": 1, createdOn: 1 }
    )
      .populate("payroll.user")
      .populate("payroll.transactionRef");

    if (!searchPayroll) {
      res.status(400).setCode(394);
      throw new Error("Cannot find the payroll for this user");
    }

    return res.setCode(485).setPayload(searchPayroll).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get the list of the payrolls
const list = asyncHandler(async (req, res) => {
  try {
    const { _id: user } = req.user;
    // Get the list of all payrolls for a user
    const list = await Payroll.find({ user });

    if (!list) {
      res.status(400).setCode(344);
      throw new Error("No payroll has been found");
    }

    // Send back the list
    return res.status(200).setCode(243).setPayload(list).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  create,
  list,
  approve,
  getPayrollData,
  paySubDownloadLink,
  payrollBreakdown,
};
