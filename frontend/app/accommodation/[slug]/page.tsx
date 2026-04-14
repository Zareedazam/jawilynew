"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_ENDPOINTS } from "../../../lib/api";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function distanceLabel(km: number) {
  if (km <= 2) return "0-2 km";
  if (km <= 5) return "2-5 km";
  if (km <= 10) return "5-10 km";
  return "10+ km";
}

function normalizeStatus(input: unknown): "Verified" | "Unverified" | undefined {
  if (!input) return undefined;
  const s = String(input).trim().toLowerCase();
  if (s === "verified" || s === "active") return "Verified";
  if (s === "unverified" || s === "inactive") return "Unverified";
  return undefined;
}

export default function AccommodationDetailPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam as string | undefined);

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_ENDPOINTS.ACCOMMODATION, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch accommodation");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const found = list.find((p: any) => slugify(p?.hostelName || p?.name || "") === slug);
        if (!found) throw new Error("Accommodation not found");

        setItem(found);
      } catch (e: any) {
        setItem(null);
        setError(e?.message || "Failed to load accommodation");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchItem();
  }, [slug]);

  const viewModel = useMemo(() => {
    if (!item) return null;

    const hostelName = item?.hostelName || item?.name || "";
    const universityName = item?.universityName || item?.universityNearby || "";
    const moveInDate = item?.moveInDate || item?.moveIn || "";
    const budget = typeof item?.budget !== "undefined" ? Number(item.budget) : (typeof item?.pricePerWeek !== "undefined" ? Number(item.pricePerWeek) : undefined);
    const services = Array.isArray(item?.services) ? item.services : (Array.isArray(item?.amenities) ? item.amenities : []);
    const status = normalizeStatus(item?.status) || "Unverified";
    const distanceKm = typeof item?.distanceKm !== "undefined" ? Number(item.distanceKm) : undefined;
    const distanceRange = item?.distanceRange || (typeof distanceKm === "number" ? distanceLabel(distanceKm) : "");

    return {
      hostelName,
      universityName,
      city: item?.city || "",
      roomType: item?.roomType || "",
      distanceKm,
      distanceRange,
      moveInDate,
      nearBy: item?.nearBy || "",
      rating: typeof item?.rating !== "undefined" ? Number(item.rating) : undefined,
      budget,
      status,
      services,
      description: item?.description || "",
      contact: item?.contact || "",
    };
  }, [item]);

  const detailsRows = useMemo(() => {
    if (!viewModel) return [] as { label: string; value: string }[];

    const rows: { label: string; value: string }[] = [];

    if (viewModel.status) rows.push({ label: "Status", value: viewModel.status });
    if (viewModel.universityName) rows.push({ label: "University", value: viewModel.universityName });
    if (viewModel.city) rows.push({ label: "City", value: viewModel.city });
    if (viewModel.roomType) rows.push({ label: "Room Type", value: viewModel.roomType });
    if (viewModel.distanceRange) rows.push({ label: "Distance", value: viewModel.distanceRange });
    if (viewModel.moveInDate) {
      const d = new Date(viewModel.moveInDate);
      rows.push({ label: "Move-in", value: Number.isNaN(d.getTime()) ? String(viewModel.moveInDate) : d.toISOString().slice(0, 10) });
    }
    if (viewModel.nearBy) rows.push({ label: "Near By", value: viewModel.nearBy });
    if (typeof viewModel.rating === "number") rows.push({ label: "Rating", value: viewModel.rating.toFixed(1) });
    if (typeof viewModel.budget !== "undefined") rows.push({ label: "Budget", value: `£${Number(viewModel.budget).toLocaleString()}` });
    if (viewModel.contact) rows.push({ label: "Contact", value: viewModel.contact });

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
                      Accommodation Profile
                    </div>

                    <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight break-words">
                      {viewModel.hostelName}
                    </h1>

                    <p className="mt-4 text-sm md:text-base text-black/70">
                      {viewModel.city}
                      {viewModel.universityName ? ` • Near ${viewModel.universityName}` : ""}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {typeof viewModel.budget !== "undefined" ? (
                        <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-semibold">
                          £{Number(viewModel.budget).toLocaleString()}
                        </span>
                      ) : null}
                      {viewModel.status ? (
                        <span className={`rounded-full px-4 py-2 text-xs font-semibold ${viewModel.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                          {viewModel.status}
                        </span>
                      ) : null}
                      {viewModel.roomType ? (
                        <span className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/70">
                          {viewModel.roomType}
                        </span>
                      ) : null}
                      {typeof viewModel.rating === "number" ? (
                        <span className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/70">
                          {viewModel.rating.toFixed(1)} ★
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <a
                      href="/apply"
                      className="px-5 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
                    >
                      Book Consultation
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

                  <div className="mt-6 rounded-2xl border border-black/10 p-5">
                    <h3 className="text-sm font-black tracking-tight">Services</h3>
                    {Array.isArray(viewModel.services) && viewModel.services.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {viewModel.services.map((s: string) => (
                          <span
                            key={s}
                            className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-semibold text-black/70"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-black/60">No services listed.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white p-7">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">Quick Info</h2>

                  <div className="mt-5 grid gap-3">
                    {detailsRows.map((row) => (
                      <div key={row.label} className="rounded-2xl border border-black/10 p-4">
                        <div className="text-xs font-semibold text-black/50">{row.label}</div>
                        <div className="mt-1 text-sm font-semibold text-black break-words">{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
