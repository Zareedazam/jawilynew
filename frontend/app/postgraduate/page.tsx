"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from "../../lib/api";

type Mode = "Any" | "Full-time" | "Part-time" | "Online" | "Hybrid";

type Course = {
  _id: string;
  title: string;
  university: string;
  city?: string;
  level?: string;
  fee?: number;
  mode?: string;
  duration?: string;
  startDate?: string;
  description?: string;
};

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function PostgraduatePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<Mode>("Any");
  const [budget, setBudget] = useState<number>(Number.MAX_SAFE_INTEGER);

  const budgetOptions = useMemo(() => {
    const set = new Set<number>();
    courses.forEach((c) => {
      const n = Number(c.fee);
      if (Number.isFinite(n) && n > 0) set.add(n);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [courses]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_ENDPOINTS.COURSES, { cache: "no-store" as any });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch courses");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    return courses
      .filter((c) => {
        const lvl = typeof c?.level === "string" ? c.level.trim().toLowerCase() : "";
        if (lvl !== "postgraduate") return false;

        const matchesSearch =
          !q ||
          String(c.university || "").toLowerCase().includes(q) ||
          String(c.title || "").toLowerCase().includes(q) ||
          String(c.city || "").toLowerCase().includes(q);

        const matchesMode = mode === "Any" ? true : String(c.mode || "") === mode;
        const feeNum = Number(c.fee);
        const matchesBudget = !Number.isFinite(feeNum) ? true : feeNum <= budget;

        return matchesSearch && matchesMode && matchesBudget;
      })
      .sort((a, b) => {
        const feeA = Number(a.fee);
        const feeB = Number(b.fee);
        if (Number.isFinite(feeA) && Number.isFinite(feeB)) return feeA - feeB;
        return String(a.title || "").localeCompare(String(b.title || ""));
      });
  }, [search, mode, budget, courses]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Postgraduate Programs
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Find Your Master’s Program
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                Browse real postgraduate courses added from Admin.
                <br />
                Filter by search, mode and budget.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#programs"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
              >
                Browse Programs
              </a>
              <a href="/contact" className="rounded-xl border px-5 py-3 text-sm font-medium">
                Talk to Expert
              </a>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border bg-slate-50 p-5 md:flex-row md:items-end">
            <div className="flex-1 min-w-0">
              <label className="text-xs text-slate-600">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="University, course title, city..."
                className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="w-full md:w-48">
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

            <div className="w-full md:w-56">
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

            <div className="w-full md:w-48 md:ml-auto">
              <button
                onClick={() => {
                  setSearch("");
                  setMode("Any");
                  setBudget(Number.MAX_SAFE_INTEGER);
                }}
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {error ? (
            <p className="mt-3 text-xs text-red-600">{error}</p>
          ) : null}
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Courses</h2>
            <p className="text-sm text-slate-600">
              {loading ? "Loading..." : `Showing ${results.length} course${results.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="text-sm text-slate-600">Tip: check entry requirements carefully.</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {loading && (
            <div className="col-span-full text-center py-8">
              <div className="text-slate-600">Loading courses...</div>
            </div>
          )}

          {results.map((c) => (
            <article key={c._id} className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">
                    {c.university}{c.city ? ` • ${c.city}` : ""}
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{c.title}</h3>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  Postgraduate
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Mode</div>
                  <div className="mt-1 font-medium">{c.mode || ""}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Fee</div>
                  <div className="mt-1 font-medium">
                    {typeof c.fee === "number" && Number.isFinite(c.fee) ? `£${c.fee.toLocaleString()}` : ""}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Duration</div>
                  <div className="mt-1 font-medium">{c.duration || ""}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Start</div>
                  <div className="mt-1 font-medium">
                    {c.startDate ? new Date(c.startDate).toLocaleDateString() : ""}
                  </div>
                </div>
              </div>

              {c.description ? (
                <div className="mt-3 text-sm text-slate-600 line-clamp-2">{c.description}</div>
              ) : null}

              <div className="mt-4 flex gap-2">
                <button className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  Get Shortlist
                </button>
                <button
                  onClick={() => router.push(`/courses/${encodeURIComponent(String(c._id))}`)}
                  className="rounded-xl border px-4 py-2 text-sm font-medium"
                >
                  Details
                </button>
              </div>
            </article>
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
            <div className="text-sm font-medium">No matches found</div>
            <div className="mt-1 text-sm text-slate-600">
              Try changing country, degree, or stream.
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-2xl border bg-white p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Want a PG shortlist based on your profile?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Degree + marks + work experience + budget.
                  <br />
                  We’ll suggest best options.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="/contact" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                  Free Profile Check
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
