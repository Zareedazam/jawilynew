const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    funding: {
      type: String,
      required: true,
    },
    amountText: {
      type: String,
      default: "",
    },
    deadlineText: {
      type: String,
      default: "",
    },
    deadlineGroup: {
      type: String,
      default: "Open",
    },
    tags: {
      type: [String],
      default: [],
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);
