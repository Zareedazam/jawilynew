const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: false
  },
  level: {
    type: String,
    required: true,
    enum: ['Undergraduate', 'Postgraduate', 'PhD', 'Diploma']
  },
  fee: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Online', 'Hybrid']
  },
  duration: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  description: String,
  intake: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);
