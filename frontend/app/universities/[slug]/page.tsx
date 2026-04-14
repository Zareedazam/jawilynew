"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_ENDPOINTS } from "../../../lib/api";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function UniversityDetailPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam as string | undefined);

  const [university, setUniversity] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_ENDPOINTS.UNIVERSITIES, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch universities");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const found = list.find((u: any) => slugify(u?.name || "") === slug);
        if (!found) throw new Error("University not found");

        setUniversity(found);
      } catch (e: any) {
        setUniversity(null);
        setError(e?.message || "Failed to load university");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchUniversity();
  }, [slug]);

  const viewModel = useMemo(() => {
    if (!university) return null;

    const city = university.city || university.location || "";
    const rank = typeof university.rank !== "undefined" ? university.rank : university.ranking;

    return {
      name: university.name,
      country: university.country,
      city,
      rank,
      description: university.description || "",
      website: university.website || "",
      avgFee: typeof university.avgFee !== "undefined" ? Number(university.avgFee) : undefined,
      location: university.location || "",
      ranking: typeof university.ranking !== "undefined" ? Number(university.ranking) : undefined,
    };
  }, [university]);

  const detailsRows = useMemo(() => {
    if (!viewModel) return [] as { label: string; value: string }[];

    const rows: { label: string; value: string }[] = [];

    if (viewModel.country) rows.push({ label: "Country", value: String(viewModel.country) });
    if (viewModel.city) rows.push({ label: "City", value: String(viewModel.city) });
    if (typeof viewModel.rank !== "undefined") rows.push({ label: "Rank", value: String(viewModel.rank) });
    if (typeof viewModel.ranking !== "undefined") rows.push({ label: "Ranking", value: String(viewModel.ranking) });
    if (typeof viewModel.avgFee !== "undefined") rows.push({ label: "Avg Fee", value: String(viewModel.avgFee) });
    if (viewModel.location) rows.push({ label: "Location", value: String(viewModel.location) });
    if (viewModel.website) rows.push({ label: "Website", value: String(viewModel.website) });

    return rows;
  }, [viewModel]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {loading ? (
            <div className="text-sm text-black/60">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : !viewModel ? (
            <div className="text-sm text-black/60">No data</div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black/[0.03] via-white to-black/[0.02] p-7 md:p-10">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-black/[0.04] blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl" />

                <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-black/70">
                      <span className="h-2 w-2 rounded-full bg-black/60" />
                      University Profile
                    </div>

                    <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight break-words">
                      {viewModel.name}
                    </h1>

                    <p className="mt-4 text-sm md:text-base text-black/70">
                      {viewModel.country}
                      {viewModel.city ? ` • ${viewModel.city}` : ""}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {typeof viewModel.rank !== "undefined" ? (
                        <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-semibold">
                          Rank {viewModel.rank}
                        </span>
                      ) : null}
                      {typeof viewModel.ranking !== "undefined" ? (
                        <span className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/70">
                          Ranking {viewModel.ranking}
                        </span>
                      ) : null}
                      {typeof viewModel.avgFee !== "undefined" ? (
                        <span className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/70">
                          Avg Fee {viewModel.avgFee}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {viewModel.website ? (
                      <a
                        href={viewModel.website}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30 bg-white"
                      >
                        Visit Website
                      </a>
                    ) : null}
                    <a
                      href="/apply"
                      className="px-5 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-7">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">About</h2>
                  <p className="mt-4 text-sm md:text-base leading-7 text-black/70 whitespace-pre-line">
                    {viewModel.description || "No description provided."}
                  </p>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white p-7">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">Quick Info</h2>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-black/10 p-4">
                      <div className="text-xs font-semibold text-black/50">Country</div>
                      <div className="mt-1 text-sm font-semibold text-black">{viewModel.country || "-"}</div>
                    </div>
                    <div className="rounded-2xl border border-black/10 p-4">
                      <div className="text-xs font-semibold text-black/50">City</div>
                      <div className="mt-1 text-sm font-semibold text-black">{viewModel.city || "-"}</div>
                    </div>
                    <div className="rounded-2xl border border-black/10 p-4">
                      <div className="text-xs font-semibold text-black/50">Rank</div>
                      <div className="mt-1 text-sm font-semibold text-black">
                        {typeof viewModel.rank !== "undefined" ? viewModel.rank : "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-black/10 bg-white p-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">Details</h2>
                    <p className="mt-2 text-sm text-black/60">Everything provided by the admin panel.</p>
                  </div>
                  <a
                    href="/apply"
                    className="hidden md:inline-flex px-5 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
                  >
                    Book Consultation
                  </a>
                </div>

                {detailsRows.length === 0 ? (
                  <p className="mt-6 text-sm text-black/60">No extra details available.</p>
                ) : (
                  <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detailsRows.map((row) => (
                      <div key={row.label} className="group rounded-2xl border border-black/10 p-5 hover:border-black/25 transition">
                        <div className="text-xs font-semibold text-black/50">{row.label}</div>
                        {row.label === "Website" ? (
                          <a
                            href={row.value}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block text-sm font-semibold text-black underline underline-offset-4"
                          >
                            {row.value}
                          </a>
                        ) : (
                          <div className="mt-2 text-sm font-semibold text-black break-words">{row.value}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
