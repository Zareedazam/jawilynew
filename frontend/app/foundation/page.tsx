"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../../lib/api";

type Country = string;
type Intake = string;
type Stream = string;
type Duration = string;
type Budget = string;

type FoundationProgram = {
  id: string;
  title: string;
  provider: string;
  country: Country;
  city: string;
  stream: Stream;
  intake: Intake[];
  duration: Duration;
  budget: Budget;
  requirements: string[];
  benefits: string[];
};

const PROGRAMS: FoundationProgram[] = [
  {
    id: "f1",
    title: "International Foundation Year",
    provider: "Partner College",
    country: "UK",
    city: "London",
    stream: "Business",
    intake: ["Jan", "Sep"],
    duration: "1 year",
    budget: "£15k–£25k",
    requirements: ["Grade 12 pass", "IELTS 5.0–5.5 (varies)", "Passport"],
    benefits: ["Progression to university", "Academic skills", "English support"],
  },
  {
    id: "f2",
    title: "Foundation Pathway in Engineering",
    provider: "International Study Centre",
    country: "UK",
    city: "Manchester",
    stream: "Engineering",
    intake: ["Jan", "Sep"],
    duration: "1 year",
    budget: "£15k–£25k",
    requirements: ["Math background", "Grade 12 pass", "IELTS 5.5 (varies)"],
    benefits: ["STEM modules", "Lab basics", "Progression guidance"],
  },
  {
    id: "f3",
    title: "Computer Science Foundation Program",
    provider: "Pathway Institute",
    country: "Ireland",
    city: "Dublin",
    stream: "Computer Science",
    intake: ["Sep"],
    duration: "1 year",
    budget: "£15k–£25k",
    requirements: ["Grade 12 pass", "Basic math", "IELTS 5.5 (varies)"],
    benefits: ["Programming basics", "Study skills", "University route"],
  },
  {
    id: "f4",
    title: "Pre-Med Foundation Track",
    provider: "Partner College",
    country: "Australia",
    city: "Melbourne",
    stream: "Medicine",
    intake: ["Jan", "May", "Sep"],
    duration: "18 months",
    budget: "£25k+",
    requirements: ["Bio/Chem in Grade 12", "IELTS 6.0 (varies)", "Interview (some cases)"],
    benefits: ["Science + lab", "Progression support", "Strong academic prep"],
  },
];

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function FoundationPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<FoundationProgram[]>(PROGRAMS);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<Country>("Any");
  const [intake, setIntake] = useState<Intake>("Any");
  const [stream, setStream] = useState<Stream>("Any");
  const [duration, setDuration] = useState<Duration>("Any");
  const [budget, setBudget] = useState<Budget>("Any");
  const [sort, setSort] = useState<"Best match" | "A-Z">("Best match");

  const countryOptions = useMemo(() => {
    const opts = Array.from(new Set(programs.map((p) => p.country).filter(Boolean)))
      .map(String)
      .sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [programs]);

  const intakeOptions = useMemo(() => {
    const opts = Array.from(
      new Set(
        programs
          .flatMap((p) => (Array.isArray(p.intake) ? p.intake : []))
          .filter(Boolean)
          .map(String)
      )
    ).sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [programs]);

  const streamOptions = useMemo(() => {
    const opts = Array.from(new Set(programs.map((p) => p.stream).filter(Boolean)))
      .map(String)
      .sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [programs]);

  const durationOptions = useMemo(() => {
    const opts = Array.from(new Set(programs.map((p) => p.duration).filter(Boolean)))
      .map(String)
      .sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [programs]);

  const budgetOptions = useMemo(() => {
    const opts = Array.from(new Set(programs.map((p) => p.budget).filter(Boolean)))
      .map(String)
      .sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [programs]);

  useEffect(() => {
    if (country !== "Any" && !countryOptions.includes(country)) setCountry("Any");
    if (intake !== "Any" && !intakeOptions.includes(intake)) setIntake("Any");
    if (stream !== "Any" && !streamOptions.includes(stream)) setStream("Any");
    if (duration !== "Any" && !durationOptions.includes(duration)) setDuration("Any");
    if (budget !== "Any" && !budgetOptions.includes(budget)) setBudget("Any");
  }, [budget, budgetOptions, country, countryOptions, duration, durationOptions, intake, intakeOptions, stream, streamOptions]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/foundation-programs`, { cache: "no-store" as any });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;

        const mapped: FoundationProgram[] = data
          .map((x: any) => ({
            id: String(x._id || x.id || ""),
            title: String(x.title || ""),
            provider: String(x.provider || ""),
            country: (x.country || "UK") as any,
            city: String(x.city || ""),
            stream: (x.stream || "Business") as any,
            intake: Array.isArray(x.intake) ? x.intake : String(x.intake || "").split(",").map((s) => s.trim()).filter(Boolean),
            duration: (x.duration || "1 year") as any,
            budget: (x.budget || "£15k–£25k") as any,
            requirements: Array.isArray(x.requirements) ? x.requirements : String(x.requirements || "").split(",").map((s) => s.trim()).filter(Boolean),
            benefits: Array.isArray(x.benefits) ? x.benefits : String(x.benefits || "").split(",").map((s) => s.trim()).filter(Boolean),
          }))
          .filter((x: any) => x.id && x.title);

        if (mapped.length > 0) setPrograms(mapped);
      } catch {
        // keep demo fallback
      }
    };

    load();
  }, []);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = programs.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.stream.toLowerCase().includes(q);

      const matchesCountry = country === "Any" ? true : p.country === country;
      const matchesIntake = intake === "Any" ? true : p.intake.includes(intake);
      const matchesStream = stream === "Any" ? true : p.stream === stream;
      const matchesDuration = duration === "Any" ? true : p.duration === duration;
      const matchesBudget = budget === "Any" ? true : p.budget === budget;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesIntake &&
        matchesStream &&
        matchesDuration &&
        matchesBudget
      );
    });

    if (sort === "A-Z") return filtered.sort((a, b) => a.title.localeCompare(b.title));

    // Best match: prioritize UK + Sep intake (common), then stable
    return filtered.sort((a, b) => {
      const aScore = (a.country === "UK" ? 0 : 1) + (a.intake.includes("Sep") ? 0 : 1);
      const bScore = (b.country === "UK" ? 0 : 1) + (b.intake.includes("Sep") ? 0 : 1);
      if (aScore !== bScore) return aScore - bScore;
      return a.title.localeCompare(b.title);
    });
  }, [programs, search, country, intake, stream, duration, budget, sort]);

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
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Foundation Programs
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Foundation Year to University
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                If you don’t meet direct entry, foundation can be your pathway.
                <br />
                Compare country, intake, stream, and requirements.
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
          <div className="mt-8 grid gap-3 rounded-2xl border bg-slate-50 p-5 md:grid-cols-6">
            <div className="md:col-span-2">
              <label className="text-xs text-slate-600">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Business, Engineering, London..."
                className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as Country)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {countryOptions.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Intake</label>
              <select
                value={intake}
                onChange={(e) => setIntake(e.target.value as Intake)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {intakeOptions.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Stream</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as Stream)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {streamOptions.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as Duration)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {durationOptions.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as Budget)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {budgetOptions.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-600">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option>Best match</option>
                <option>A-Z</option>
              </select>
            </div>

            <div className="md:col-span-4 flex items-end">
              <button
                onClick={() => {
                  setSearch("");
                  setCountry("Any");
                  setIntake("Any");
                  setStream("Any");
                  setDuration("Any");
                  setBudget("Any");
                  setSort("Best match");
                }}
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Note: Demo programs shown. Replace with your real data/API.
          </p>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Programs</h2>
            <p className="text-sm text-slate-600">
              Showing {results.length} program{results.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="text-sm text-slate-600">
            Tip: Foundation is best for direct progression.
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {results.map((p) => (
            <article key={p.id} className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">
                    {p.country} • {p.city}
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{p.title}</h3>
                  <div className="mt-1 text-sm text-slate-600">{p.provider}</div>
                </div>

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                  {p.stream}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Duration</div>
                  <div className="mt-1 font-medium">{p.duration}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Budget</div>
                  <div className="mt-1 font-medium">{p.budget}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Intakes</div>
                  <div className="mt-1 font-medium">{p.intake.join(", ")}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Stream</div>
                  <div className="mt-1 font-medium">{p.stream}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium text-slate-500">Requirements</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.requirements.slice(0, 3).map((r) => (
                    <span key={r} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {r}
                    </span>
                  ))}
                  {p.requirements.length > 3 && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      +{p.requirements.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium text-slate-500">Benefits</div>
                <p className="mt-1 text-sm text-slate-600">
                  {p.benefits.slice(0, 2).join(" • ")}
                  {p.benefits.length > 2 ? " • ..." : ""}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => router.push(`/foundation/${encodeURIComponent(p.id)}`)}
                  className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white cursor-pointer"
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
              Try changing country, intake, or stream.
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
                <h3 className="text-lg font-semibold">Not sure if you need Foundation?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Share your marks + target country.
                  <br />
                  We’ll suggest the best route.
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
