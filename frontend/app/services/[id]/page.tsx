"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from "../../../lib/api";

type Service = {
  _id: string;
  title: string;
  tag: string;
  description: string;
};

export default function ServiceDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!id) return;
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/services/${id}`);
        if (!response.ok) throw new Error("Failed to fetch service");
        const s = await response.json();
        setService({
          _id: s?._id,
          title: s?.title || "",
          tag: s?.tag || "",
          description: s?.description || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Service Details
              </h1>
              <p className="mt-2 text-black/70">
                Learn more about this service.
              </p>
            </div>
            <a
              href="/services"
              className="px-5 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
            >
              Back
            </a>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="text-center py-10 text-black/70">Loading service...</div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="text-sm font-semibold text-red-900">
                  Error loading service
                </div>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            ) : !service ? (
              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-6">
                <div className="text-sm font-semibold">Service not found</div>
              </div>
            ) : (
              <div className="rounded-2xl border border-black/10 bg-white p-8">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border border-black/15 text-black/70">
                  {service.tag}
                </span>

                <h2 className="mt-4 text-2xl font-black tracking-tight">
                  {service.title}
                </h2>

                <p className="mt-3 text-black/70 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-8 flex gap-3 flex-wrap">
                  <a
                    href="/apply"
                    className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
                  >
                    Apply
                  </a>
                  <a
                    href="/services"
                    className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
                  >
                    View all services
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
