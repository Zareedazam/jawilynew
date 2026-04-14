const mongoose = require("mongoose");

const foundationProgramSchema = new mongoose.Schema(
  {
    title: {
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
    city: {
      type: String,
      default: "",
    },
    stream: {
      type: String,
      required: true,
    },
    intake: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      default: "",
    },
    budget: {
      type: String,
      default: "",
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FoundationProgram", foundationProgramSchema);
