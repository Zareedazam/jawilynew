"use client";

import React, { useMemo, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiCheckCircle, 
  FiStar, 
  FiClock, 
  FiZap, 
  FiArrowRight, 
  FiChevronRight,
  FiPackage,
  FiAward,
  FiShield,
  FiTrendingUp,
  FiMessageCircle
} from "react-icons/fi";
import { API_URL } from "../../lib/api";

type PlanId = "starter" | "plus" | "pro";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  sub: string;
  bestFor: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "£49",
    sub: "One-time",
    bestFor: "Quick shortlist + basic guidance",
    features: [
      "Accommodation shortlist (up to 8 options)",
      "Budget + area guidance",
      "1 expert call (20 mins)",
      "Email support (3 days)",
    ],
    cta: "Buy Starter",
  },
  {
    id: "plus",
    name: "Plus",
    price: "£99",
    sub: "One-time",
    bestFor: "Shortlist + booking help",
    features: [
      "Accommodation shortlist (up to 15 options)",
      "Move-in & contract guidance",
      "2 expert calls (30 mins each)",
      "Priority support (7 days)",
      "Best value for most students",
    ],
    cta: "Buy Plus",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "£199",
    sub: "One-time",
    bestFor: "End-to-end premium support",
    features: [
      "Accommodation + loan + visa checklist support",
      "Shortlist (up to 25 options)",
      "Dedicated advisor",
      "Unlimited calls for 14 days",
      "Priority escalation with partners",
      "Document checklist + review",
    ],
    cta: "Buy Pro",
  },
];

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function PremiumPage() {
  const [selected, setSelected] = useState<PlanId>("plus");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<"success" | "canceled" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success") === "1";
    const sessionId = params.get("session_id");
    if (success) setBanner("success");
    if (params.get("canceled") === "1") setBanner("canceled");

    const verify = async () => {
      if (!success || !sessionId) return;
      try {
        const res = await fetch(
          `${API_URL}/api/payments/verify-session?sessionId=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to verify payment");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to verify payment");
      }
    };

    verify();
  }, []);

  const startCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      const raw = localStorage.getItem("user");
      if (!raw) {
        setError("Please login to purchase a plan.");
        return;
      }

      const user = JSON.parse(raw);
      const userId = user?.id || user?._id;
      const purchaserName = user?.name || "";
      const purchaserEmail = user?.email || "";

      if (!userId) {
        setError("Missing userId. Please login again.");
        return;
      }

      const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selected,
          userId,
          purchaserName,
          purchaserEmail,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.message || "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900 overflow-hidden">
        {banner === "success" && (
          <div className="mx-auto max-w-7xl px-4 pt-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Payment successful. Your plan will appear in your dashboard shortly.
            </div>
          </div>
        )}
        {banner === "canceled" && (
          <div className="mx-auto max-w-7xl px-4 pt-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Payment canceled.
            </div>
          </div>
        )}
        {error && (
          <div className="mx-auto max-w-7xl px-4 pt-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          </div>
        )}
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-slate-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
        </div>

        {/* HERO */}
        <section className="relative border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                <FiZap className="w-4 h-4" />
                Premium Support • Priority Access
              </div>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Get Priority Help. <br />
                <span className="text-amber-600 relative">
                  Save Time. Avoid Mistakes.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 8" fill="none">
                    <path d="M0 0 L300 8" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-amber-300" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                Premium plans for students who want faster shortlists, expert calls,
                and end-to-end support till booking.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#plans"
                  className="group relative overflow-hidden rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View Plans
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="#plans"
                  className="group rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm px-6 py-3 text-sm font-medium hover:border-slate-400 hover:bg-white transition-all duration-300 flex items-center gap-2"
                >
                  Explore Plans
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {["Dedicated advisor", "Priority support", "Faster shortlists"].map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU GET - moved above plans */}
        <section className="mx-auto max-w-7xl px-4 -mt-8 mb-12">
          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-slate-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
                  <FiPackage className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">What you get</h3>
                  <p className="text-slate-600">Premium = speed + clarity + support.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: FiZap, t: "Faster Shortlist", d: "Options curated quickly." },
                  { icon: FiMessageCircle, t: "Expert Calls", d: "Clear next steps." },
                  { icon: FiShield, t: "Booking Guidance", d: "Avoid hidden issues." },
                  { icon: FiTrendingUp, t: "Priority Support", d: "We respond faster." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.t} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <div className="p-2 bg-white rounded-lg text-slate-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{item.t}</div>
                        <div className="text-sm text-slate-600">{item.d}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 text-center text-sm text-slate-500">
                One-time payment. No subscriptions.
              </p>
            </div>
          </div>
        </section>

        {/* PLANS SECTION */}
        <section id="plans" className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Premium Plans</h2>
            <p className="mt-3 text-slate-600">
              Select the plan that matches your timeline. Most students choose <span className="font-semibold text-amber-600">Plus</span>.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const isSelected = selected === plan.id;
              return (
                <div
                  key={plan.id}
                  className={cx(
                    "relative group cursor-pointer rounded-2xl border p-6 transition-all duration-300",
                    isSelected 
                      ? "border-amber-500 ring-2 ring-amber-200 shadow-xl scale-[1.02]" 
                      : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                  )}
                  onClick={() => setSelected(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-6">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                        <FiAward className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-black">{plan.price}</span>
                        <span className="text-sm text-slate-500">/{plan.sub}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{plan.bestFor}</p>
                    </div>
                    {isSelected && (
                      <div className="p-1 bg-amber-100 rounded-full text-amber-600">
                        <FiCheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-sm">
                        <FiCheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <span className={cx(
                      "inline-flex items-center gap-2 text-sm font-medium",
                      isSelected ? "text-amber-600" : "text-slate-600 group-hover:text-slate-900"
                    )}>
                      {isSelected ? "Selected" : "Select plan"}
                      <FiArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simple CTA after plans */}
          <div className="mt-12 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!loading) startCheckout();
              }}
              className={cx(
                "inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-white font-semibold transition-all shadow-lg hover:shadow-xl",
                loading ? "opacity-60 pointer-events-none" : "hover:bg-slate-800"
              )}
            >
              {loading ? "Redirecting to payment..." : "Continue with selected plan"}
              <FiArrowRight />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}