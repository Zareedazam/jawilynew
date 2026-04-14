"use client";

import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Category = "Scholarship" | "University" | "Visa" | "Loan" | "Test";
type Country = "Any" | "UK" | "USA" | "Canada" | "Australia" | "Germany" | "Ireland" | "Other";
type Level = "Any" | "Undergraduate" | "Postgraduate" | "PhD";
type Status = "All" | "Open" | "Due soon" | "Closing today" | "Closed";

type DeadlineItem = {
  id: string;
  title: string;
  category: Category;
  country: Exclude<Country, "Any">;
  level: Exclude<Level, "Any"> | "Any";
  date: string; // YYYY-MM-DD
  provider: string;
  note: string;
  tags: string[];
  link?: string;
};

const DEADLINES: DeadlineItem[] = [
  {
    id: "d1",
    title: "Merit Scholarship – Round 1",
    category: "Scholarship",
    country: "UK",
    level: "Postgraduate",
    date: "2026-02-28",
    provider: "Partner University",
    note: "Submit SOP + transcripts.",
    tags: ["Merit", "SOP"],
  },
  {
    id: "d2",
    title: "UCAS Equal Consideration (Demo)",
    category: "University",
    country: "UK",
    level: "Undergraduate",
    date: "2026-01-31",
    provider: "UCAS",
    note: "Some courses may differ.",
    tags: ["UCAS", "UK"],
  },
  {
    id: "d3",
    title: "STEM Excellence Scholarship",
    category: "Scholarship",
    country: "USA",
    level: "Undergraduate",
    date: "2026-03-15",
    provider: "Scholarship Office",
    note: "Need resume + recommendation.",
    tags: ["STEM", "Merit"],
  },
  {
    id: "d4",
    title: "Student Visa Checklist Submission (Demo)",
    category: "Visa",
    country: "Canada",
    level: "Any",
    date: "2026-03-05",
    provider: "Visa Guidance",
    note: "Keep buffer for biometrics.",
    tags: ["Visa", "Checklist"],
  },
  {
    id: "d5",
    title: "Education Loan Document Window",
    category: "Loan",
    country: "India" as any, // if you don’t want India, remove this item
    level: "Any",
    date: "2026-02-20",
    provider: "Loan Partner",
    note: "Income proof + admission letter.",
    tags: ["Loan", "Docs"],
  },
  {
    id: "d6",
    title: "PhD Research Scholarship",
    category: "Scholarship",
    country: "Germany",
    level: "PhD",
    date: "2026-04-01",
    provider: "Graduate School",
    note: "Proposal + supervisor confirmation.",
    tags: ["Research", "Proposal"],
  },
];

function daysDiff(from: Date, to: Date) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function getStatus(itemDate: string): { status: Status; days: number } {
  const today = new Date();
  const d = new Date(itemDate + "T00:00:00");
  const diff = daysDiff(today, d);

  if (diff < 0) return { status: "Closed", days: diff };
  if (diff === 0) return { status: "Closing today", days: diff };
  if (diff <= 14) return { status: "Due soon", days: diff };
  return { status: "Open", days: diff };
}

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function DeadlinesPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<Country>("Any");
  const [level, setLevel] = useState<Level>("Any");
  const [category, setCategory] = useState<"Any" | Category>("Any");
  const [status, setStatus] = useState<Status>("All");
  const [sort, setSort] = useState<"Soonest" | "Latest">("Soonest");

  const countries = useMemo(() => {
    const set = new Set(DEADLINES.map((d) => d.country));
    return ["Any", ...Array.from(set).sort()] as Country[];
  }, []);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = DEADLINES.filter((x) => {
      const s = getStatus(x.date).status;

      const matchesSearch =
        !q ||
        x.title.toLowerCase().includes(q) ||
        x.provider.toLowerCase().includes(q) ||
        x.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCountry = country === "Any" ? true : x.country === country;
      const matchesLevel = level === "Any" ? true : x.level === level || x.level === "Any";
      const matchesCategory = category === "Any" ? true : x.category === category;
      const matchesStatus = status === "All" ? true : s === status;

      return matchesSearch && matchesCountry && matchesLevel && matchesCategory && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      const da = new Date(a.date + "T00:00:00").getTime();
      const db = new Date(b.date + "T00:00:00").getTime();
      return sort === "Soonest" ? da - db : db - da;
    });

    return sorted;
  }, [search, country, level, category, status, sort]);

  const counts = useMemo(() => {
    const c = { open: 0, soon: 0, today: 0, closed: 0 };
    DEADLINES.forEach((d) => {
      const s = getStatus(d.date).status;
      if (s === "Open") c.open++;
      else if (s === "Due soon") c.soon++;
      else if (s === "Closing today") c.today++;
      else c.closed++;
    });
    return c;
  }, []);

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
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Deadlines Tracker
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Track Important Deadlines
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                Scholarships, applications, tests, visa, loan.
                <br />
                Filter and focus on what’s next.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#list"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
              >
                View Deadlines
              </a>
              <button className="rounded-xl border px-5 py-3 text-sm font-medium">
                Talk to Expert
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border p-5">
              <div className="text-xs text-slate-500">Open</div>
              <div className="mt-1 text-2xl font-semibold">{counts.open}</div>
            </div>
            <div className="rounded-2xl border p-5">
              <div className="text-xs text-slate-500">Due soon (≤14d)</div>
              <div className="mt-1 text-2xl font-semibold">{counts.soon}</div>
            </div>
            <div className="rounded-2xl border p-5">
              <div className="text-xs text-slate-500">Closing today</div>
              <div className="mt-1 text-2xl font-semibold">{counts.today}</div>
            </div>
            <div className="rounded-2xl border p-5">
              <div className="text-xs text-slate-500">Closed</div>
              <div className="mt-1 text-2xl font-semibold">{counts.closed}</div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mt-6 grid gap-3 rounded-2xl border bg-slate-50 p-5 md:grid-cols-6">
            <div className="md:col-span-2">
              <label className="text-xs text-slate-600">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="UCAS, Merit, Visa..."
                className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["Any", "Scholarship", "University", "Visa", "Loan", "Test"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as Country)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {countries.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["Any", "Undergraduate", "Postgraduate", "PhD"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["All", "Open", "Due soon", "Closing today", "Closed"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs text-slate-600">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option>Soonest</option>
                <option>Latest</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-end">
              <button
                onClick={() => {
                  setSearch("");
                  setCountry("Any");
                  setLevel("Any");
                  setCategory("Any");
                  setStatus("All");
                  setSort("Soonest");
                }}
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Note: Demo deadlines used here. Replace with your real data/API.
          </p>
        </div>
      </section>

      {/* LIST */}
      <section id="list" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
            <p className="text-sm text-slate-600">
              Showing {results.length} item{results.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="text-sm text-slate-600">
            Tip: focus on “Due soon”.
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {results.map((x) => {
            const s = getStatus(x.date);
            const badge =
              s.status === "Open"
                ? "bg-emerald-50 text-emerald-700"
                : s.status === "Due soon"
                ? "bg-amber-50 text-amber-700"
                : s.status === "Closing today"
                ? "bg-rose-50 text-rose-700"
                : "bg-slate-100 text-slate-700";

            const dayText =
              s.status === "Closed"
                ? `${Math.abs(s.days)} day(s) ago`
                : s.status === "Closing today"
                ? "Today"
                : `${s.days} day(s) left`;

            const levelPart: string[] = x.level !== "Any" ? [x.level] : [];
            const badges = levelPart.concat(x.tags.slice(0, 3));

            return (
              <article key={x.id} className="rounded-2xl border p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-slate-500">
                      {x.category} • {x.country}
                    </div>
                    <h3 className="mt-1 text-base font-semibold">{x.title}</h3>
                    <div className="mt-1 text-sm text-slate-600">{x.provider}</div>
                  </div>

                  <span className={cx("rounded-full px-3 py-1 text-xs font-medium", badge)}>
                    {s.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Date</div>
                    <div className="mt-1 font-medium">{x.date}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Time left</div>
                    <div className="mt-1 font-medium">{dayText}</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {badges.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-sm text-slate-600">{x.note}</p>

                <div className="mt-4 flex gap-2">
                  <button className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                    Get Help
                  </button>
                  <button className="rounded-xl border px-4 py-2 text-sm font-medium">
                    Add Reminder (Later)
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {results.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
            <div className="text-sm font-medium">No deadlines found</div>
            <div className="mt-1 text-sm text-slate-600">
              Try removing filters or changing keywords.
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-base font-semibold">Want a deadline plan for your profile?</div>
              <div className="mt-1 text-sm text-slate-600">
                Course + country + intake.
                <br />
                We’ll build a simple timeline.
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                Get Free Timeline
              </button>
              <button className="rounded-xl border px-5 py-3 text-sm font-medium">
                Talk to Expert
              </button>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
