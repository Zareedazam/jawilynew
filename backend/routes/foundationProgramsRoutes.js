const express = require("express");
const FoundationProgram = require("../models/FoundationProgram");

const router = express.Router();

// Get all foundation programs
router.get("/", async (req, res) => {
  try {
    const programs = await FoundationProgram.find().sort({ createdAt: -1 });
    return res.status(200).json(programs);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single foundation program
router.get("/:id", async (req, res) => {
  try {
    const program = await FoundationProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    return res.status(200).json(program);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create foundation program
router.post("/", async (req, res) => {
  try {
    const {
      title,
      provider,
      country,
      city,
      stream,
      intake,
      duration,
      budget,
      requirements,
      benefits,
    } = req.body;

    if (!title || !provider || !country || !stream) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const program = new FoundationProgram({
      title,
      provider,
      country,
      city,
      stream,
      intake,
      duration,
      budget,
      requirements,
      benefits,
    });

    await program.save();
    return res.status(201).json(program);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update foundation program
router.put("/:id", async (req, res) => {
  try {
    const program = await FoundationProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return res.status(404).json({ message: "Program not found" });
    return res.status(200).json(program);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete foundation program
router.delete("/:id", async (req, res) => {
  try {
    const program = await FoundationProgram.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    return res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
