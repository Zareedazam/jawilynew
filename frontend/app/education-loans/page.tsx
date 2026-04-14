"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_ENDPOINTS, API_URL } from "../../lib/api";

type LoanType = "Any" | "Secured" | "Unsecured";
type Country = "Any" | (string & {});

type EducationLoan = {
  _id: string;
  loanName: string;
  lender?: string;
  loanType: Exclude<LoanType, "Any">;
  maxAmount: number;
  aprFrom?: number;
  apr: number;
  tenure: number;
  processingFee?: string;
  moratorium?: string;
  supportedCountries?: string[];
  services?: string[];
  status: "Active" | "Inactive";
  repaymentPeriod?: string;
  eligibility?: string;
  description?: string;
};

function moneyGBP(n: number) {
  return `£${n.toLocaleString("en-GB")}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function EducationLoanPage() {
  return (
    <Suspense fallback={null}>
      <EducationLoanPageInner />
    </Suspense>
  );
}

function EducationLoanPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didInitFromUrl = useRef(false);
  const [loans, setLoans] = useState<EducationLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtersEnabled, setFiltersEnabled] = useState(false);

  const [applyOpen, setApplyOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<EducationLoan | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [loanType, setLoanType] = useState<LoanType>("Any");
  const [country, setCountry] = useState<Country>("Any");
  const [amount, setAmount] = useState<number>(40000);
  const [tenure, setTenure] = useState<number>(7);
  const [collateral, setCollateral] = useState<"Any" | "Yes" | "No">("Any");
  const [hasCoApplicant, setHasCoApplicant] = useState<"Any" | "Yes" | "No">(
    "Any"
  );

  useEffect(() => {
    if (didInitFromUrl.current) return;
    if (!searchParams) return;

    const qpCountry = searchParams.get("country");
    const qpAmount = searchParams.get("amount");
    const qpCollateral = searchParams.get("collateral");
    const qpCoApplicant = searchParams.get("coApplicant");

    if (qpCountry) setCountry(qpCountry as Country);
    if (qpAmount) {
      const n = Number(qpAmount);
      if (Number.isFinite(n) && n > 0) setAmount(n);
    }
    if (qpCollateral === "Yes" || qpCollateral === "No") setCollateral(qpCollateral);
    if (qpCoApplicant === "Yes" || qpCoApplicant === "No") setHasCoApplicant(qpCoApplicant);

    didInitFromUrl.current = true;
  }, [searchParams]);

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    loans.forEach((l) => {
      (Array.isArray(l.supportedCountries) ? l.supportedCountries : []).forEach((c) => {
        const v = String(c || "").trim();
        if (v) set.add(v);
      });
    });
    return ["Any", ...Array.from(set).sort((a, b) => a.localeCompare(b))] as Country[];
  }, [loans]);

  const loanTypeOptions = useMemo(() => {
    const set = new Set<Exclude<LoanType, "Any">>();
    loans.forEach((l) => {
      const t = l.loanType;
      if (t === "Secured" || t === "Unsecured") set.add(t);
    });
    return ["Any", ...Array.from(set).sort()] as LoanType[];
  }, [loans]);

  const amountOptions = useMemo(() => {
    const set = new Set<number>();
    loans.forEach((l) => {
      const n = Number(l.maxAmount);
      if (Number.isFinite(n) && n > 0) set.add(n);
    });
    const arr = Array.from(set).sort((a, b) => a - b);
    return arr;
  }, [loans]);

  const tenureOptions = useMemo(() => {
    const set = new Set<number>();
    loans.forEach((l) => {
      const n = Number(l.tenure);
      if (Number.isFinite(n) && n > 0) set.add(n);
    });
    const arr = Array.from(set).sort((a, b) => a - b);
    return arr;
  }, [loans]);

  useEffect(() => {
    if (amountOptions.length > 0 && !amountOptions.includes(amount)) {
      setAmount(amountOptions[0]);
    }
    if (tenureOptions.length > 0 && !tenureOptions.includes(tenure)) {
      setTenure(tenureOptions[0]);
    }
  }, [amount, tenure, amountOptions, tenureOptions]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.EDUCATION_LOANS);
        if (!response.ok) throw new Error("Failed to fetch loans");
        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        const normalized: EducationLoan[] = list.map((o: any) => {
          const supportedCountries = Array.isArray(o?.supportedCountries)
            ? o.supportedCountries
            : (Array.isArray(o?.countries) ? o.countries : []);
          const services = Array.isArray(o?.services)
            ? o.services
            : (Array.isArray(o?.highlights) ? o.highlights : []);
          const aprFrom = typeof o?.aprFrom !== "undefined" ? Number(o.aprFrom) : (typeof o?.apr !== "undefined" ? Number(o.apr) : undefined);
          const apr = typeof o?.apr !== "undefined" ? Number(o.apr) : (typeof aprFrom !== "undefined" ? aprFrom : 0);

          return {
            _id: o?._id,
            loanName: o?.loanName || o?.lender || "",
            lender: o?.lender,
            loanType: o?.loanType,
            maxAmount: Number(o?.maxAmount || 0),
            aprFrom,
            apr,
            tenure: Number(o?.tenure || 0),
            processingFee: o?.processingFee,
            moratorium: o?.moratorium,
            supportedCountries,
            services,
            status: o?.status || "Active",
            repaymentPeriod: o?.repaymentPeriod,
            eligibility: o?.eligibility,
            description: o?.description,
          } as EducationLoan;
        });

        setLoans(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching loans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const hero = useMemo(
    () => ({
      badge: "Quick eligibility check",
      title: "Education Loan Made Simple",
      desc: "Check eligibility, compare options, and get expert help—end to end.",
      primary: "Check Eligibility",
      secondary: "Talk to Expert",
    }),
    []
  );

  const filtered = useMemo(() => {
    const activeLoans = loans
      .filter((o) => (o.status || "Active") === "Active")
      .sort((a, b) => Number(a.apr) - Number(b.apr));

    if (!filtersEnabled) return activeLoans;

    return activeLoans.filter((o) => {
      const countries = Array.isArray(o.supportedCountries) ? o.supportedCountries : [];
      const matchesLoanType = loanType === "Any" ? true : o.loanType === loanType;
      const matchesCountry = country === "Any" ? true : countries.includes(country);
      const matchesAmount = Number(o.maxAmount) >= amount;

      const matchesTenure = Number(o.tenure) >= tenure;
      const matchesCollateral =
        collateral === "Any"
          ? true
          : collateral === "Yes"
            ? o.loanType === "Secured"
            : o.loanType === "Unsecured";

      // Co-applicant shouldn't hard-filter offers; keep it very soft.
      const matchesCoApplicant =
        hasCoApplicant === "Any"
          ? true
          : hasCoApplicant === "Yes"
            ? true
            : true;

      return (
        matchesLoanType &&
        matchesCountry &&
        matchesAmount &&
        matchesTenure &&
        matchesCollateral &&
        matchesCoApplicant
      );
    });
  }, [filtersEnabled, loanType, country, amount, tenure, collateral, hasCoApplicant, loans]);

  const openApply = (loan: EducationLoan) => {
    setSelectedLoan(loan);
    setSubmitError(null);
    setSubmitSuccess(null);
    setApplyOpen(true);
  };

  const openDetails = (loan: EducationLoan) => {
    router.push(`/education-loans/${slugify(loan.loanName || loan.lender || "")}`);
  };

  const submitApply = async () => {
    if (!selectedLoan) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const response = await fetch(`${API_URL}/api/form-submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          country: userCountry,
          message,
          formType: "loan",
          loanId: selectedLoan._id,
          loanLender: selectedLoan.lender,
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        throw new Error(t || "Failed to submit");
      }

      setSubmitSuccess("Submitted. We will contact you shortly.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setUserCountry("");
      setMessage("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                {hero.badge}
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                {hero.title}
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                {hero.desc}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/contact" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm">
                  {hero.primary}
                </a>
                <a href="/contact" className="rounded-xl border px-5 py-3 text-sm font-medium">
                  {hero.secondary}
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Minimal paperwork
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Fast support
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Compare offers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS MODAL */}
      {detailsOpen && selectedLoan && null}

      {/* APPLY MODAL */}
      {applyOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-slate-500">Apply / Get Call</div>
                <div className="mt-1 text-lg font-semibold">{selectedLoan.lender}</div>
              </div>
              <button
                onClick={() => setApplyOpen(false)}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
              <input
                value={userCountry}
                onChange={(e) => setUserCountry(e.target.value)}
                placeholder="Country"
                className="col-span-2 w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message (optional)"
                className="col-span-2 w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                rows={3}
              />
            </div>

            {submitError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {submitSuccess}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setApplyOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitApply}
                disabled={submitting}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHY US */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-semibold">Why choose our loan help</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            { t: "Compare options", d: "Secured + unsecured choices." },
            { t: "Quick guidance", d: "Free expert help." },
            { t: "Transparent info", d: "APR, fees, moratorium." },
            { t: "End-to-end support", d: "Till disbursal & beyond." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border p-5">
              <div className="text-sm font-medium">{x.t}</div>
              <div className="mt-1 text-sm text-slate-600">{x.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OFFERS */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        {/* FILTER BAR */}
        <div className="mb-5 rounded-2xl border bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Country</label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value as Country);
                  setFiltersEnabled(true);
                }}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {countryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Loan type</label>
              <select
                value={loanType}
                onChange={(e) => {
                  setLoanType(e.target.value as LoanType);
                  setFiltersEnabled(true);
                }}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {loanTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Collateral</label>
              <select
                value={collateral}
                onChange={(e) => {
                  setCollateral(e.target.value as "Any" | "Yes" | "No");
                  setFiltersEnabled(true);
                }}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["Any", "Yes", "No"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Co-applicant</label>
              <select
                value={hasCoApplicant}
                onChange={(e) => {
                  setHasCoApplicant(e.target.value as "Any" | "Yes" | "No");
                  setFiltersEnabled(true);
                }}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {["Any", "Yes", "No"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Amount needed</label>
              <select
                value={String(amount)}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                  setFiltersEnabled(true);
                }}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {amountOptions.map((n) => (
                  <option key={n} value={String(n)}>
                    {moneyGBP(n)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Tenure (years)</label>
              <select
                value={String(tenure)}
                onChange={(e) => {
                  setTenure(Number(e.target.value));
                  setFiltersEnabled(true);
                }}
                className="rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              >
                {tenureOptions.map((n) => (
                  <option key={n} value={String(n)}>
                    {n} yrs
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Matching offers</h2>
            <p className="text-sm text-slate-600">
              Showing {filtered.length} option{filtered.length === 1 ? "" : "s"}{" "}
              (sorted by APR)
            </p>
          </div>
          <div className="text-sm text-slate-600">
            Adjust filters to see more matches.
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {loading && (
            <div className="col-span-full text-center py-8">
              <div className="text-slate-600">Loading loans...</div>
            </div>
          )}

          {error && (
            <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="text-sm font-medium text-red-900">Error loading loans</div>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          )}

          {filtered.map((o) => (
            <article
              key={o._id}
              className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">
                    {o.loanType} loan
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{o.loanName}</h3>
                  {o.lender ? (
                    <div className="mt-1 text-xs text-slate-500">{o.lender}</div>
                  ) : null}
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  APR from {Number(o.aprFrom ?? o.apr).toFixed(1)}%
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Max amount</div>
                  <div className="mt-1 font-medium">{moneyGBP(Number(o.maxAmount))}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Tenure</div>
                  <div className="mt-1 font-medium">{Number(o.tenure)} yrs</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Processing fee</div>
                  <div className="mt-1 font-medium">{o.processingFee || '—'}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Moratorium</div>
                  <div className="mt-1 font-medium">{o.moratorium || '—'}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-500">Supported countries</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Array.isArray(o.supportedCountries) ? o.supportedCountries : []).slice(0, 6).map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-500">Services</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Array.isArray(o.services) ? o.services : []).slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => openDetails(o)}
                  className="rounded-xl border px-4 py-2 text-sm font-medium"
                >
                  View details
                </button>
                <button
                  onClick={() => openApply(o)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Apply / Get Call
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Note: Rates and eligibility depend on profile, university, and documents.
              </p>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
            <div className="text-sm font-medium">No matches found</div>
            <div className="mt-1 text-sm text-slate-600">
              Try increasing amount limit, changing country, or set loan type to “Any”.
            </div>
          </div>
        )}
      </section>

      {/* PROCESS + FAQ */}
      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-semibold">How it works</h2>
              <div className="mt-4 grid gap-3">
                {[
                  { s: "1", t: "Check eligibility", d: "Share amount, country, profile." },
                  { s: "2", t: "Get shortlist", d: "Best options for your case." },
                  { s: "3", t: "Submit documents", d: "We help with checklist." },
                  { s: "4", t: "Sanction & disbursal", d: "Guidance till funds release." },
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
              <h2 className="text-lg font-semibold">FAQs</h2>
              <div className="mt-4 space-y-3">
                {[
                  {
                    q: "Secured vs Unsecured?",
                    a: "Secured needs collateral. Unsecured usually needs strong profile/co-applicant.",
                  },
                  {
                    q: "What is moratorium?",
                    a: "You may start repayment after course completion + grace period.",
                  },
                  {
                    q: "What documents are needed?",
                    a: "KYC, admission letter, fee structure, income proof, bank statements, and more.",
                  },
                  {
                    q: "How long does approval take?",
                    a: "Depends on lender and documents. We try to speed it up.",
                  },
                ].map((x) => (
                  <div key={x.q} className="rounded-xl bg-slate-50 p-4">
                    <div className="text-sm font-medium">{x.q}</div>
                    <div className="mt-1 text-sm text-slate-600">{x.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-2xl border bg-white p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Need help choosing the right loan?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Share your details and we’ll guide you with the best route.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="/contact" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                  Talk to Expert
                </a>
                <a href="/contact" className="rounded-xl border px-5 py-3 text-sm font-medium">
                  Request Call Back
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
