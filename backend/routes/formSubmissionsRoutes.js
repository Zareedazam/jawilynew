const express = require("express");
const FormSubmission = require("../models/FormSubmission");
const router = express.Router();

// Get all form submissions
router.get("/", async (req, res) => {
  try {
    const { userId, email, formType } = req.query;
    const filter = {};

    if (userId) filter.userId = String(userId);
    if (email) filter.email = String(email);
    if (formType) filter.formType = String(formType);

    const submissions = await FormSubmission.find(filter).sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Load form submissions error:", {
      query: req.query,
      error,
    });
    res.status(500).json({ message: "Failed to load form submissions" });
  }
});

// Get single submission
router.get("/:id", async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json(submission);
  } catch (error) {
    console.error("Load single form submission error:", {
      id: req.params.id,
      error,
    });
    res.status(500).json({ message: "Failed to load submission" });
  }
});

// Create form submission
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, country, message, formType, loanId, loanLender, userId, applicationStatus } = req.body;

    if (!firstName || !lastName || !email || !phone || !country) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const submission = new FormSubmission({
      firstName,
      lastName,
      email,
      phone,
      country,
      message,
      formType,
      loanId,
      loanLender,
      userId,
      applicationStatus: formType === 'application' ? (applicationStatus || 'Submitted') : undefined
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error("Create form submission error:", {
      body: req.body,
      error,
    });
    res.status(500).json({ message: "Failed to create submission" });
  }
});

// Update submission (status only)
router.put("/:id", async (req, res) => {
  try {
    const { applicationStatus } = req.body;

    const updated = await FormSubmission.findByIdAndUpdate(
      req.params.id,
      { applicationStatus },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update form submission error:", {
      id: req.params.id,
      body: req.body,
      error,
    });
    res.status(500).json({ message: "Failed to update submission" });
  }
});

// Delete submission
router.delete("/:id", async (req, res) => {
  try {
    const submission = await FormSubmission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Delete form submission error:", {
      id: req.params.id,
      error,
    });
    res.status(500).json({ message: "Failed to delete submission" });
  }
});

module.exports = router;
