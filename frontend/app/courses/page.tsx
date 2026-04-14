"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from "../../lib/api";

type Level = "Any" | "Undergraduate" | "Postgraduate" | "PhD" | "Diploma";
type Mode = "Any" | "Full-time" | "Part-time" | "Online" | "Hybrid";

type Course = {
  _id: string;
  title: string;
  university: string;
  level: Exclude<Level, "Any">;
  mode: Exclude<Mode, "Any">;
  fee: number;
  duration: string;
  startDate: string;
  description?: string;
};

type University = {
  name?: string;
  country?: string;
};

export default function CoursePage() {
  return (
    <Suspense fallback={null}>
      <CoursePageInner />
    </Suspense>
  )
}

function CoursePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const didInitFromUrl = useRef(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [country, setCountry] = useState<string>("Any")
  const [level, setLevel] = useState<Level>("Any")
  const [mode, setMode] = useState<Mode>("Any")
  const [budget, setBudget] = useState<number>(Number.MAX_SAFE_INTEGER)

  const budgetOptions = useMemo(() => {
    const set = new Set<number>()
    courses.forEach((c) => {
      const n = Number(c.fee)
      if (Number.isFinite(n) && n > 0) set.add(n)
    })
    return Array.from(set).sort((a, b) => a - b)
  }, [courses])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(API_ENDPOINTS.COURSES)
        if (!response.ok) throw new Error('Failed to fetch courses')
        const data = await response.json()
        setCourses(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.UNIVERSITIES)
        if (!res.ok) throw new Error('Failed to fetch universities')
        const data = await res.json()
        setUniversities(Array.isArray(data) ? data : [])
      } catch (e) {
        setUniversities([])
      }
    }

    fetchUniversities()
  }, [])

  const universityCountryByName = useMemo(() => {
    const map = new Map<string, string>()
    universities.forEach((u) => {
      const name = String(u?.name || "").trim()
      const c = String(u?.country || "").trim()
      if (name && c && !map.has(name)) map.set(name, c)
    })
    return map
  }, [universities])

  const countryOptions = useMemo(() => {
    const opts = Array.from(
      new Set(universities.map((u) => String(u?.country || "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b))
    return ["Any", ...opts]
  }, [universities])

  useEffect(() => {
    if (didInitFromUrl.current) return
    if (!searchParams) return

    const qpCountry = searchParams.get("country")
    const qpCourse = searchParams.get("course")
    const qpLevel = searchParams.get("level")

    if (qpCountry) setCountry(qpCountry)
    if (qpCourse) setQuery(qpCourse)

    const allowedLevels: Level[] = ["Any", "Undergraduate", "Postgraduate", "PhD", "Diploma"]
    if (qpLevel && allowedLevels.includes(qpLevel as Level)) {
      setLevel(qpLevel as Level)
    }

    didInitFromUrl.current = true
  }, [searchParams])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()

    return courses.filter((c) => {
      const matchesQuery =
        !q ||
        c.university.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)

      const uniCountry = universityCountryByName.get(String(c.university || ""))
      const matchesCountry = country === "Any" ? true : String(uniCountry || "") === country

      const matchesLevel = level === "Any" ? true : c.level === level
      const matchesMode = mode === "Any" ? true : c.mode === mode
      const matchesBudget = c.fee <= budget

      return matchesQuery && matchesCountry && matchesLevel && matchesMode && matchesBudget
    }).sort((a, b) => {
      // cheaper first
      return a.fee - b.fee
    })
  }, [query, country, level, mode, budget, courses, universityCountryByName])

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
                Verified courses with trusted info
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Find the Right Course Fast
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                Search by city or university. Compare verified courses, fees,
                duration, and start dates.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm">
                  Get Free Guidance
                </button>
                <button className="rounded-xl border px-5 py-3 text-sm font-medium">
                  Talk to Expert
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Clear fee info
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
        <h2 className="text-xl font-semibold">Why choose us</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            { t: "Verified Details", d: "Trusted info first." },
            { t: "Top Universities", d: "Best study options." },
            { t: "Flexible Learning", d: "Online or campus." },
            { t: "Free Support", d: "From shortlist to apply." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border p-5">
              <div className="text-sm font-medium">{x.t}</div>
              <div className="mt-1 text-sm text-slate-600">{x.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mt-8 rounded-2xl border bg-slate-50 p-4 md:p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-12 md:items-end">
            <div className="md:col-span-5">
              <label className="text-xs text-slate-600">Search</label>
              <div className="mt-1 flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="University or course name"
                  className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-xl border bg-white px-4 py-3 text-sm cursor-pointer"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-600">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {countryOptions.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-600">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["Any", "Undergraduate", "Postgraduate", "PhD", "Diploma"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-600">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["Any", "Full-time", "Part-time", "Online", "Hybrid"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs text-slate-600">Budget (max)</label>
              <select
                value={String(budget)}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value={String(Number.MAX_SAFE_INTEGER)}>Any</option>
                {budgetOptions.map((n) => (
                  <option key={n} value={String(n)}>
                    £{n.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Available courses</h2>
            <p className="text-sm text-slate-600">
              Showing {results.length} result{results.length === 1 ? "" : "s"}{" "}
              (sorted by verified, rating, then fee)
            </p>
          </div>

          <div className="text-sm text-slate-600">Tip: search “city” or “university”</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {results.length === 0 && loading === false && (
            <div className="col-span-full rounded-2xl border bg-slate-50 p-6">
              <div className="text-sm font-medium">No matches found</div>
              <div className="mt-1 text-sm text-slate-600">
                Try changing search, increasing budget, or removing filters.
              </div>
            </div>
          )}
          
          {loading && (
            <div className="col-span-full text-center py-8">
              <div className="text-slate-600">Loading courses...</div>
            </div>
          )}

          {error && (
            <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="text-sm font-medium text-red-900">Error loading courses</div>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          )}

          {results.map((c) => (
            <article
              key={c._id}
              className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{c.university}</div>
                  <h3 className="mt-1 text-base font-semibold">{c.title}</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Level</div>
                  <div className="mt-1 font-medium">{c.level}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Mode</div>
                  <div className="mt-1 font-medium">{c.mode}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Fee</div>
                  <div className="mt-1 font-medium">£{c.fee.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Duration</div>
                  <div className="mt-1 font-medium">{c.duration}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-600">
                University: <span className="font-medium">{c.university}</span>
              </div>

              <div className="mt-2 text-sm text-slate-600">
                Start: <span className="font-medium">{new Date(c.startDate).toLocaleDateString()}</span>
              </div>

              {c.description && (
                <div className="mt-3 text-sm text-slate-600 line-clamp-2">
                  {c.description}
                </div>
              )}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => router.push(`/courses/${encodeURIComponent(String(c._id))}`)}
                  className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white cursor-pointer"
                >
                  View Course
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TYPES + HOW IT WORKS */}
      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-semibold">Popular course types</h2>
              <div className="mt-4 grid gap-3">
                {[
                  { t: "Foundation", d: "Entry pathway options" },
                  { t: "Undergraduate", d: "Bachelor degree programs" },
                  { t: "Postgraduate", d: "Masters and specializations" },
                  { t: "Short Courses", d: "Fast skill upgrades" },
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
                  { s: "1", t: "Tell us your target city & course", d: "Share your preferences." },
                  { s: "2", t: "Get a shortlist", d: "Best matches first." },
                  { s: "3", t: "Compare and decide", d: "Fees, mode, start dates." },
                  { s: "4", t: "Apply with support", d: "Guidance till submission." },
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
                <h3 className="text-lg font-semibold">Ready to choose a course?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Get a free shortlist based on your budget and start date.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                  Get Free Course Help
                </button>
                <button className="rounded-xl border px-5 py-3 text-sm font-medium">
                  Talk to Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Course Finder. All rights reserved.
        </div>
      </footer>
    </main>
      <Footer />
    </>
  );
}
