const express = require("express");
const EducationLoan = require("../models/EducationLoan");
const router = express.Router();

function toStringArray(value) {
  if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function toNumberOrUndefined(value) {
  if (value === null || typeof value === "undefined" || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

// Get all education loans
router.get("/", async (req, res) => {
  try {
    const loans = await EducationLoan.find();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single education loan
router.get("/:id", async (req, res) => {
  try {
    const loan = await EducationLoan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Education loan not found" });
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create education loan
router.post("/", async (req, res) => {
  try {
    const {
      loanType,
      loanName,
      lender,
      maxAmount,
      aprFrom,
      apr,
      tenure,
      processingFee,
      moratorium,
      supportedCountries,
      countries,
      services,
      highlights,
      status,
      repaymentPeriod,
      eligibility,
      description,
    } = req.body;

    const normalizedAprFrom = toNumberOrUndefined(aprFrom);
    const normalizedApr = typeof normalizedAprFrom !== "undefined" ? normalizedAprFrom : toNumberOrUndefined(apr);
    const normalizedMaxAmount = toNumberOrUndefined(maxAmount);
    const normalizedTenure = toNumberOrUndefined(tenure);

    if ((!loanName && !lender) || typeof normalizedMaxAmount === "undefined" || typeof normalizedApr === "undefined" || typeof normalizedTenure === "undefined") {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const normalizedSupportedCountries = toStringArray(supportedCountries).length
      ? toStringArray(supportedCountries)
      : toStringArray(countries);

    const normalizedServices = toStringArray(services).length
      ? toStringArray(services)
      : toStringArray(highlights);

    const loan = new EducationLoan({
      loanName,
      lender,
      loanType,
      maxAmount: normalizedMaxAmount,
      aprFrom: typeof normalizedAprFrom !== "undefined" ? normalizedAprFrom : normalizedApr,
      apr: normalizedApr,
      tenure: normalizedTenure,
      processingFee,
      moratorium,
      supportedCountries: normalizedSupportedCountries,
      countries: normalizedSupportedCountries,
      services: normalizedServices,
      highlights: normalizedServices,
      status,
      repaymentPeriod,
      eligibility,
      description
    });
    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    console.error("Error creating education loan:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update education loan
router.put("/:id", async (req, res) => {
  try {
    const update = { ...req.body };

    if (update.supportedCountries !== undefined || update.countries !== undefined) {
      const normalized = toStringArray(update.supportedCountries).length
        ? toStringArray(update.supportedCountries)
        : toStringArray(update.countries);
      update.supportedCountries = normalized;
      update.countries = normalized;
    }

    if (update.services !== undefined || update.highlights !== undefined) {
      const normalized = toStringArray(update.services).length
        ? toStringArray(update.services)
        : toStringArray(update.highlights);
      update.services = normalized;
      update.highlights = normalized;
    }

    if (update.maxAmount !== undefined) {
      const n = Number(update.maxAmount);
      if (Number.isFinite(n)) update.maxAmount = n;
    }

    if (update.aprFrom !== undefined) {
      const n = Number(update.aprFrom);
      if (Number.isFinite(n)) update.aprFrom = n;
    }

    if (update.apr !== undefined) {
      const n = Number(update.apr);
      if (Number.isFinite(n)) update.apr = n;
    }

    if (update.aprFrom !== undefined && update.apr === undefined) {
      update.apr = update.aprFrom;
    }

    if (update.tenure !== undefined) {
      const n = Number(update.tenure);
      if (Number.isFinite(n)) update.tenure = n;
    }

    const loan = await EducationLoan.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!loan) return res.status(404).json({ message: "Education loan not found" });
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete education loan
router.delete("/:id", async (req, res) => {
  try {
    const loan = await EducationLoan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ message: "Education loan not found" });
    res.status(200).json({ message: "Education loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
