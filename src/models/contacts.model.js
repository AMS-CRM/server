const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  labels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "labels",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  dob: {
    type: Date,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Terminated", "In-active"],
    default: "Active",
    required: true,
  },
  salary: {
    salaryType: {
      type: String,
      enum: ["Hourly", "Anually"],
      default: "Hourly",
    },
    transferMethod: {
      type: String,
      enum: ["E-transfer", "CHQ", "Direct Deposit"],
      required: true,
      default: "CHQ",
    },
    bankAccount: {
      accountNo: {
        type: String,
      },
      transitNo: {
        type: String,
      },
      instituteNo: {
        type: String,
      },
    },
    wage: {
      type: Number,
      default: 0,
      required: true,
    },
    payCycle: {
      type: String,
      enum: [
        "Daily",
        "Weekly",
        "Bi-Weekly",
        "Semi-Monthly",
        "Monthly",
        "Annual",
      ],
      default: "Weekly",
      required: true,
    },
  },
  payroll: {
    securityQuestion: {
      type: String,
      default: "what is 4+4",
    },
    securityAnswer: {
      type: String,
      default: "8",
    },
    overTimePercentage: {
      type: Number,
      default: 1.5,
    },
    hours: {
      type: Number,
      default: 0,
    },
    overTimeHours: {
      Type: Number,
      required: false,
    },
    extraPay: {
      type: Number,
      default: 0,
    },
    bonusPay: {
      type: Number,
      required: false,
    },
    overTimePay: {
      type: Number,
      required: false,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  phone: {
    number: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  address: {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
  },
  createdOn: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

module.exports = contacts = mongoose.model("contacts", contactSchema);
