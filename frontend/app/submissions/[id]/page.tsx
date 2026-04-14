"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../../../lib/api";

export default function SubmissionDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const apiUrl = useMemo(() => API_URL, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.push("/login");
        return;
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${apiUrl}/api/form-submissions/${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load submission");
        const data = await res.json();
        setSubmission(data || null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load submission");
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [apiUrl, id]);

  const entries = useMemo(() => {
    if (!submission || typeof submission !== "object") return [] as Array<[string, any]>;
    return Object.entries(submission).filter(
      ([k]) => k !== "__v" && k !== "_id" && k !== "createdAt" && k !== "updatedAt"
    );
  }, [submission]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Submission Details</h1>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 rounded-xl border border-black/15 font-semibold hover:border-black/30 cursor-pointer"
            >
              Back
            </button>
          </div>

          {loading ? (
            <div className="mt-6 text-sm text-black/60">Loading...</div>
          ) : error ? (
            <div className="mt-6 text-sm text-red-600">{error}</div>
          ) : !submission ? (
            <div className="mt-6 text-sm text-black/60">No data found.</div>
          ) : (
            <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
              <div className="grid gap-3">
                {entries.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-black/5 pb-3">
                    <div className="text-sm font-semibold text-black/70 break-words">{k}</div>
                    <div className="md:col-span-2 text-sm text-black break-words">
                      {typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
