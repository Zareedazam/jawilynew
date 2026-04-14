"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from "../../../lib/api";

type Scholarship = {
  id: string;
  name: string;
  provider: string;
  country: string;
  level: string;
  funding: string;
  amountText: string;
  deadlineText: string;
  deadlineGroup: string;
  tags: string[];
  note: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ScholarshipDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Scholarship | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/api/scholarships/${encodeURIComponent(id)}`, {
          cache: "no-store" as any,
        });

        if (!res.ok) {
          setError(`Failed to load scholarship (HTTP ${res.status})`);
          return;
        }

        const data = await res.json();
        const mapped: Scholarship = {
          id: String(data._id || data.id || ""),
          name: String(data.name || ""),
          provider: String(data.provider || ""),
          country: String(data.country || ""),
          level: String(data.level || ""),
          funding: String(data.funding || ""),
          amountText: String(data.amountText || ""),
          deadlineText: String(data.deadlineText || ""),
          deadlineGroup: String(data.deadlineGroup || ""),
          tags: Array.isArray(data.tags) ? data.tags : [],
          note: String(data.note || ""),
          createdAt: data.createdAt ? String(data.createdAt) : undefined,
          updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
        };

        setItem(mapped);
      } catch (e: any) {
        setError(e?.message || "Failed to load scholarship");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const meta = useMemo(() => {
    if (!item) return [] as Array<{ label: string; value: string }>;
    return [
      { label: "Provider", value: item.provider },
      { label: "Country", value: item.country },
      { label: "Level", value: item.level },
      { label: "Funding", value: item.funding },
      { label: "Amount", value: item.amountText },
      { label: "Deadline", value: item.deadlineText },
      { label: "Deadline Group", value: item.deadlineGroup },
    ].filter((x) => x.value);
  }, [item]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900">
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">Scholarship Details</div>
                <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
                  {item?.name || "Scholarship"}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Back
              </button>
            </div>

            {loading ? (
              <div className="mt-6 rounded-2xl border bg-slate-50 p-6 text-sm text-slate-700">
                Loading...
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {!loading && !error && !item ? (
              <div className="mt-6 rounded-2xl border bg-slate-50 p-6 text-sm text-slate-700">
                Scholarship not found.
              </div>
            ) : null}
          </div>
        </section>

        {!loading && !error && item ? (
          <section className="mx-auto max-w-5xl px-4 py-10">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Overview</h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {meta.map((m) => (
                    <div key={m.label} className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">{m.label}</div>
                      <div className="mt-1 text-sm font-medium text-slate-900">{m.value}</div>
                    </div>
                  ))}
                </div>

                {item.note ? (
                  <div className="mt-5">
                    <div className="text-xs text-slate-500">Note</div>
                    <p className="mt-1 text-sm text-slate-700 leading-relaxed">{item.note}</p>
                  </div>
                ) : null}
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Tags</h2>
                {item.tags && item.tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-slate-600">No tags</div>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => router.push("/free-service/request-callback?service=Scholarship%20Support")}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Get Help
                  </button>
                </div>
              </aside>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
