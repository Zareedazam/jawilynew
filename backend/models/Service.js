const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: String,
  price: Number
}, {
  timestamps: true
});

module.exports = mongoose.model("Service", serviceSchema);
