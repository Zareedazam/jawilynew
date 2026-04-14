"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from "../../lib/api";

type RoomType = "Any" | "Shared" | "Private" | "Studio" | "Residence Hall";
type Distance = "Any" | "0-2 km" | "2-5 km" | "5-10 km" | "10+ km";

type Property = {
  _id: string;
  hostelName: string;
  universityName: string;
  city: string;
  roomType: Exclude<RoomType, "Any">;
  budget: number;
  distanceKm?: number;
  distanceRange?: "0-2 km" | "2-5 km" | "5-10 km" | "10+ km";
  moveInDate?: string; // ISO or YYYY-MM-DD
  nearBy?: string;
  rating?: number; // 1-5
  status?: "Verified" | "Unverified";
  services?: string[];
  description?: string;
  contact?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMoney(n: number) {
  return `£${n}/wk`;
}

function distanceLabel(km: number) {
  if (km <= 2) return "0-2 km";
  if (km <= 5) return "2-5 km";
  if (km <= 10) return "5-10 km";
  return "10+ km";
}

function normalizeStatus(input: unknown): "Verified" | "Unverified" | undefined {
  if (!input) return undefined;
  const s = String(input).trim().toLowerCase();
  if (s === "verified" || s === "active") return "Verified";
  if (s === "unverified" || s === "inactive") return "Unverified";
  return undefined;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AccommodationPage() {
  return (
    <Suspense fallback={null}>
      <AccommodationPageInner />
    </Suspense>
  );
}

function AccommodationPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didInitFromUrl = useRef(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("Any");
  const [distance, setDistance] = useState<Distance>("Any");
  const [moveIn, setMoveIn] = useState<string>("");
  const [facilityQuery, setFacilityQuery] = useState<string>("Any");
  const [budget, setBudget] = useState<number>(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    if (didInitFromUrl.current) return;
    if (!searchParams) return;

    const qpQ = searchParams.get("q");
    const qpMoveIn = searchParams.get("moveIn");
    const qpBudget = searchParams.get("budget");

    if (qpQ) setQuery(qpQ);
    if (qpMoveIn) setMoveIn(qpMoveIn);

    if (qpBudget) {
      const n = Number(qpBudget);
      if (Number.isFinite(n) && n > 0) setBudget(n);
    }

    didInitFromUrl.current = true;
  }, [searchParams]);

  const budgetOptions = useMemo(() => {
    const set = new Set<number>();
    properties.forEach((p) => {
      const n = Number(p.budget);
      if (Number.isFinite(n) && n > 0) set.add(n);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [properties]);

  const serviceOptions = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      (Array.isArray(p.services) ? p.services : []).forEach((s) => {
        const v = String(s || "").trim();
        if (v) set.add(v);
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [properties]);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.ACCOMMODATION);
        if (!response.ok) throw new Error("Failed to fetch accommodation");
        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        const normalized: Property[] = list.map((p: any) => {
          const hostelName = p?.hostelName || p?.name || "";
          const universityName = p?.universityName || p?.universityNearby || "";
          const moveInDate = p?.moveInDate || p?.moveIn || undefined;
          const budgetValue = typeof p?.budget !== "undefined" ? p.budget : p?.pricePerWeek;
          const services = Array.isArray(p?.services) ? p.services : (Array.isArray(p?.amenities) ? p.amenities : undefined);
          const distanceKmValue = typeof p?.distanceKm !== "undefined" ? Number(p.distanceKm) : undefined;
          const distanceRangeValue = p?.distanceRange || (typeof distanceKmValue === "number" ? distanceLabel(distanceKmValue) : undefined);
          const statusValue = normalizeStatus(p?.status);

          return {
            _id: p?._id,
            hostelName,
            universityName,
            city: p?.city || "",
            roomType: p?.roomType,
            budget: typeof budgetValue !== "undefined" ? Number(budgetValue) : 0,
            distanceKm: distanceKmValue,
            distanceRange: distanceRangeValue,
            moveInDate,
            nearBy: p?.nearBy,
            rating: typeof p?.rating !== "undefined" ? Number(p.rating) : undefined,
            status: statusValue,
            services,
            description: p?.description,
            contact: p?.contact,
          } as Property;
        });

        setProperties(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching accommodation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fq = facilityQuery.trim().toLowerCase();

    return properties.filter((p) => {
      const matchesQuery =
        !q ||
        p.city.toLowerCase().includes(q) ||
        String(p.universityName || "").toLowerCase().includes(q) ||
        String(p.hostelName || "").toLowerCase().includes(q) ||
        String(p.nearBy || "").toLowerCase().includes(q);

      const matchesRoomType = roomType === "Any" ? true : p.roomType === roomType;

      const matchesBudget = Number.isFinite(p.budget) ? p.budget <= budget : true;

      const matchesDistance =
        distance === "Any"
          ? true
          : (p.distanceRange ? p.distanceRange === distance : distanceLabel(Number((p as unknown as { distanceKm?: unknown }).distanceKm || 0)) === distance);

      const matchesMoveIn =
        !moveIn ? true : (p.moveInDate ? new Date(p.moveInDate) <= new Date(moveIn) : true);

      const amenities = Array.isArray(p.services) ? p.services : [];
      const matchesFacility =
        !fq || fq === "any" ? true : amenities.some((a) => String(a).toLowerCase() === fq);

      return (
        matchesQuery &&
        matchesRoomType &&
        matchesBudget &&
        matchesDistance &&
        matchesMoveIn &&
        matchesFacility
      );
    }).sort((a, b) => {
      // verified first, then rating, then cheaper
      const sa = a.status === "Verified" ? 1 : 0;
      const sb = b.status === "Verified" ? 1 : 0;
      if (sb !== sa) return sb - sa;
      const ra = typeof a.rating === 'number' ? a.rating : 0;
      const rb = typeof b.rating === 'number' ? b.rating : 0;
      if (rb !== ra) return rb - ra;
      return a.budget - b.budget;
    });
  }, [query, roomType, distance, moveIn, facilityQuery, budget, properties]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Verified stays near campus
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Find Student Accommodation Fast
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                Search by city or university. Compare verified properties, prices,
                and move-in dates.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/contact" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm">
                  Get Free Shortlist
                </a>
                <a href="/contact" className="rounded-xl border px-5 py-3 text-sm font-medium">
                  Talk to Expert
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  No hidden charges
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Trusted listings
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Free support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-semibold">Why book with us</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            { t: "Verified Properties", d: "Trusted listings only." },
            { t: "Near Top Universities", d: "Stay close to campus." },
            { t: "Flexible Options", d: "Room types for all budgets." },
            { t: "Free Expert Support", d: "From shortlist to move-in." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border p-5">
              <div className="text-sm font-medium">{x.t}</div>
              <div className="mt-1 text-sm text-slate-600">{x.d}</div>
            </div>
          ))}
        </div>

        {/* Data Sources - TC014/TC015 */}
        <div className="mt-6 rounded-2xl border bg-slate-50 p-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-semibold">Live Partner Data Sources</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Accommodation listings are fetched automatically from partner websites and updated every 6 hours.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Unite Students", "Student.com", "Amber Student"].map((src) => (
              <span key={src} className="inline-flex items-center gap-1.5 rounded-full bg-white border px-3 py-1 text-xs font-medium text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {src}
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {properties.length} listings loaded • Auto-sync active
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        {/* FILTER BAR */}
        <div className="mb-5 rounded-2xl border bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-end">
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-slate-600">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City, university, hostel..."
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Room type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["Any", "Shared", "Private", "Studio", "Residence Hall"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Distance</label>
              <select
                value={distance}
                onChange={(e) => setDistance(e.target.value as Distance)}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["Any", "0-2 km", "2-5 km", "5-10 km", "10+ km"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Move-in by</label>
              <input
                value={moveIn}
                onChange={(e) => setMoveIn(e.target.value)}
                type="date"
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Budget (max)</label>
              <select
                value={String(budget)}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value={String(Number.MAX_SAFE_INTEGER)}>Any</option>
                {budgetOptions.map((n) => (
                  <option key={n} value={String(n)}>
                    £{n.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Services</label>
              <select
                value={facilityQuery}
                onChange={(e) => setFacilityQuery(e.target.value)}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="Any">Any</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Available stays</h2>
            <p className="text-sm text-slate-600">
              Showing {results.length} result{results.length === 1 ? "" : "s"}{" "}
              (sorted by verified, rating, then price)
            </p>
          </div>

          <div className="text-sm text-slate-600">
            Tip: search “city” or “university”
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {results.map((p) => (
              <article
                key={p._id}
                className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-slate-500">{p.city}</div>
                    <h3 className="mt-1 text-base font-semibold">{p.hostelName}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.status === "Verified" ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 whitespace-nowrap">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 whitespace-nowrap">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Room type</div>
                    <div className="mt-1 font-medium">{p.roomType}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Price</div>
                    <div className="mt-1 font-medium">£{p.budget.toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Distance</div>
                    <div className="mt-1 font-medium">
                      {p.distanceRange ? p.distanceRange : `${Number((p as unknown as { distanceKm?: unknown }).distanceKm ?? 0).toFixed(1)} km`}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Move-in</div>
                    <div className="mt-1 font-medium">{p.moveInDate ? new Date(p.moveInDate).toISOString().slice(0, 10) : "—"}</div>
                  </div>
                </div>


              <div className="mt-3 text-sm text-slate-600">
                University: <span className="font-medium">{p.universityName || '—'}</span>
              </div>

              <div className="mt-2 text-sm text-slate-600">
                Nearby: <span className="font-medium">{p.nearBy || '—'}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(Array.isArray(p.services) ? p.services : []).slice(0, 3).map((perk) => (
                  <span
                    key={perk}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                  >
                    {perk}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Rating:{" "}
                  <span className="font-medium">
                    {typeof p.rating === 'number' ? p.rating.toFixed(1) : '—'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/accommodation/${slugify(p.hostelName)}`)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
            <div className="text-sm font-medium">No matches found</div>
            <div className="mt-1 text-sm text-slate-600">
              Try changing hostel/city/university, increasing budget, or removing filters.
            </div>
          </div>
        )}
      </section>

      {/* TYPES + HOW IT WORKS */}
      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-semibold">Popular accommodation types</h2>
              <div className="mt-4 grid gap-3">
                {[
                  { t: "Shared Room", d: "Low budget students" },
                  { t: "Private Room", d: "More privacy" },
                  { t: "Studio Apartment", d: "Independent living" },
                  { t: "Residence Hall", d: "Campus life" },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4"
                  >
                    <div>
                      <div className="text-sm font-medium">{x.t}</div>
                      <div className="mt-1 text-sm text-slate-600">{x.d}</div>
                    </div>
                    <span className="text-sm text-slate-500">→</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-semibold">How it works</h2>
              <div className="mt-4 grid gap-3">
                {[
                  { s: "1", t: "Tell us your city & university", d: "Share your preferences." },
                  { s: "2", t: "Get a personalized shortlist", d: "Handpicked options." },
                  { s: "3", t: "Compare & choose", d: "Prices, distance, perks." },
                  { s: "4", t: "Book safely online", d: "Support till move-in." },
                ].map((x) => (
                  <div key={x.s} className="flex gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-sm font-semibold">
                      {x.s}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{x.t}</div>
                      <div className="mt-1 text-sm text-slate-600">{x.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-2xl border bg-white p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Ready to find your student home?
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Get a free shortlist made for your budget and move-in date.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="/contact" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                  Get Free Accommodation Help
                </a>
                <a href="/contact" className="rounded-xl border px-5 py-3 text-sm font-medium">
                  Talk to Expert
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>
      <Footer />
    </>
  );
}
