const { ObjectId } = require("mongodb");
const Payrolls = require("../../models/payrolls.model");
const User = require("../../models/user.model");
const asyncHandler = require("express-async-handler");

// Get the data for the dasboard
const getDashboardData = asyncHandler(async (req, res) => {
  try {
    // Get the payroll summary
    const response = await User.aggregate([
      {
        $match: {
          _id: ObjectId("63d9403a5ba7aa3a8fd459e2"),
        },
      },

      {
        $lookup: {
          from: "payrolls",
          foreignField: "user",
          localField: "_id",
          as: "payrolls",
        },
      },
      {
        $lookup: {
          from: "contacts",
          foreignField: "user",
          localField: "_id",
          as: "employees",
        },
      },
      {
        $facet: {
          user: [
            {
              $project: {
                _id: 0,
                balance: 1,
              },
            },
          ],
          payrollsTotal: [
            { $unwind: "$payrolls" },
            {
              $group: {
                _id: null,
                totalGrossAmount: {
                  $sum: "$payrolls.payrollSummary.grossAmount",
                },
                totalNetAmount: {
                  $sum: "$payrolls.payrollSummary.netAmount",
                },
              },
            },
          ],
          payrollsStatus: [
            { $unwind: "$payrolls" },
            {
              $group: {
                _id: "$payrolls.status",
                count: {
                  $sum: 1,
                },
              },
            },
          ],
          employess: [
            {
              $project: {
                _id: 0,
                noOfEmployess: {
                  $size: "$employees",
                },
              },
            },
          ],
        },
      },
    ]);

    if (!response) {
      res.status(400).setCode(948);
      throw new Error("Error fetching the dashboard data");
    }

    return res.status(200).setPayload(response[0]).setCode(234).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getDashboardData,
};
