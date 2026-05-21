const express = require("express");
const Accommodation = require("../models/Accommodation");
const { syncAccommodationData, getLastSyncTime } = require("../services/accommodationFetcher");
const router = express.Router();

// Trigger manual sync from external partner sources (TC014)
router.post("/fetch-external", async (req, res) => {
  try {
    const stats = await syncAccommodationData();
    res.status(200).json({
      message: "Accommodation data synced successfully from partner sources",
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to sync accommodation data", error: error.message });
  }
});

// Get sync status (TC015)
router.get("/sync-status", async (req, res) => {
  try {
    const lastSync = getLastSyncTime();
    const count = await Accommodation.countDocuments();
    res.status(200).json({
      lastSyncAt: lastSync ? lastSync.toISOString() : null,
      totalListings: count,
      autoSyncEnabled: true,
      syncIntervalHours: 6,
      sources: ["Unite Students", "Student.com", "Amber Student"],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

function normalizeStatus(input) {
  if (!input) return undefined;
  const s = String(input).trim().toLowerCase();
  if (s === "verified" || s === "verify") return "Verified";
  if (s === "unverified" || s === "un-verified" || s === "unverify") return "Unverified";
  if (s === "active") return "Verified";
  if (s === "inactive") return "Unverified";
  return undefined;
}

function distanceRangeFromKm(km) {
  if (!Number.isFinite(km)) return undefined;
  if (km <= 2) return "0-2 km";
  if (km <= 5) return "2-5 km";
  if (km <= 10) return "5-10 km";
  return "10+ km";
}

// Get all accommodations
router.get("/", async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single accommodation
router.get("/:id", async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) return res.status(404).json({ message: "Accommodation not found" });
    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create accommodation
router.post("/", async (req, res) => {
  try {
    const {
      hostelName,
      universityName,
      city,
      roomType,
      distanceKm,
      distance,
      distanceRange,
      moveInDate,
      moveIn,
      nearBy,
      rating,
      budget,
      pricePerWeek,
      status,
      services,
      amenities,
      description,
      contact,
      name,
      universityNearby,
    } = req.body;

    const normalizedHostelName = hostelName || name;
    const normalizedUniversityName = universityName || universityNearby;
    const normalizedBudget = typeof budget !== "undefined" ? budget : pricePerWeek;
    const normalizedMoveInDate = moveInDate || moveIn;
    const normalizedServices = Array.isArray(services)
      ? services
      : Array.isArray(amenities)
        ? amenities
        : undefined;
    const normalizedDistanceKm = typeof distanceKm !== "undefined" ? distanceKm : distance;
    const normalizedDistanceRange = distanceRange || distanceRangeFromKm(Number(normalizedDistanceKm));
    const normalizedStatus = normalizeStatus(status) || "Unverified";

    if (!normalizedHostelName || !normalizedUniversityName || !city || !roomType || typeof normalizedBudget === "undefined") {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const accommodation = new Accommodation({
      hostelName: normalizedHostelName,
      universityName: normalizedUniversityName,
      city,
      roomType,
      distanceKm: typeof normalizedDistanceKm !== "undefined" ? Number(normalizedDistanceKm) : undefined,
      distanceRange: normalizedDistanceRange,
      moveInDate: normalizedMoveInDate ? new Date(normalizedMoveInDate) : undefined,
      nearBy,
      rating: typeof rating !== "undefined" ? Number(rating) : undefined,
      budget: Number(normalizedBudget),
      status: normalizedStatus,
      services: normalizedServices,
      description,
      contact,

      // legacy mirrors
      name: normalizedHostelName,
      universityNearby: normalizedUniversityName,
      pricePerWeek: Number(normalizedBudget),
      amenities: normalizedServices,
      moveIn: normalizedMoveInDate ? new Date(normalizedMoveInDate) : undefined,
    });
    await accommodation.save();
    res.status(201).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update accommodation
router.put("/:id", async (req, res) => {
  try {
    const {
      hostelName,
      universityName,
      city,
      roomType,
      distanceKm,
      distance,
      distanceRange,
      moveInDate,
      moveIn,
      nearBy,
      rating,
      budget,
      pricePerWeek,
      status,
      services,
      amenities,
      description,
      contact,
      name,
      universityNearby,
    } = req.body;

    const normalizedHostelName = hostelName || name;
    const normalizedUniversityName = universityName || universityNearby;
    const normalizedBudget = typeof budget !== "undefined" ? budget : pricePerWeek;
    const normalizedMoveInDate = moveInDate || moveIn;
    const normalizedServices = Array.isArray(services)
      ? services
      : Array.isArray(amenities)
        ? amenities
        : undefined;
    const normalizedDistanceKm = typeof distanceKm !== "undefined" ? distanceKm : distance;
    const normalizedDistanceRange = distanceRange || distanceRangeFromKm(Number(normalizedDistanceKm));
    const normalizedStatus = normalizeStatus(status);

    const update = {
      ...req.body,
      hostelName: normalizedHostelName,
      universityName: normalizedUniversityName,
      budget: typeof normalizedBudget !== "undefined" ? Number(normalizedBudget) : undefined,
      moveInDate: normalizedMoveInDate ? new Date(normalizedMoveInDate) : undefined,
      distanceKm: typeof normalizedDistanceKm !== "undefined" ? Number(normalizedDistanceKm) : undefined,
      distanceRange: normalizedDistanceRange,
      rating: typeof rating !== "undefined" ? Number(rating) : undefined,
      services: normalizedServices,
      description,
      contact,
    };

    if (normalizedStatus) update.status = normalizedStatus;

    // legacy mirrors
    if (normalizedHostelName) update.name = normalizedHostelName;
    if (normalizedUniversityName) update.universityNearby = normalizedUniversityName;
    if (typeof normalizedBudget !== "undefined") update.pricePerWeek = Number(normalizedBudget);
    if (normalizedServices) update.amenities = normalizedServices;
    if (normalizedMoveInDate) update.moveIn = new Date(normalizedMoveInDate);

    const accommodation = await Accommodation.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!accommodation) return res.status(404).json({ message: "Accommodation not found" });
    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete accommodation
router.delete("/:id", async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!accommodation) return res.status(404).json({ message: "Accommodation not found" });
    res.status(200).json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get live Amber Student API listings
router.get("/amber/live", async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const axios = require("axios");
    
    const apiUrl = process.env.AMBER_API_URL;
    if (!apiUrl) {
      return res.status(400).json({ 
        message: "Amber API not configured",
        error: "AMBER_API_URL not set in environment"
      });
    }
    
    const limit = parseInt(process.env.AMBER_API_LIMIT || "50");
    const url = `${apiUrl}?page=${page}&limit=${limit}`;
    
    console.log(`[Accommodation Routes] Fetching Amber API: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Jawily-Edu/1.0' }
    });
    
    if (response.data && response.data.data) {
      const result = response.data.data.result || [];
      const meta = response.data.data.meta || {};
      
      return res.status(200).json({
        message: "success",
        data: {
          meta,
          listings: result,
          total: result.length,
          page: meta.current_page || 1,
          totalPages: meta.pages ? meta.pages.length : 1
        }
      });
    }
    
    res.status(200).json({ message: "success", data: { listings: [], meta: {} } });
  } catch (error) {
    console.error("[Amber API Error]", error.message);
    res.status(500).json({ 
      message: "Failed to fetch from Amber API", 
      error: error.message 
    });
  }
});

// Sync Amber Student API data to MongoDB
router.post("/amber/sync", async (req, res) => {
  try {
    const { page = 1 } = req.body;
    const { fetchFromAmberAPI } = require("../services/accommodationFetcher");
    
    console.log("[Accommodation Routes] Syncing Amber data to MongoDB...");
    
    const listings = await fetchFromAmberAPI(page);
    let created = 0;
    let updated = 0;
    let errors = 0;
    
    for (const listing of listings) {
      try {
        const filter = {
          hostelName: listing.hostelName,
          city: listing.city,
        };
        
        const update = {
          hostelName: listing.hostelName,
          universityName: listing.universityName,
          city: listing.city,
          roomType: listing.roomType,
          distanceKm: listing.distanceKm,
          budget: listing.budget,
          rating: listing.rating,
          status: listing.status,
          services: listing.services,
          description: listing.description,
          contact: listing.contact,
          nearBy: listing.nearBy,
          moveInDate: listing.moveInDate ? new Date(listing.moveInDate) : undefined,
          // Store Amber-specific data
          amberId: listing.amberId,
          amberName: listing.amberName,
          amberPricing: listing.amberPricing,
          amberMeta: listing.amberMeta,
          amberImages: listing.images,
          source: listing.source,
        };
        
        const result = await Accommodation.findOneAndUpdate(
          filter,
          { $set: update },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        if (result.isNew) {
          created++;
        } else {
          updated++;
        }
      } catch (err) {
        errors++;
        console.error(`[Amber Sync] Error syncing "${listing.hostelName}":`, err.message);
      }
    }
    
    res.status(200).json({
      message: "Amber accommodation data synced successfully",
      stats: {
        total: listings.length,
        created,
        updated,
        errors,
        syncedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("[Amber Sync Error]", error.message);
    res.status(500).json({ 
      message: "Failed to sync Amber data", 
      error: error.message 
    });
  }
});

module.exports = router;
