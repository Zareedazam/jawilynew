"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../../lib/api";
import { 
  FiSearch, 
  FiMapPin, 
  FiBookOpen, 
  FiDollarSign, 
  FiClock, 
  FiTag, 
  FiArrowRight,
  FiAward,
  FiFilter,
  FiChevronDown,
  FiX,
  FiCalendar,
  FiInfo,
  FiBriefcase,
  FiHeart,
  FiStar
} from "react-icons/fi";

type Country = string;
type Level = string;
type Funding = string;
type Deadline = string;

type Scholarship = {
  id: string;
  name: string;
  provider: string;
  country: Country;
  level: Level;
  funding: Funding;
  amountText: string;
  deadlineText: string;
  deadlineGroup: Deadline;
  tags: string[];
  note: string;
};

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function ScholarshipsPage() {
  return (
    <Suspense fallback={null}>
      <ScholarshipsPageInner />
    </Suspense>
  );
}

function ScholarshipsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didInitFromUrl = useRef(false);
  const [items, setItems] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<Country>("Any");
  const [level, setLevel] = useState<Level>("Any");
  const [funding, setFunding] = useState<Funding>("Any");
  const [deadline, setDeadline] = useState<Deadline>("Any");
  const [sort, setSort] = useState<"Best match" | "A-Z">("Best match");

  const countryOptions = useMemo(() => {
    const opts = Array.from(new Set(items.map((s) => s.country).filter(Boolean)))
      .map(String)
      .sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [items]);

  const levelOptions = useMemo(() => {
    const opts = Array.from(new Set(items.map((s) => s.level).filter(Boolean)))
      .map(String)
      .sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [items]);

  const fundingOptions = useMemo(() => {
    const opts = Array.from(new Set(items.map((s) => s.funding).filter(Boolean)))
      .map(String)
      .sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [items]);

  const deadlineOptions = useMemo(() => {
    const opts = Array.from(new Set(items.map((s) => s.deadlineGroup).filter(Boolean)))
      .map(String)
      .sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [items]);

  useEffect(() => {
    if (loading) return;
    if (country !== "Any" && !countryOptions.includes(country)) setCountry("Any");
    if (level !== "Any" && !levelOptions.includes(level)) setLevel("Any");
    if (funding !== "Any" && !fundingOptions.includes(funding)) setFunding("Any");
    if (deadline !== "Any" && !deadlineOptions.includes(deadline)) setDeadline("Any");
  }, [loading, country, countryOptions, deadline, deadlineOptions, funding, fundingOptions, level, levelOptions]);

  useEffect(() => {
    if (didInitFromUrl.current) return;
    if (!searchParams) return;

    const qpCountry = searchParams.get("country");
    const qpScholarship = searchParams.get("scholarship");
    const qpLevel = searchParams.get("level");

    if (qpCountry) setCountry(qpCountry);
    if (qpScholarship) setSearch(qpScholarship);
    if (qpLevel) setLevel(qpLevel);

    didInitFromUrl.current = true;
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/scholarships`, { cache: "no-store" as any });
        if (!res.ok) {
          setError(`Failed to load scholarships (HTTP ${res.status})`);
          return;
        }
        const data = await res.json();

        if (!Array.isArray(data)) {
          setError("Invalid scholarships response");
          return;
        }

        const mapped: Scholarship[] = data
          .map((x: any) => ({
            id: String(x._id || x.id || ""),
            name: String(x.name || ""),
            provider: String(x.provider || ""),
            country: String(x.country || ""),
            level: String(x.level || ""),
            funding: String(x.funding || ""),
            amountText: String(x.amountText || ""),
            deadlineText: String(x.deadlineText || ""),
            deadlineGroup: String(x.deadlineGroup || "Open"),
            tags: Array.isArray(x.tags) ? x.tags : [],
            note: String(x.note || ""),
          }))
          .filter((x: any) => x.id && x.name);

        setItems(mapped);
      } catch (e: any) {
        setError(e?.message || "Failed to load scholarships");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = items.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCountry = country === "Any" ? true : s.country === country;
      const matchesLevel = level === "Any" ? true : s.level === level;
      const matchesFunding = funding === "Any" ? true : s.funding === funding;
      const matchesDeadline = deadline === "Any" ? true : s.deadlineGroup === deadline;

      return (
        matchesSearch && matchesCountry && matchesLevel && matchesFunding && matchesDeadline
      );
    });

    if (sort === "A-Z") return filtered.sort((a, b) => a.name.localeCompare(b.name));

    // "Best match" = Open first, then others
    return filtered.sort((a, b) => {
      const aOpen = a.deadlineGroup.toLowerCase() === "open" ? 0 : 1;
      const bOpen = b.deadlineGroup.toLowerCase() === "open" ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      return a.name.localeCompare(b.name);
    });
  }, [search, country, level, funding, deadline, sort, items]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-violet-100/20 rounded-full blur-3xl" />
        </div>

        {/* HERO */}
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-700">
                  <FiAward className="w-4 h-4" />
                  Scholarships Finder
                </div>

                <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  Find Scholarships That Match You
                </h1>

                <p className="mt-3 text-lg text-slate-600 leading-relaxed">
                  Filter by country, level, funding type, and deadlines.
                  <br />
                  Get a clean shortlist in minutes.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#list"
                  className="group relative overflow-hidden rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Browse Scholarships
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="/contact"
                  className="group rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm px-6 py-3 text-sm font-medium hover:border-slate-400 hover:bg-white transition-all duration-300 flex items-center gap-2"
                >
                  Get Free Help
                </a>
              </div>
            </div>

            {/* FILTERS */}
            <div className="mt-10 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 to-slate-500/10 rounded-3xl blur-xl" />
              <div className="relative rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <FiFilter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter Scholarships</span>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                  <div className="lg:col-span-2">
                    <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <FiSearch className="w-3 h-3" /> Search
                    </label>
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Merit, STEM, need-based..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <FiMapPin className="w-3 h-3" /> Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25rem'
                      }}
                    >
                      {countryOptions.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <FiBookOpen className="w-3 h-3" /> Level
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25rem'
                      }}
                    >
                      {levelOptions.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <FiDollarSign className="w-3 h-3" /> Funding
                    </label>
                    <select
                      value={funding}
                      onChange={(e) => setFunding(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25rem'
                      }}
                    >
                      {fundingOptions.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <FiClock className="w-3 h-3" /> Deadline
                    </label>
                    <select
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25rem'
                      }}
                    >
                      {deadlineOptions.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <FiStar className="w-3 h-3" /> Sort
                    </label>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25rem'
                      }}
                    >
                      <option>Best match</option>
                      <option>A-Z</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setSearch("");
                      setCountry("Any");
                      setLevel("Any");
                      setFunding("Any");
                      setDeadline("Any");
                      setSort("Best match");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    Reset all filters
                  </button>
                </div>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* LIST */}
        <section id="list" className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold">Scholarships</h2>
              <p className="text-slate-600 text-sm mt-1">
                {loading ? "Loading..." : `Showing ${results.length} result${results.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              Tip: Apply early for best chance.
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Loading skeletons */}
            {loading && (
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-4 w-16 bg-slate-200 rounded"></div>
                        <div className="h-6 w-40 bg-slate-200 rounded"></div>
                        <div className="h-4 w-24 bg-slate-200 rounded"></div>
                      </div>
                      <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="h-16 bg-slate-200 rounded-xl"></div>
                      <div className="h-16 bg-slate-200 rounded-xl"></div>
                      <div className="h-16 bg-slate-200 rounded-xl"></div>
                      <div className="h-16 bg-slate-200 rounded-xl"></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                      <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="h-4 w-full bg-slate-200 rounded mt-3"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
                      <div className="h-10 w-20 bg-slate-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Actual results */}
            {!loading && results.map((s) => (
              <div
                key={s.id}
                className="group relative rounded-2xl border border-slate-200 bg-white p-5 hover:border-violet-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Decorative gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <FiMapPin className="w-3 h-3" /> {s.country}
                      </div>
                      <h3 className="mt-1 text-lg font-bold">{s.name}</h3>
                      <div className="mt-1 text-sm text-slate-600">{s.provider}</div>
                    </div>

                    <span className={cx(
                      "px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap",
                      s.deadlineGroup.toLowerCase() === "open"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : s.deadlineGroup.toLowerCase().includes("next 30") || s.deadlineGroup.toLowerCase().includes("soon")
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    )}>
                      {s.deadlineGroup}
                    </span>
                  </div>

                  {/* Key details grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 group-hover:bg-white transition-colors">
                      <FiBookOpen className="w-4 h-4 text-slate-400 mb-1" />
                      <div className="text-xs text-slate-500">Level</div>
                      <div className="text-sm font-semibold truncate">{s.level}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 group-hover:bg-white transition-colors">
                      <FiDollarSign className="w-4 h-4 text-slate-400 mb-1" />
                      <div className="text-xs text-slate-500">Funding</div>
                      <div className="text-sm font-semibold truncate">{s.funding}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 group-hover:bg-white transition-colors">
                      <FiAward className="w-4 h-4 text-slate-400 mb-1" />
                      <div className="text-xs text-slate-500">Amount</div>
                      <div className="text-sm font-semibold truncate">{s.amountText}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 group-hover:bg-white transition-colors">
                      <FiCalendar className="w-4 h-4 text-slate-400 mb-1" />
                      <div className="text-xs text-slate-500">Deadline</div>
                      <div className="text-sm font-semibold truncate">{s.deadlineText}</div>
                    </div>
                  </div>

                  {/* Tags */}
                  {s.tags && s.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                        >
                          <FiTag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {s.tags.length > 3 && (
                        <span className="text-xs text-slate-500">+{s.tags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Note */}
                  {s.note && (
                    <p className="mt-3 text-sm text-slate-600 line-clamp-2">{s.note}</p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg">
                       Get Help
                    </button>
                    <button
                      onClick={() => router.push(`/scholarships/${encodeURIComponent(s.id)}`)}
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium hover:border-slate-400 hover:bg-slate-50 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && results.length === 0 && (
            <div className="mt-8 text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
                <FiInfo className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No scholarships found</h3>
              <p className="text-slate-600">Try adjusting your filters or search criteria.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCountry("Any");
                  setLevel("Any");
                  setFunding("Any");
                  setDeadline("Any");
                  setSort("Best match");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* FREE HELP CTA */}
        <section id="help" className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 to-slate-500/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-violet-100 p-3">
                      <FiHeart className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Want a scholarship shortlist for your profile?</h3>
                      <p className="text-slate-600 mt-1">
                        Tell us your course + country. We'll share matches and next steps.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a href="/contact" className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors shadow-lg">
                      Get Free Shortlist
                    </a>
                    <a href="/contact" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium hover:border-slate-400 transition-colors">
                      Talk to Expert
                    </a>
                  </div>
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