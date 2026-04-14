"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from "../../lib/api";

type Service = {
  _id: string;
  title: string;
  tag: string;
  description: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.SERVICES);
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        const normalized: Service[] = list.map((s: any) => ({
          _id: s?._id,
          title: s?.title || "",
          tag: s?.tag || "",
          description: s?.description || "",
        }));
        setServices(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Services
            </h1>
            <p className="mt-3 text-black/70 max-w-2xl">
              Choose a service that fits your goals. We guide you at every step.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a
              href="/apply"
              className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
            >
              Book Consultation
            </a>
          </div>
        </div>

        {/* Free & Premium Service Sections */}
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-black/10 bg-white p-8 hover:border-black/25 transition shadow-sm hover:shadow-md">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 text-emerald-700 bg-emerald-50">
              Free
            </span>
            <h3 className="mt-4 text-xl font-black tracking-tight">Free Service</h3>
            <p className="mt-2 text-black/60 text-sm">
              Get started with free consultation, university shortlisting, and basic application guidance at no cost.
            </p>
            <div className="mt-5 flex gap-2 flex-wrap">
              <a
                href="/free-service"
                className="px-5 py-2 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90"
              >
                Explore Free Service
              </a>
              <a
                href="/contact"
                className="px-5 py-2 rounded-full border border-black/15 text-sm font-semibold hover:border-black/30"
              >
                Talk to Expert
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-8 hover:border-black/25 transition shadow-sm hover:shadow-md">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border border-amber-200 text-amber-700 bg-amber-50">
              Premium
            </span>
            <h3 className="mt-4 text-xl font-black tracking-tight">Premium Service</h3>
            <p className="mt-2 text-black/60 text-sm">
              End-to-end premium support including application management, visa guidance, accommodation, and more.
            </p>
            <div className="mt-5 flex gap-2 flex-wrap">
              <a
                href="/premium"
                className="px-5 py-2 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90"
              >
                Explore Premium
              </a>
              <a
                href="/contact"
                className="px-5 py-2 rounded-full border border-black/15 text-sm font-semibold hover:border-black/30"
              >
                Talk to Expert
              </a>
            </div>
          </div>
        </div>

        {/* Dynamic Services from API */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-black/70">Loading services...</div>
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="text-sm font-semibold text-red-900">Error loading services</div>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          ) : services.length > 0 ? (
            services.map((s) => (
              <ServiceCard
                key={s._id}
                id={s._id}
                title={s.title}
                tag={s.tag}
                desc={s.description}
              />
            ))
          ) : null}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-black/10 bg-neutral-50 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Not sure which service to choose?
            </h2>
            <p className="text-black/70 mt-2">
              Talk to an expert and get a clear roadmap.
            </p>
          </div>
          <a
            href="/apply"
            className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
          >
            Get Free Advice
          </a>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}

function ServiceCard({
  id,
  title,
  tag,
  desc,
}: {
  id: string;
  title: string;
  tag: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 hover:border-black/25 transition">
      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border border-black/15 text-black/70">
        {tag}
      </span>

      <h3 className="mt-4 text-lg font-black tracking-tight">{title}</h3>

      <p className="mt-2 text-black/60 text-sm">{desc}</p>

      <div className="mt-5 flex gap-2 flex-wrap">
        <a
          href="/apply"
          className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90"
        >
          Apply
        </a>
        <a
          href={`/services/${id}`}
          className="px-4 py-2 rounded-full border border-black/15 text-sm font-semibold hover:border-black/30"
        >
          View Details
        </a>
      </div>
    </div>
  );
}
