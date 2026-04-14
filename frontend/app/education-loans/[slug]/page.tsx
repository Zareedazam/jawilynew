"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_ENDPOINTS } from "../../../lib/api";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function EducationLoanDetailPage() {
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

        const res = await fetch(API_ENDPOINTS.EDUCATION_LOANS, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch education loans");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const found = list.find((p: any) => {
          const name = p?.loanName || p?.lender || "";
          return slugify(name) === slug;
        });

        if (!found) throw new Error("Education loan not found");
        setItem(found);
      } catch (e: any) {
        setItem(null);
        setError(e?.message || "Failed to load education loan");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchItem();
  }, [slug]);

  const vm = useMemo(() => {
    if (!item) return null;

    const loanName = item?.loanName || item?.lender || "";
    const lender = item?.lender || "";
    const loanType = item?.loanType || "";
    const aprFrom = typeof item?.aprFrom !== "undefined" ? Number(item.aprFrom) : (typeof item?.apr !== "undefined" ? Number(item.apr) : undefined);
    const maxAmount = typeof item?.maxAmount !== "undefined" ? Number(item.maxAmount) : undefined;
    const tenure = typeof item?.tenure !== "undefined" ? Number(item.tenure) : undefined;
    const processingFee = item?.processingFee || "";
    const moratorium = item?.moratorium || "";
    const supportedCountries = Array.isArray(item?.supportedCountries)
      ? item.supportedCountries
      : (Array.isArray(item?.countries) ? item.countries : []);
    const services = Array.isArray(item?.services)
      ? item.services
      : (Array.isArray(item?.highlights) ? item.highlights : []);

    return {
      loanName,
      lender,
      loanType,
      aprFrom,
      maxAmount,
      tenure,
      processingFee,
      moratorium,
      supportedCountries,
      services,
      description: item?.description || "",
    };
  }, [item]);

  const rows = useMemo(() => {
    if (!vm) return [] as { label: string; value: string }[];

    const r: { label: string; value: string }[] = [];
    if (vm.loanType) r.push({ label: "Loan Type", value: vm.loanType });
    if (vm.lender) r.push({ label: "Lender", value: vm.lender });
    if (typeof vm.aprFrom === "number") r.push({ label: "APR From", value: `${vm.aprFrom.toFixed(1)}%` });
    if (typeof vm.maxAmount === "number") r.push({ label: "Max Amount", value: `£${vm.maxAmount.toLocaleString("en-GB")}` });
    if (typeof vm.tenure === "number") r.push({ label: "Tenure", value: `${vm.tenure} years` });
    if (vm.processingFee) r.push({ label: "Processing Fee", value: vm.processingFee });
    if (vm.moratorium) r.push({ label: "Moratorium", value: vm.moratorium });
    return r;
  }, [vm]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {loading ? (
            <div className="text-sm text-black/60">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : !vm ? (
            <div className="text-sm text-black/60">No data</div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-7 md:p-10">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100 blur-3xl" />

                <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-black/70">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      Education Loan
                    </div>

                    <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight break-words">
                      {vm.loanName}
                    </h1>

                    <p className="mt-4 text-sm md:text-base text-black/70">
                      {vm.loanType ? `${vm.loanType} loan` : ""}
                      {vm.lender ? ` • ${vm.lender}` : ""}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {typeof vm.aprFrom === "number" ? (
                        <span className="rounded-full bg-indigo-600 text-white px-4 py-2 text-xs font-semibold">
                          APR from {vm.aprFrom.toFixed(1)}%
                        </span>
                      ) : null}
                      {typeof vm.maxAmount === "number" ? (
                        <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black/70">
                          Up to £{vm.maxAmount.toLocaleString("en-GB")}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <a
                      href="/apply"
                      className="px-5 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
                    >
                      Apply / Get Call
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-7">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">About</h2>
                  <p className="mt-4 text-sm md:text-base leading-7 text-black/70 whitespace-pre-line">
                    {vm.description || "No description provided."}
                  </p>

                  <div className="mt-6 rounded-2xl border border-black/10 p-5">
                    <h3 className="text-sm font-black tracking-tight">Services</h3>
                    {Array.isArray(vm.services) && vm.services.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {vm.services.map((s: string) => (
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

                  <div className="mt-6 rounded-2xl border border-black/10 p-5">
                    <h3 className="text-sm font-black tracking-tight">Supported Countries</h3>
                    {Array.isArray(vm.supportedCountries) && vm.supportedCountries.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {vm.supportedCountries.map((c: string) => (
                          <span
                            key={c}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-black/60">No countries listed.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white p-7">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">Quick Info</h2>

                  <div className="mt-5 grid gap-3">
                    {rows.map((row) => (
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
