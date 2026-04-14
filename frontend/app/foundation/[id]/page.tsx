"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from "../../../lib/api";

type Program = {
  id: string;
  title: string;
  provider: string;
  country: string;
  city: string;
  stream: string;
  intake: string[];
  duration: string;
  budget: string;
  requirements: string[];
  benefits: string[];
};

export default function FoundationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = useMemo(() => String((params as any)?.id || ""), [params]);

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/api/foundation-programs/${encodeURIComponent(id)}`, {
          cache: "no-store" as any,
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || "Failed to load program");

        const mapped: Program = {
          id: String(data?._id || data?.id || ""),
          title: String(data?.title || ""),
          provider: String(data?.provider || ""),
          country: String(data?.country || ""),
          city: String(data?.city || ""),
          stream: String(data?.stream || ""),
          intake: Array.isArray(data?.intake)
            ? data.intake
            : String(data?.intake || "")
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
          duration: String(data?.duration || ""),
          budget: String(data?.budget || ""),
          requirements: Array.isArray(data?.requirements)
            ? data.requirements
            : String(data?.requirements || "")
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
          benefits: Array.isArray(data?.benefits)
            ? data.benefits
            : String(data?.benefits || "")
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
        };

        setProgram(mapped);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load program");
        setProgram(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900">
        <section className="border-b">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => router.back()}
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Back
              </button>
              <div className="text-sm text-slate-500">Foundation Program Details</div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10">
          {loading ? (
            <div className="rounded-2xl border bg-slate-50 p-6">Loading...</div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
          ) : !program ? (
            <div className="rounded-2xl border bg-slate-50 p-6">No program found.</div>
          ) : (
            <div className="grid gap-6">
              <div className="rounded-2xl border p-6">
                <div className="text-sm text-slate-500">
                  {program.country}{program.city ? ` • ${program.city}` : ""}
                </div>
                <h1 className="mt-2 text-2xl font-semibold">{program.title}</h1>
                <div className="mt-2 text-slate-600">{program.provider}</div>

                <div className="mt-6 grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Stream</div>
                    <div className="mt-1 font-medium">{program.stream || "-"}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Duration</div>
                    <div className="mt-1 font-medium">{program.duration || "-"}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Budget</div>
                    <div className="mt-1 font-medium">{program.budget || "-"}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Intakes</div>
                    <div className="mt-1 font-medium">{program.intake?.length ? program.intake.join(", ") : "-"}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border p-6">
                  <h2 className="text-lg font-semibold">Requirements</h2>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                    {(program.requirements || []).length ? (
                      program.requirements.map((x, idx) => <li key={idx}>{x}</li>)
                    ) : (
                      <li>-</li>
                    )}
                  </ul>
                </div>

                <div className="rounded-2xl border p-6">
                  <h2 className="text-lg font-semibold">Benefits</h2>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                    {(program.benefits || []).length ? (
                      program.benefits.map((x, idx) => <li key={idx}>{x}</li>)
                    ) : (
                      <li>-</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
