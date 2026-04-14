"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from "../../../lib/api";

type Course = {
  _id: string;
  title: string;
  university: string;
  city?: string;
  level?: string;
  mode?: string;
  fee?: number;
  duration?: string;
  startDate?: string;
  description?: string;
  intake?: string;
};

export default function CourseDetailsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return;
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/courses/${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error("Failed to fetch course");
        const c = await response.json();

        setCourse({
          _id: c?._id,
          title: c?.title || "",
          university: c?.university || "",
          city: c?.city || "",
          level: c?.level || "",
          mode: c?.mode || "",
          fee: typeof c?.fee === "number" ? c.fee : Number(c?.fee),
          duration: c?.duration || "",
          startDate: c?.startDate || "",
          description: c?.description || "",
          intake: c?.intake || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const startDateLabel = useMemo(() => {
    if (!course?.startDate) return "";
    const d = new Date(course.startDate);
    return Number.isNaN(d.getTime()) ? String(course.startDate) : d.toLocaleDateString();
  }, [course?.startDate]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Course Details</h1>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 rounded-xl border border-black/15 font-semibold hover:border-black/30 cursor-pointer"
            >
              Back
            </button>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="text-center py-10 text-black/70">Loading course...</div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="text-sm font-semibold text-red-900">Error loading course</div>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            ) : !course ? (
              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-6">
                <div className="text-sm font-semibold">Course not found</div>
              </div>
            ) : (
              <div className="rounded-2xl border border-black/10 bg-white p-8">
                <div className="text-sm text-black/70">{course.university}</div>
                <h2 className="mt-2 text-2xl font-black tracking-tight">{course.title}</h2>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {course.city ? (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">City</div>
                      <div className="mt-1 font-medium">{course.city}</div>
                    </div>
                  ) : null}

                  {course.level ? (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">Level</div>
                      <div className="mt-1 font-medium">{course.level}</div>
                    </div>
                  ) : null}

                  {course.mode ? (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">Mode</div>
                      <div className="mt-1 font-medium">{course.mode}</div>
                    </div>
                  ) : null}

                  {Number.isFinite(Number(course.fee)) ? (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">Fee</div>
                      <div className="mt-1 font-medium">£{Number(course.fee).toLocaleString()}</div>
                    </div>
                  ) : null}

                  {course.duration ? (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">Duration</div>
                      <div className="mt-1 font-medium">{course.duration}</div>
                    </div>
                  ) : null}

                  {startDateLabel ? (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">Start date</div>
                      <div className="mt-1 font-medium">{startDateLabel}</div>
                    </div>
                  ) : null}

                  {course.intake ? (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">Intake</div>
                      <div className="mt-1 font-medium">{course.intake}</div>
                    </div>
                  ) : null}
                </div>

                {course.description ? (
                  <p className="mt-6 text-black/70 leading-relaxed">{course.description}</p>
                ) : null}

                <div className="mt-8 flex gap-3 flex-wrap">
                  <a
                    href="/apply"
                    className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
                  >
                    Apply
                  </a>
                  <a
                    href="/courses"
                    className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
                  >
                    View all courses
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
