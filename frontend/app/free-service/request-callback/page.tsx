"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FiCheckCircle, FiMail, FiPhone, FiUser, FiCalendar } from "react-icons/fi";

type ServiceType =
  | "Accommodation Shortlist"
  | "Education Loan Guidance"
  | "University / Course Help"
  | "Scholarship Support"
  | "Visa Guidance"
  | "Free Consultation";

type StudyCountry = "UK" | "USA" | "Canada" | "Australia" | "Germany" | "Ireland" | "Other";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  serviceType: ServiceType;
  studyCountry: StudyCountry;
  intake: string;
  budget: string;
  message: string;
  consent: boolean;
};

const DEFAULT_FORM: FormState = {
  fullName: "",
  phone: "",
  email: "",
  serviceType: "Accommodation Shortlist",
  studyCountry: "UK",
  intake: "",
  budget: "",
  message: "",
  consent: true,
};

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!form.fullName.trim()) errors.fullName = "Name is required";
  if (!form.phone.trim()) errors.phone = "Phone is required";
  if (!form.email.trim() || !form.email.includes("@")) errors.email = "Valid email is required";
  if (!form.consent) errors.consent = "Please accept the consent";

  return errors;
}

const SERVICE_OPTIONS: ServiceType[] = [
  "Accommodation Shortlist",
  "Education Loan Guidance",
  "University / Course Help",
  "Scholarship Support",
  "Visa Guidance",
  "Free Consultation",
];

function RequestCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const service = searchParams?.get("service") || "";

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!service) return;
    if (SERVICE_OPTIONS.includes(service as ServiceType)) {
      setForm((prev) => ({ ...prev, serviceType: service as ServiceType }));
    }
  }, [service]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);

    if (Object.keys(v).length > 0) return;

    setSubmitted(true);
  }

  function resetForm() {
    setForm(DEFAULT_FORM);
    setErrors({});
    setSubmitted(false);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl" />
          </div>

          <section className="border-b border-slate-200/80 relative">
            <div className="mx-auto max-w-4xl px-4 py-14">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Request a Free Callback</h1>
                  <p className="mt-2 text-slate-600">Fill details. We’ll contact you within 24h.</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-5 py-2 rounded-xl border border-slate-300 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <FiMail />
                  </div>
                  <div>
                    <div className="font-semibold">Request a Free Callback</div>
                    <p className="text-xs text-slate-600">We don’t spam. We only contact for your request.</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <FiCheckCircle className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="font-medium text-emerald-800">Submitted Successfully ✅</div>
                      <p className="mt-1 text-sm text-emerald-700">Thanks! Our team will reach out soon.</p>
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Service</div>
                        <div className="mt-1 font-medium">{form.serviceType}</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Country</div>
                        <div className="mt-1 font-medium">{form.studyCountry}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Submit Another
                      </button>
                      <a
                        href="/free-service"
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-medium hover:bg-slate-50 transition-colors"
                      >
                        Back to services
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">Full name</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            value={form.fullName}
                            onChange={(e) => update("fullName", e.target.value)}
                            placeholder="Your name"
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                          />
                        </div>
                        {errors.fullName && (
                          <span className="text-xs text-red-600 mt-1 block">{errors.fullName}</span>
                        )}
                      </div>

                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">Phone</label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="+44..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                          />
                        </div>
                        {errors.phone && (
                          <span className="text-xs text-red-600 mt-1 block">{errors.phone}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 mb-1 block">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@email.com"
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                        />
                      </div>
                      {errors.email && (
                        <span className="text-xs text-red-600 mt-1 block">{errors.email}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">Service</label>
                        <select
                          value={form.serviceType}
                          onChange={(e) => update("serviceType", e.target.value as ServiceType)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all appearance-none"
                          style={{
                            backgroundImage:
                              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\' stroke=\'%23999\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 0.75rem center",
                            backgroundSize: "1.25rem",
                          }}
                        >
                          {SERVICE_OPTIONS.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">Study country</label>
                        <select
                          value={form.studyCountry}
                          onChange={(e) => update("studyCountry", e.target.value as StudyCountry)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all appearance-none"
                          style={{
                            backgroundImage:
                              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\' stroke=\'%23999\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 0.75rem center",
                            backgroundSize: "1.25rem",
                          }}
                        >
                          {[
                            "UK",
                            "USA",
                            "Canada",
                            "Australia",
                            "Germany",
                            "Ireland",
                            "Other",
                          ].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">Intake</label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            value={form.intake}
                            onChange={(e) => update("intake", e.target.value)}
                            placeholder="e.g. Sep 2026"
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">Budget (optional)</label>
                        <input
                          value={form.budget}
                          onChange={(e) => update("budget", e.target.value)}
                          placeholder="e.g. £200/wk"
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 mb-1 block">Message (optional)</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        placeholder="Tell us what you need..."
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
                      />
                    </div>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => update("consent", e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
                      />
                      <span className="text-slate-700">
                        I agree to be contacted via call/WhatsApp/email for support.
                        {errors.consent && (
                          <span className="block text-xs text-red-600 mt-1">{errors.consent}</span>
                        )}
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-slate-900 py-4 text-sm font-medium text-white hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      Get Free Callback
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RequestCallbackPage() {
  return (
    <Suspense fallback={null}>
      <RequestCallbackInner />
    </Suspense>
  );
}
