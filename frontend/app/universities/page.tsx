"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from "../../lib/api";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function UniversitiesPage() {
  return (
    <Suspense fallback={null}>
      <UniversitiesPageInner />
    </Suspense>
  );
}

function UniversitiesPageInner() {
  const searchParams = useSearchParams();
  const didInitFromUrl = useRef(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 30;

  const [draftName, setDraftName] = useState("");
  const [draftCity, setDraftCity] = useState("");
  const [draftCountry, setDraftCountry] = useState("");

  const [nameFilter, setNameFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  useEffect(() => {
    if (didInitFromUrl.current) return;
    if (!searchParams) return;

    const qpCountry = searchParams.get("country") || "";
    const qpName = searchParams.get("name") || "";

    if (qpCountry || qpName) {
      setDraftCountry(qpCountry);
      setDraftName(qpName);

      setCountryFilter(qpCountry);
      setNameFilter(qpName);

      setPage(1);
    }

    didInitFromUrl.current = true;
  }, [searchParams]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_ENDPOINTS.UNIVERSITIES, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch universities");
        const data = await res.json();
        setUniversities(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch universities");
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const displayUniversities = useMemo(() => {
    return universities.map((u): {
      _id: string | undefined;
      name: string;
      country: string;
      city: string;
      rank: number | undefined;
    } => {
      const city = u.city || u.location || "";
      const rawRank = typeof u.rank !== "undefined" ? u.rank : u.ranking;
      const rank = typeof rawRank !== "undefined" && rawRank !== null ? Number(rawRank) : undefined;
      return {
        _id: u._id,
        name: u.name,
        country: u.country,
        city,
        rank,
      };
    });
  }, [universities]);

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const u of displayUniversities) {
      if (u.country) set.add(u.country);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [displayUniversities]);

  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    for (const u of displayUniversities) {
      if (u.city) set.add(u.city);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [displayUniversities]);

  const universityNameOptions = useMemo(() => {
    const set = new Set<string>();
    for (const u of displayUniversities) {
      if (u.name) set.add(u.name);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [displayUniversities]);

  const filteredUniversities = useMemo(() => {
    const nameQ = nameFilter.trim().toLowerCase();
    const cityQ = cityFilter.trim().toLowerCase();
    const countryQ = countryFilter.trim().toLowerCase();

    return displayUniversities.filter((u) => {
      const matchesName = !nameQ || (u.name || "").toLowerCase().includes(nameQ);
      const matchesCity = !cityQ || (u.city || "").toLowerCase().includes(cityQ);
      const matchesCountry = !countryQ || (u.country || "").toLowerCase() === countryQ;
      return matchesName && matchesCity && matchesCountry;
    });
  }, [displayUniversities, nameFilter, cityFilter, countryFilter]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredUniversities.length / pageSize));
  }, [filteredUniversities.length]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pagedUniversities = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUniversities.slice(start, start + pageSize);
  }, [filteredUniversities, page]);

  const applyFilters = () => {
    setNameFilter(draftName);
    setCityFilter(draftCity);
    setCountryFilter(draftCountry);
    setPage(1);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Universities
            </h1>
            <p className="mt-3 text-black/70 max-w-2xl">
              Browse universities and explore entry requirements, fees and scholarships.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a
              href="/apply"
              className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
            >
              Book Consultation
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-10 rounded-2xl border border-black/10 p-5 md:p-6">
          <div className="grid md:grid-cols-4 gap-3">
            <select
              className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            >
              <option value="">University</option>
              {universityNameOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
              value={draftCity}
              onChange={(e) => setDraftCity(e.target.value)}
            >
              <option value="">City</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
              value={draftCountry}
              onChange={(e) => setDraftCountry(e.target.value)}
            >
              <option value="">Country</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={applyFilters}
              className="w-full rounded-xl bg-black text-white font-semibold py-3 hover:opacity-90 cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-black/60">
            Showing <span className="font-semibold text-black">{filteredUniversities.length}</span>{" "}
            universities
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="mt-6 text-sm text-black/60">Loading universities...</div>
        ) : error ? (
          <div className="mt-6 text-sm text-red-600">{error}</div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagedUniversities.map((u) => (
              <UniversityCard
                key={u._id || u.name}
                name={u.name}
                country={u.country}
                city={u.city}
                rank={typeof u.rank === "number" ? u.rank : undefined}
              />
            ))}
          </div>
        )}

        {/* Pagination UI */}
        {filteredUniversities.length > pageSize ? (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-full border border-black/15 font-semibold hover:border-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-black text-white font-semibold"
            >
              {page}
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-full border border-black/15 font-semibold hover:border-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
      <Footer />
    </>
  );
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function UniversityCard({
  name,
  country,
  city,
  rank,
}: {
  name: string;
  country: string;
  city: string;
  rank: number | undefined;
}) {
  const slug = slugify(name);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 hover:border-black/25 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight">{name}</h3>
          <p className="text-sm text-black/60 mt-1">
            {country}{city ? ` • ${city}` : ""}{typeof rank !== "undefined" ? ` • Rank ${rank}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2 flex-wrap">
        <a
          href={`/universities/${slug}`}
          className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90"
        >
          View Details
        </a>
        <a
          href="/apply"
          className="px-4 py-2 rounded-full border border-black/15 text-sm font-semibold hover:border-black/30"
        >
          Apply
        </a>
      </div>
    </div>
  );
}
