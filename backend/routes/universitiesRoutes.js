const express = require("express");
const University = require("../models/University");
const router = express.Router();

// Get all universities
router.get("/", async (req, res) => {
  try {
    const universities = await University.find();
    res.status(200).json(universities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single university
router.get("/:id", async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) return res.status(404).json({ message: "University not found" });
    res.status(200).json(university);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create university
router.post("/", async (req, res) => {
  try {
    const {
      name,
      country,
      city,
      rank,
      ranking,
      avgFee,
      description,
      website,
      location,
    } = req.body;

    const normalizedCity = city || location;
    const normalizedRank = typeof rank !== "undefined" ? rank : ranking;

    if (!name || !country || !normalizedCity || typeof normalizedRank === "undefined") {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const university = new University({
      name,
      country,
      city: normalizedCity,
      rank: Number(normalizedRank),
      ranking: typeof ranking !== "undefined" ? Number(ranking) : undefined,
      avgFee: typeof avgFee !== "undefined" ? Number(avgFee) : undefined,
      description,
      website,
      location,
    });
    await university.save();
    res.status(201).json(university);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update university
router.put("/:id", async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!university) return res.status(404).json({ message: "University not found" });
    res.status(200).json(university);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete university
router.delete("/:id", async (req, res) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) return res.status(404).json({ message: "University not found" });
    res.status(200).json({ message: "University deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
