"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Track = "Undergraduate" | "Postgraduate";
type CollegeHelp = "Yes" | "No";

export default function OxbridgePage() {
  const [track, setTrack] = useState<Track>("Undergraduate");
  const [collegeHelp, setCollegeHelp] = useState<CollegeHelp>("Yes");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              🎓 Elite Admissions Support
            </span>

            <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
              Oxbridge Admission Support
            </h1>

            <p className="mt-3 text-lg text-slate-600">
              Personal statement, college choice, entrance tests,
              and interviews.  
              One-to-one guidance from experts.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#apply"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white"
              >
                Start Oxbridge Prep
              </a>
              <button className="rounded-xl border px-6 py-3 text-sm font-medium">
                Talk to Mentor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY OXBRIDGE */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold">Why Oxbridge needs special prep</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            "Very low acceptance rate",
            "College-based selection",
            "Academic interviews",
            "Entrance exams required",
          ].map((x) => (
            <div key={x} className="rounded-2xl border p-5">
              <p className="text-sm font-medium">{x}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE HELP WITH */}
      <section className="bg-slate-50 border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-semibold">What we help you with</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Personal Statement",
                d: "Academic-focused. Subject depth matters.",
              },
              {
                t: "College Selection",
                d: "Choose colleges that fit your profile.",
              },
              {
                t: "Entrance Tests",
                d: "TSA, MAT, PAT, LNAT strategy.",
              },
              {
                t: "Interview Prep",
                d: "Mock interviews with feedback.",
              },
              {
                t: "Academic CV",
                d: "Competitions, research, Olympiads.",
              },
              {
                t: "Application Timeline",
                d: "Strict deadlines handled properly.",
              },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border bg-white p-5">
                <p className="text-sm font-medium">{x.t}</p>
                <p className="mt-1 text-sm text-slate-600">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK CHECK */}
      <section id="apply" className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">
              Check your Oxbridge path
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Answer a few things. We guide you honestly.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-600">Applying for</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track)}
                  className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
                >
                  <option>Undergraduate</option>
                  <option>Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Need help with college choice?
                </label>
                <select
                  value={collegeHelp}
                  onChange={(e) =>
                    setCollegeHelp(e.target.value as CollegeHelp)
                  }
                  className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <button className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white">
                Get Oxbridge Guidance
              </button>
            </div>
          </div>

          {/* INFO CARD */}
          <div className="rounded-2xl border bg-slate-50 p-6">
            <h3 className="text-lg font-semibold">Who this is for</h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• Strong academic profile</li>
              <li>• Subject-focused students</li>
              <li>• Olympiads / research / projects</li>
              <li>• Serious Oxbridge aspirants only</li>
            </ul>

            <div className="mt-6 rounded-xl bg-white p-4 text-sm text-slate-600">
              ⚠️ We give **honest feedback**.  
              If Oxbridge is not realistic, we’ll tell you.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-2xl border bg-white p-8 text-center">
            <h3 className="text-2xl font-semibold">
              Ready for Oxbridge-level prep?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Limited seats. High-intensity mentoring.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white">
                Apply for Premium Oxbridge Support
              </button>
              <button className="rounded-xl border px-6 py-3 text-sm font-medium">
                Speak to Advisor
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
