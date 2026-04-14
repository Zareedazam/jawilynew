const express = require("express");
const News = require("../models/News");
const router = express.Router();

// Get all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single news
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create news
router.post("/", async (req, res) => {
  try {
    const { title, category, date, excerpt, content, author, image } = req.body;

    if (!title || !category || !date || !excerpt) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const news = new News({ title, category, date, excerpt, content, author, image });
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update news
router.put("/:id", async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete news
router.delete("/:id", async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
