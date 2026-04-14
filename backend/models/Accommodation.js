const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true,
  },
  universityName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  distanceKm: {
    type: Number,
    required: false,
  },
  distanceRange: {
    type: String,
    enum: ["0-2 km", "2-5 km", "5-10 km", "10+ km"],
    required: false,
  },
  moveInDate: {
    type: Date,
    required: false,
  },
  nearBy: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  budget: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Verified", "Unverified"],
    default: "Unverified",
  },
  services: [String],
  description: String,
  contact: String

  // Legacy fields (kept for backward compatibility)
  ,name: { type: String, required: false }
  ,universityNearby: { type: String, required: false }
  ,pricePerWeek: { type: Number, required: false }
  ,amenities: [String]
  ,moveIn: { type: Date, required: false }
}, {
  timestamps: true
});

module.exports = mongoose.model("Accommodation", accommodationSchema);
