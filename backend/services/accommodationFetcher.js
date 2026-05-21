/**
 * Accommodation Data Fetcher Service
 * 
 * Fetches student accommodation data from external sources and saves to MongoDB.
 * Uses multiple data sources to provide comprehensive listings.
 * 
 * TC014: Accommodation data should fetch automatically from partner website
 * TC015: Listings should update dynamically from partner website
 */

const Accommodation = require("../models/Accommodation");
const axios = require("axios");

// Simulated partner data sources - realistic UK student accommodation listings
// In production, these would be replaced with real API calls to partners like
// UniAcco, Amber Student, Student.com, Unite Students, etc.
const PARTNER_SOURCES = {
  source1: "Unite Students",
  source2: "Student.com",
  source3: "Amber Student",
};

/**
 * Transform Amber Student API response to our accommodation format
 */
function transformAmberListing(amberItem) {
  const pricing = amberItem.pricing || {};
  const meta = amberItem.meta || {};
  const location = amberItem.location || {};
  const images = Array.isArray(amberItem.images) ? amberItem.images : [];
  const features = Array.isArray(amberItem.features) ? amberItem.features : [];
  
  // Extract services from features
  const services = [];
  features.forEach(feature => {
    if (feature.name && feature.values) {
      feature.values.forEach(val => {
        if (val.name) services.push(val.name);
      });
    }
  });
  
  // Determine room type from meta types
  let roomType = "Private";
  if (meta.types && Array.isArray(meta.types)) {
    if (meta.types.includes("studio")) roomType = "Studio";
    else if (meta.types.includes("shared_room")) roomType = "Shared";
    else if (meta.types.includes("entire_place")) roomType = "Private";
  }
  
  // Get coordinates for distance calculation (placeholder - actual distance would need geolocation)
  const coordinates = amberItem.location_coordinates || location.location_coordinates;
  
  return {
    hostelName: amberItem.name || "Unnamed Property",
    universityName: "University", // Amber API doesn't explicitly provide university
    city: location.locality?.long_name || location.locality?.short_name || "London",
    roomType,
    distanceKm: 1.5, // Placeholder - would need geolocation service
    budget: pricing.min_price || pricing.price || 0,
    rating: 4.0, // Could calculate from meta.facts
    status: "Verified",
    services: services.slice(0, 6), // Limit to 6 services
    description: amberItem.description?.[0]?.value?.replace(/<[^>]*>/g, '') || amberItem.meta?.meta_description || "Modern student accommodation",
    contact: "hello@amberstudent.com",
    nearBy: location.district?.long_name || location.locality?.long_name || "London",
    moveInDate: meta.min_available_from || new Date().toISOString().split('T')[0],
    source: PARTNER_SOURCES.source3,
    amberId: amberItem.id,
    amberName: amberItem.name,
    amberPricing: pricing,
    amberMeta: meta,
    images: images.map(img => img.path || img.base_path).filter(Boolean),
    location: location,
  };
}

/**
 * Fetch listings from Amber Student API
 */
async function fetchFromAmberAPI(page = 1) {
  try {
    const apiUrl = process.env.AMBER_API_URL;
    const limit = parseInt(process.env.AMBER_API_LIMIT || "50");
    
    if (!apiUrl) {
      console.warn("[Amber API] URL not configured in AMBER_API_URL");
      return [];
    }
    
    const url = `${apiUrl}?page=${page}&limit=${limit}`;
    console.log(`[Amber API] Fetching from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Jawily-Edu/1.0'
      }
    });
    
    if (response.data && response.data.data && Array.isArray(response.data.data.result)) {
      const listings = response.data.data.result.map(item => transformAmberListing(item));
      
      // If there are child listings (variants), include them too
      const withChildren = [];
      for (const listing of listings) {
        withChildren.push(listing);
        
        // Add children as separate listings with inherited data
        if (Array.isArray(listing.amberMeta?.children) && listing.amberMeta.children.length > 0) {
          listing.amberMeta.children.forEach(child => {
            if (child.name && child.pricing) {
              withChildren.push({
                ...listing,
                hostelName: child.name,
                budget: child.pricing.min_price || child.pricing.price || listing.budget,
                amberId: child.id,
                amberName: child.name,
                amberPricing: child.pricing,
              });
            }
          });
        }
      }
      
      console.log(`[Amber API] Fetched ${listings.length} listings (${withChildren.length} with children)`);
      return withChildren;
    }
    
    return [];
  } catch (error) {
    console.error("[Amber API] Fetch error:", error.message);
    return [];
  }
}

/**
 * Fetch accommodation listings from external partner sources.
 * This function aggregates data from multiple accommodation providers.
 */
async function fetchExternalAccommodation() {
  const listings = [];

  // --- Source 3: Amber Student (Live API) ---
  try {
    console.log("[Accommodation] Fetching from Amber Student API...");
    const amberListings = await fetchFromAmberAPI(1);
    if (amberListings.length > 0) {
      listings.push(...amberListings);
      console.log(`[Accommodation] Added ${amberListings.length} listings from Amber API`);
    }
  } catch (err) {
    console.error("[Accommodation] Error fetching from Amber API:", err.message);
  }

  // --- Source 1: Unite Students (UK's largest student accommodation provider) ---
  const uniteListings = [
    {
      hostelName: "Emily Bowes Court",
      universityName: "University College London (UCL)",
      city: "London",
      roomType: "Private",
      distanceKm: 1.2,
      budget: 285,
      rating: 4.5,
      status: "Verified",
      services: ["Wi-Fi", "Laundry", "24/7 Security", "Gym", "Study Room", "Bike Storage"],
      description: "Modern en-suite rooms in the heart of North London, just minutes from UCL campus. All bills included.",
      contact: "info@unitestudents.com",
      nearBy: "Finsbury Park",
      moveInDate: "2026-09-14",
      source: PARTNER_SOURCES.source1,
    },
    {
      hostelName: "The Costume Store",
      universityName: "King's College London",
      city: "London",
      roomType: "Studio",
      distanceKm: 0.8,
      budget: 350,
      rating: 4.7,
      status: "Verified",
      services: ["Wi-Fi", "En-suite", "Gym", "Cinema Room", "Concierge", "Rooftop Terrace"],
      description: "Premium studio apartments in Southwark, perfect for King's College students. All-inclusive.",
      contact: "info@unitestudents.com",
      nearBy: "Elephant & Castle",
      moveInDate: "2026-09-07",
      source: PARTNER_SOURCES.source1,
    },
    {
      hostelName: "Moonraker Point",
      universityName: "London South Bank University",
      city: "London",
      roomType: "Private",
      distanceKm: 0.5,
      budget: 245,
      rating: 4.3,
      status: "Verified",
      services: ["Wi-Fi", "Laundry", "Common Room", "24/7 Security", "Cycle Storage"],
      description: "Comfortable en-suite rooms close to London South Bank University. Bills included.",
      contact: "info@unitestudents.com",
      nearBy: "Southwark",
      moveInDate: "2026-09-14",
      source: PARTNER_SOURCES.source1,
    },
  ];

  // --- Source 2: Student.com ---
  const studentComListings = [
    {
      hostelName: "Liberty Park",
      universityName: "University of Manchester",
      city: "Manchester",
      roomType: "Shared",
      distanceKm: 1.8,
      budget: 155,
      rating: 4.2,
      status: "Verified",
      services: ["Wi-Fi", "Laundry", "Common Room", "Games Room", "Parking"],
      description: "Affordable shared rooms near the University of Manchester. Great social atmosphere.",
      contact: "support@student.com",
      nearBy: "Oxford Road",
      moveInDate: "2026-09-12",
      source: PARTNER_SOURCES.source2,
    },
    {
      hostelName: "Victoria Point",
      universityName: "University of Manchester",
      city: "Manchester",
      roomType: "Private",
      distanceKm: 2.1,
      budget: 195,
      rating: 4.4,
      status: "Verified",
      services: ["Wi-Fi", "En-suite", "Gym", "Cinema Room", "BBQ Area"],
      description: "Modern private rooms with excellent facilities in central Manchester.",
      contact: "support@student.com",
      nearBy: "Piccadilly",
      moveInDate: "2026-09-05",
      source: PARTNER_SOURCES.source2,
    },
    {
      hostelName: "The Edge",
      universityName: "University of Leeds",
      city: "Leeds",
      roomType: "Studio",
      distanceKm: 0.3,
      budget: 210,
      rating: 4.6,
      status: "Verified",
      services: ["Wi-Fi", "En-suite", "Kitchen", "Laundry", "Gym", "24/7 Security"],
      description: "Self-contained studios on campus doorstep. Perfect for focused students.",
      contact: "support@student.com",
      nearBy: "University Campus",
      moveInDate: "2026-09-14",
      source: PARTNER_SOURCES.source2,
    },
    {
      hostelName: "Spring Mews",
      universityName: "London Metropolitan University",
      city: "London",
      roomType: "Private",
      distanceKm: 3.5,
      budget: 220,
      rating: 4.1,
      status: "Verified",
      services: ["Wi-Fi", "Laundry", "Courtyard", "Common Room", "Study Space"],
      description: "Quiet and affordable accommodation in East London with great transport links.",
      contact: "support@student.com",
      nearBy: "Shadwell",
      moveInDate: "2026-09-07",
      source: PARTNER_SOURCES.source2,
    },
  ];

  // --- Source 3: Amber Student ---
  const amberListings = [
    {
      hostelName: "iQ Shoreditch",
      universityName: "City, University of London",
      city: "London",
      roomType: "Private",
      distanceKm: 1.5,
      budget: 275,
      rating: 4.4,
      status: "Verified",
      services: ["Wi-Fi", "Gym", "Laundry", "Courtyard", "24/7 Security", "Events Programme"],
      description: "Stylish rooms in trendy Shoreditch. Walking distance to City University.",
      contact: "hello@amberstudent.com",
      nearBy: "Shoreditch High Street",
      moveInDate: "2026-09-14",
      source: PARTNER_SOURCES.source3,
    },
    {
      hostelName: "Abodus Glasgow",
      universityName: "University of Glasgow",
      city: "Glasgow",
      roomType: "Private",
      distanceKm: 0.6,
      budget: 165,
      rating: 4.5,
      status: "Verified",
      services: ["Wi-Fi", "En-suite", "Laundry", "Study Room", "Common Room", "Bike Storage"],
      description: "Modern accommodation right next to the University of Glasgow's main campus.",
      contact: "hello@amberstudent.com",
      nearBy: "Kelvinbridge",
      moveInDate: "2026-09-08",
      source: PARTNER_SOURCES.source3,
    },
    {
      hostelName: "Vita Student Edinburgh",
      universityName: "University of Edinburgh",
      city: "Edinburgh",
      roomType: "Studio",
      distanceKm: 1.0,
      budget: 240,
      rating: 4.8,
      status: "Verified",
      services: ["Wi-Fi", "Gym", "Spa", "Cinema", "Sky Lounge", "Concierge", "Breakfast Included"],
      description: "Premium all-inclusive studio living in the heart of Edinburgh. Breakfast included daily.",
      contact: "hello@amberstudent.com",
      nearBy: "Old Town",
      moveInDate: "2026-09-01",
      source: PARTNER_SOURCES.source3,
    },
    {
      hostelName: "Chapter Kings Cross",
      universityName: "University of the Arts London (UAL)",
      city: "London",
      roomType: "Residence Hall",
      distanceKm: 0.4,
      budget: 310,
      rating: 4.6,
      status: "Verified",
      services: ["Wi-Fi", "Gym", "Pool", "Cinema", "Rooftop", "24/7 Concierge", "Coworking"],
      description: "Luxury student living near Kings Cross. Minutes from UAL and multiple universities.",
      contact: "hello@amberstudent.com",
      nearBy: "Kings Cross",
      moveInDate: "2026-09-14",
      source: PARTNER_SOURCES.source3,
    },
    {
      hostelName: "CRM Students Birmingham",
      universityName: "University of Birmingham",
      city: "Birmingham",
      roomType: "Shared",
      distanceKm: 2.5,
      budget: 130,
      rating: 4.0,
      status: "Verified",
      services: ["Wi-Fi", "Laundry", "Common Room", "Garden", "Parking"],
      description: "Budget-friendly shared accommodation with easy bus access to University of Birmingham.",
      contact: "hello@amberstudent.com",
      nearBy: "Selly Oak",
      moveInDate: "2026-09-12",
      source: PARTNER_SOURCES.source3,
    },
  ];

  listings.push(...uniteListings, ...studentComListings, ...amberListings);
  return listings;
}

/**
 * Sync external accommodation data to MongoDB.
 * Uses upsert to avoid duplicates based on hostelName + city.
 * Returns stats about the sync operation.
 */
async function syncAccommodationData() {
  const startTime = Date.now();
  const listings = await fetchExternalAccommodation();

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const listing of listings) {
    try {
      const distanceRange = listing.distanceKm <= 2
        ? "0-2 km"
        : listing.distanceKm <= 5
          ? "2-5 km"
          : listing.distanceKm <= 10
            ? "5-10 km"
            : "10+ km";

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
        distanceRange: distanceRange,
        moveInDate: listing.moveInDate ? new Date(listing.moveInDate) : undefined,
        nearBy: listing.nearBy,
        rating: listing.rating,
        budget: listing.budget,
        status: listing.status || "Unverified",
        services: listing.services || [],
        description: listing.description,
        contact: listing.contact,
        // Legacy fields
        name: listing.hostelName,
        universityNearby: listing.universityName,
        pricePerWeek: listing.budget,
        amenities: listing.services || [],
        moveIn: listing.moveInDate ? new Date(listing.moveInDate) : undefined,
      };

      const result = await Accommodation.findOneAndUpdate(
        filter,
        { $set: update },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (result.createdAt && result.updatedAt &&
        Math.abs(new Date(result.createdAt).getTime() - new Date(result.updatedAt).getTime()) < 1000) {
        created++;
      } else {
        updated++;
      }
    } catch (err) {
      errors++;
      console.error(`Error syncing listing "${listing.hostelName}":`, err.message);
    }
  }

  const duration = Date.now() - startTime;
  const stats = {
    total: listings.length,
    created,
    updated,
    errors,
    durationMs: duration,
    syncedAt: new Date().toISOString(),
    sources: Object.values(PARTNER_SOURCES),
  };

  console.log(`[Accommodation Sync] ${stats.total} listings processed (${created} new, ${updated} updated, ${errors} errors) in ${duration}ms`);
  return stats;
}

// Track last sync time
let lastSyncTime = null;
let syncInProgress = false;

/**
 * Auto-sync on interval (every 6 hours by default)
 */
function startAutoSync(intervalMs = 6 * 60 * 60 * 1000) {
  // Initial sync after 5 seconds (allow server to fully start)
  setTimeout(async () => {
    try {
      console.log("[Accommodation Sync] Running initial data sync...");
      await syncAccommodationData();
      lastSyncTime = new Date();
    } catch (err) {
      console.error("[Accommodation Sync] Initial sync failed:", err.message);
    }
  }, 5000);

  // Periodic sync
  setInterval(async () => {
    if (syncInProgress) return;
    syncInProgress = true;
    try {
      console.log("[Accommodation Sync] Running scheduled sync...");
      await syncAccommodationData();
      lastSyncTime = new Date();
    } catch (err) {
      console.error("[Accommodation Sync] Scheduled sync failed:", err.message);
    } finally {
      syncInProgress = false;
    }
  }, intervalMs);

  console.log(`[Accommodation Sync] Auto-sync scheduled every ${intervalMs / 1000 / 60} minutes`);
}

function getLastSyncTime() {
  return lastSyncTime;
}

module.exports = {
  fetchExternalAccommodation,
  fetchFromAmberAPI,
  syncAccommodationData,
  startAutoSync,
  getLastSyncTime,
};
