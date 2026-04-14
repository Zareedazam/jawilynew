const mongoose = require("mongoose");

const educationLoanSchema = new mongoose.Schema({
  loanName: {
    type: String,
    required: false,
  },
  lender: {
    type: String,
    required: false
  },
  loanType: {
    type: String,
    enum: ['Secured', 'Unsecured'],
    default: 'Unsecured'
  },
  maxAmount: {
    type: Number,
    required: true
  },
  aprFrom: {
    type: Number,
    required: false,
  },
  apr: {
    type: Number,
    required: true
  },
  tenure: {
    type: Number,
    required: true
  },
  processingFee: {
    type: String,
    default: ""
  },
  moratorium: {
    type: String,
    default: ""
  },
  supportedCountries: {
    type: [String],
    default: []
  },
  countries: {
    type: [String],
    default: []
  },
  services: {
    type: [String],
    default: []
  },
  highlights: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  repaymentPeriod: String,
  eligibility: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model("EducationLoan", educationLoanSchema);
