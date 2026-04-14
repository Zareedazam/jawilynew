const express = require("express");
const Scholarship = require("../models/Scholarship");

const router = express.Router();

// Get all scholarships
router.get("/", async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    return res.status(200).json(scholarships);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single scholarship
router.get("/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });
    return res.status(200).json(scholarship);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create scholarship
router.post("/", async (req, res) => {
  try {
    const {
      name,
      provider,
      country,
      level,
      funding,
      amountText,
      deadlineText,
      deadlineGroup,
      tags,
      note,
    } = req.body;

    if (!name || !provider || !country || !level || !funding) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const scholarship = new Scholarship({
      name,
      provider,
      country,
      level,
      funding,
      amountText,
      deadlineText,
      deadlineGroup,
      tags,
      note,
    });

    await scholarship.save();
    return res.status(201).json(scholarship);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update scholarship
router.put("/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });
    return res.status(200).json(scholarship);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete scholarship
router.delete("/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });
    return res.status(200).json({ message: "Scholarship deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
