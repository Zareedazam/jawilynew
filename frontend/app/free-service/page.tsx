"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiCheckCircle, 
  FiClock, 
  FiHome, 
  FiDollarSign, 
  FiBookOpen, 
  FiAward, 
  FiGlobe, 
  FiMessageCircle, 
  FiArrowRight, 
  FiUser, 
  FiEdit3,
  FiChevronRight,
  FiShield,
  FiZap,
  FiHeart,
  FiStar
} from "react-icons/fi";

type ServiceType =
  | "Accommodation Shortlist"
  | "Education Loan Guidance"
  | "University / Course Help"
  | "Scholarship Support"
  | "Visa Guidance";

export default function FreeServicePage() {
  const router = useRouter();

  const benefits = useMemo(
    () => [
      { icon: FiZap, t: "100% Free Help", d: "No charges. No hidden fees." },
      { icon: FiShield, t: "Verified Options", d: "Trusted guidance and listings." },
      { icon: FiClock, t: "Fast Response", d: "We call you back quickly." },
      { icon: FiHeart, t: "End-to-End Support", d: "From shortlist to decision." },
    ],
    []
  );

  const steps = useMemo(
    () => [
      { s: "1", t: "Tell us your requirement", d: "Pick service and share basics.", icon: FiMessageCircle },
      { s: "2", t: "Get a free shortlist", d: "Curated options in your budget.", icon: FiCheckCircle },
      { s: "3", t: "Talk to an expert", d: "Clear answers. No confusion.", icon: FiUser },
      { s: "4", t: "Finalize with support", d: "Help till the final step.", icon: FiStar },
    ],
    []
  );

  const services = useMemo(
    () => [
      { icon: FiHome, t: "Accommodation Shortlist", d: "Verified stays near your university.", chips: ["Budget match", "Move-in help", "Verified listings"] },
      { icon: FiDollarSign, t: "Education Loan Guidance", d: "Secured/unsecured options explained.", chips: ["Eligibility", "Docs checklist", "Offer compare"] },
      { icon: FiBookOpen, t: "University / Course Help", d: "Pick the right course and university.", chips: ["Shortlist", "Intake planning", "Profile fit"] },
      { icon: FiAward, t: "Scholarship Support", d: "Find scholarships that match you.", chips: ["Best matches", "Deadlines", "Application tips"] },
      { icon: FiGlobe, t: "Visa Guidance", d: "Basics + checklist for your journey.", chips: ["Checklist", "Timelines", "Common mistakes"] },
      { icon: FiEdit3, t: "Free Consultation", d: "One-to-one call with an expert.", chips: ["Clear plan", "Next steps", "Personal support"] },
    ],
    []
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900 overflow-hidden">
        {/* Decorative background elements */}
        <div className="relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl" />
          </div>

          {/* HERO */}
          <section className="border-b border-slate-200/80 relative">
            <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
              <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
                {/* Left content */}
                <div className="max-w-2xl space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    100% Free Support Service • No Credit Card Required
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                    Get Free Help for Your{" "}
                    <span className="text-emerald-600 relative">
                      Study Journey
                      <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                        <path d="M0 0 L300 12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-emerald-300" />
                      </svg>
                    </span>
                  </h1>

                  <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                    Accommodation, education loan, course help, scholarships — sab kuch. 
                    Free guidance with real experts who understand your goals.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="/free-service/request-callback"
                      className="group relative overflow-hidden rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Get Free Support
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <button
                      onClick={() => {
                        const element = document.getElementById("services");
                        if (element) element.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="group rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm px-6 py-3 text-sm font-medium hover:border-slate-400 hover:bg-white transition-all duration-300 flex items-center gap-2"
                    >
                      Explore Services
                      <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Benefits grid */}
                  <div className="grid gap-4 pt-6 md:grid-cols-2">
                    {benefits.map((b) => {
                      const Icon = b.icon;
                      return (
                        <div key={b.t} className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-5 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 group-hover:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{b.t}</div>
                            <div className="mt-1 text-xs text-slate-600">{b.d}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES GRID */}
          <section id="services" className="mx-auto max-w-7xl px-4 py-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Free services we provide</h2>
                <p className="text-slate-600 max-w-2xl">
                  Choose what you need. We’ll guide you step by step, completely free.
                </p>
              </div>
              <a
                href="/free-service/request-callback"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-full transition-all"
              >
                Request callback
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.t}
                    className="group relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Free</span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">{service.t}</h3>
                      <p className="mt-1 text-sm text-slate-600">{service.d}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {service.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          router.push(
                            `/free-service/request-callback?service=${encodeURIComponent(String(service.t))}`
                          );
                        }}
                        className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
                      >
                        Get Help
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-7xl px-4 py-20">
              <h2 className="text-3xl font-bold tracking-tight text-center">How it works</h2>
              <p className="mt-3 text-slate-600 text-center max-w-2xl mx-auto">
                Your journey to studying abroad, simplified in four easy steps.
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.s} className="relative">
                      {idx < steps.length - 1 && (
                        <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent" />
                      )}
                      <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-200 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg group-hover:scale-110 transition-transform">
                              {step.s}
                            </div>
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 animate-ping opacity-75" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{step.t}</h3>
                            <p className="mt-1 text-xs text-slate-600">{step.d}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Icon className="text-slate-300 group-hover:text-emerald-400 transition-colors w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-emerald-100 p-3">
                      <FiMessageCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Start with a free call</h3>
                      <p className="text-slate-600 mt-1">
                        Share your goal. We’ll guide your next steps.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/free-service/request-callback"
                    className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    Get Free Callback
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}