"use client";

import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Target = "UK Medicine" | "International Medicine";
type Level = "Undergraduate (MBBS/MBChB)" | "Graduate Entry (GEM)";
type Test = "UCAT" | "BMAT" | "None yet";
type Experience = "Yes" | "No";

type PackageId = "starter" | "plus" | "pro";

type Package = {
  id: PackageId;
  name: string;
  price: string;
  bestFor: string;
  points: string[];
  popular?: boolean;
};

const PACKAGES: Package[] = [
  {
    id: "starter",
    name: "Starter",
    price: "£59",
    bestFor: "Basics + clarity",
    points: [
      "Profile review (1:1)",
      "University shortlisting (up to 6)",
      "Personal statement outline",
      "UCAS timeline plan",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: "£129",
    bestFor: "Most students",
    points: [
      "Everything in Starter",
      "UCAT/BMAT strategy plan",
      "2 mock MMI stations + feedback",
      "Personal statement review (1 round)",
      "Priority support (7 days)",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "£249",
    bestFor: "Full medicine prep",
    points: [
      "Dedicated mentor",
      "University shortlist (up to 12)",
      "UCAT/BMAT weekly plan",
      "6 mock MMI stations + scoring",
      "PS review (2 rounds)",
      "Work experience guidance pack",
      "Support for 14 days",
    ],
  },
];

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function MedicinePage() {
  const [target, setTarget] = useState<Target>("UK Medicine");
  const [level, setLevel] = useState<Level>("Undergraduate (MBBS/MBChB)");
  const [test, setTest] = useState<Test>("UCAT");
  const [experience, setExperience] = useState<Experience>("No");
  const [selected, setSelected] = useState<PackageId>("plus");

  const selectedPkg = useMemo(
    () => PACKAGES.find((p) => p.id === selected) ?? PACKAGES[1],
    [selected]
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                🩺 Medicine Admissions Support
              </span>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Medicine Admission Made Clear
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                UCAT/BMAT planning, personal statement, work experience,
                and MMI interview prep. One-to-one guidance.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#check"
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white"
                >
                  Start Free Check
                </a>
                <a
                  href="#packages"
                  className="rounded-xl border px-6 py-3 text-sm font-medium"
                >
                  View Packages
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">UCAS ready</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">MMI focused</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Real feedback</span>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {[
                  { t: "UCAT / BMAT Plan", d: "Daily + weekly strategy." },
                  { t: "MMI Practice", d: "Stations + scoring." },
                  { t: "Personal Statement", d: "Structure + reviews." },
                  { t: "Shortlisting", d: "Safe + ambitious mix." },
                ].map((x) => (
                  <div key={x.t} className="rounded-2xl border p-5">
                    <div className="text-sm font-medium">{x.t}</div>
                    <div className="mt-1 text-sm text-slate-600">{x.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK CHECK CARD */}
            <div id="check" className="rounded-2xl border bg-slate-50 p-6 shadow-sm">
              <div className="text-sm font-medium">Quick Medicine Check</div>
              <p className="mt-1 text-sm text-slate-600">
                30 seconds. We suggest the right path.
              </p>

              <div className="mt-5 grid gap-3">
                <div>
                  <label className="text-xs text-slate-600">Target</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value as Target)}
                    className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option>UK Medicine</option>
                    <option>International Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                    className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option>Undergraduate (MBBS/MBChB)</option>
                    <option>Graduate Entry (GEM)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600">Test</label>
                    <select
                      value={test}
                      onChange={(e) => setTest(e.target.value as Test)}
                      className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                    >
                      <option>UCAT</option>
                      <option>BMAT</option>
                      <option>None yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600">Work experience</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value as Experience)}
                      className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border bg-white p-4 text-sm text-slate-700">
                  <div className="text-xs text-slate-500">Your snapshot</div>
                  <div className="mt-2">
                    • {target}
                    <br />• {level}
                    <br />• Test: {test}
                    <br />• Work experience: {experience}
                  </div>
                </div>

                <button className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                  Get My Plan
                </button>

                <p className="text-center text-xs text-slate-500">
                  No spam. Only guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Medicine Packages</h2>
            <p className="text-sm text-slate-600">
              Choose based on your timeline.
            </p>
          </div>
          <div className="text-sm text-slate-600">
            Recommended: <span className="font-medium">Plus</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={cx(
                "text-left rounded-2xl border p-5 shadow-sm transition hover:shadow-md",
                selected === p.id && "ring-2 ring-slate-200"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="mt-1 text-2xl font-semibold">{p.price}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Best for: <span className="font-medium">{p.bestFor}</span>
                  </div>
                </div>

                {p.popular && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Most Popular
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2">
                {p.points.map((x) => (
                  <div key={x} className="flex gap-2 text-sm">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-900" />
                    <span className="text-slate-700">{x}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                {selected === p.id ? "Selected" : "Select"}
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS + CTA */}
      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="text-lg font-semibold">How it works</h3>
              <div className="mt-4 space-y-3">
                {[
                  { s: "1", t: "Onboarding form", d: "Goals + timeline." },
                  { s: "2", t: "Plan + shortlist", d: "Targets + strategy." },
                  { s: "3", t: "Prep sessions", d: "UCAT/BMAT + MMI." },
                  { s: "4", t: "Final polish", d: "PS + interview confidence." },
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

            <div className="rounded-2xl border bg-white p-6">
              <h3 className="text-lg font-semibold">Selected Package</h3>
              <div className="mt-4 rounded-xl border bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{selectedPkg.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{selectedPkg.bestFor}</div>
                  </div>
                  <div className="text-sm font-semibold">{selectedPkg.price}</div>
                </div>

                <div className="mt-4 space-y-2">
                  {selectedPkg.points.map((x) => (
                    <div key={x} className="flex gap-2 text-sm">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-900" />
                      <span className="text-slate-700">{x}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => alert("Connect payment (Stripe/Razorpay) here.")}
                  className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                  Continue to Payment
                </button>
                <button className="w-full rounded-xl border px-5 py-3 text-sm font-medium">
                  Talk to Mentor
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Note: This is guidance + mentoring. Admission decisions depend on universities.
              </p>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
