"use client";

import React, { useMemo, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as XLSX from 'xlsx';

interface UniversityData {
  university_rank: number;
  university_name: string;
  Country: string;
}

export default function RankingsPage() {
  const [excelData, setExcelData] = useState<UniversityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<"Rank ↑" | "Rank ↓" | "Name A-Z">("Rank ↑");
  const [country, setCountry] = useState<string>("All");

  useEffect(() => {
    const loadExcelData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/university_ranking.xlsx');
        if (!response.ok) {
          throw new Error('Failed to load Excel file');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        // Map the data to our interface
        const mappedData: UniversityData[] = jsonData.map(row => ({
          university_rank: parseInt(row.university_rank) || 0,
          university_name: String(row.university_name || ''),
          Country: String(row.Country || '')
        })).filter(item => item.university_name && item.university_rank > 0);
        
        setExcelData(mappedData);
      } catch (err) {
        console.error('Error loading Excel data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadExcelData();
  }, []);

  const countries = useMemo(() => {
    const set = new Set(excelData.map((d) => d.Country));
    return ["All", ...Array.from(set).sort()];
  }, [excelData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = excelData.filter((u) => {
      const matchesCountry = country === "All" ? true : u.Country === country;
      const matchesSearch =
        !q ||
        u.university_name.toLowerCase().includes(q) ||
        u.Country.toLowerCase().includes(q);

      return matchesCountry && matchesSearch;
    });

    const sorted = [...base].sort((a, b) => {
      if (sort === "Name A-Z") return a.university_name.localeCompare(b.university_name);

      if (sort === "Rank ↑") return a.university_rank - b.university_rank;
      return b.university_rank - a.university_rank;
    });

    return sorted;
  }, [country, search, sort, excelData]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white text-slate-900">
          <section className="border-b">
            <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
              <div className="text-center">
                <div className="text-lg text-slate-600">Loading university rankings...</div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white text-slate-900">
          <section className="border-b">
            <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
              <div className="text-center">
                <div className="text-red-600 text-lg">Error: {error}</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                  Try Again
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

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
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                University Rankings
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                University Rankings
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                Explore university rankings from our Excel database.
                <br />
                Filter by country and search for universities.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#table" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                View Rankings
              </a>
              <a href="/contact" className="rounded-xl border px-5 py-3 text-sm font-medium">
                Talk to Expert
              </a>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="mt-8 grid gap-3 rounded-2xl border bg-slate-50 p-5 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="text-xs text-slate-600">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Oxford, Harvard, USA, UK..."
                className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option>Rank ↑</option>
                <option>Rank ↓</option>
                <option>Name A-Z</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Data loaded from university_ranking.xlsx file
          </div>

          {/* Ranking Sources */}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-emerald-50 border-emerald-200 p-4">
              <div className="text-sm font-semibold text-emerald-800">QS World University Rankings</div>
              <div className="text-xs text-emerald-700 mt-1">Currently displayed below</div>
            </div>
            <div className="rounded-xl border bg-slate-100 border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-600">THE World University Rankings</div>
              <div className="text-xs text-slate-500 mt-1">Coming soon</div>
            </div>
            <div className="rounded-xl border bg-slate-100 border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-600">Shanghai (ARWU) Rankings</div>
              <div className="text-xs text-slate-500 mt-1">Coming soon</div>
            </div>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section id="table" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              QS World University Rankings
            </h2>
            <p className="text-sm text-slate-600">
              Showing {filtered.length} universit{filtered.length === 1 ? "y" : "ies"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSearch("");
                setCountry("All");
                setSort("Rank ↑");
              }}
              className="rounded-xl border px-4 py-2 text-sm font-medium"
            >
              Reset
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Export (Later)
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b">
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">University Name</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((university, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700">
                        #{university.university_rank}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">{university.university_name}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div>{university.Country}</div>
                    </td>

                    <td className="px-4 py-3">
                      <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white">
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-600" colSpan={4}>
                      No results found.
                      <br />
                      Try another search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-base font-semibold">Need a shortlist based on your profile?</div>
              <div className="mt-1 text-sm text-slate-600">
                Ranking + budget + course fit.
                <br />
                We'll suggest best options.
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/contact" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                Get Free Shortlist
              </a>
              <a href="/contact" className="rounded-xl border px-5 py-3 text-sm font-medium">
                Talk to Expert
              </a>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
