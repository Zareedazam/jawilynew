const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  ranking: {
    type: Number,
    required: false
  },
  avgFee: {
    type: Number,
    required: false
  },
  description: String,
  website: String,
  location: String
}, {
  timestamps: true
});

module.exports = mongoose.model("University", universitySchema);
