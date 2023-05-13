const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payrollsSchema = new Schema({
  payrollNo: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  query: {
    status: {
      type: String,
      enum: ["include", "exclude"],
    },
    users: [mongoose.Schema.Types.ObjectId],
  },
  payrollSummary: {
    EI: {
      type: Number,
    },
    CPP: {
      type: Number,
    },
    ITDfed: {
      type: Number,
    },
    ITDprov: {
      type: Number,
    },
    netAmount: {
      type: Number,
    },
    grossAmount: {
      type: Number,
    },
    totalDeductions: {
      type: Number,
    },
  },
  payroll: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "contacts",
      },
      payStub: {
        type: String,
      },
      transactionRef: {
        type: String,
        ref: "transactions",
      },
      data: {
        totalDeductions: {
          type: Number,
        },
        payCycle: {
          type: String,
        },
        securityQuestion: {
          type: String,
          required: false,
        },
        securityAnswer: {
          type: String,
          required: false,
        },
        hours: {
          type: Number,
          required: false,
        },
        payRate: {
          type: Number,
          required: false,
        },
        extraPay: {
          type: Number,
          required: false,
        },
        amount: {
          type: Number,
          required: true,
        },
        netAmount: {
          type: Number,
        },
        employeeEarnings: {
          Cpp: {
            type: Number,
          },
          Ei: {
            type: Number,
          },
        },
        employerCosts: {
          CPP: {
            type: Number,
          },
          EI: {
            type: Number,
          },
          employeeEIreturnable: {
            type: Number,
          },
          PEHT: {
            type: Number,
          },
        },
        employeePayrollDeductions: {
          CPP: {
            type: Number,
          },
          EI: {
            type: Number,
          },
          ITD: {
            type: Number,
          },
          ITDfed: {
            type: Number,
          },
          ITDprov: {
            type: Number,
          },
        },
      },
    },
  ],
  status: {
    type: String,
    enum: ["Under Review", "Pending", "Processing", "Completed", "Error"],
    default: "Under Review",
  },
  createdOn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  updatedOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = payrolls = mongoose.model("payrolls", payrollsSchema);
