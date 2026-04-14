const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  message: String,
  userId: {
    type: String
  },
  loanId: {
    type: String
  },
  loanLender: {
    type: String
  },
  applicationStatus: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Documents Pending', 'Approved', 'Rejected'],
    default: 'Submitted'
  },
  formType: {
    type: String,
    enum: ['contact', 'application', 'consultation', 'loan']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("FormSubmission", formSubmissionSchema);
