"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, API_URL } from "../lib/api";

type Tab =
  | "Courses"
  | "Scholarship"
  | "Universities"
  | "Accommodation"
  | "Education Loan";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleDownloadGuide = () => {
    const link = document.createElement("a");
    link.href = "/university_ranking.xlsx";
    link.download = "Jawily_Guide.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs: Tab[] = useMemo(
    () => [
      "Courses",
      "Scholarship",
      "Universities",
      "Accommodation",
      "Education Loan",
    ],
    []
  );

  const [activeTab, setActiveTab] = useState<Tab>("Courses");

  const hero = useMemo(() => {
    switch (activeTab) {
      case "Accommodation":
        return {
          badge: "Verified stays near campus",
          title: "Find Student Accommodation Fast",
          desc: "Search by city or university. Compare verified properties, prices, and move-in dates.",
          primary: "Get Free Shortlist",
          secondary: "Talk to Expert",
        };
      case "Education Loan":
        return {
          badge: "Quick eligibility check",
          title: "Education Loan Made Simple",
          desc: "Check eligibility, compare lenders, and get documentation support with expert help.",
          primary: "Check Eligibility",
          secondary: "Request Call Back",
        };
      case "Universities":
        return {
          badge: "Search by name or location",
          title: "Find the Right University",
          desc: "Explore universities by country, city, or name. Get rankings, fees, intakes, and scholarships.",
          primary: "Explore Universities",
          secondary: "Book Consultation",
        };
      case "Scholarship":
        return {
          badge: "Funding opportunities",
          title: "Find Scholarships That Fit You",
          desc: "Search scholarships by country and keyword. Get guidance on eligibility and documents.",
          primary: "Find Scholarships",
          secondary: "Talk to Advisor",
        };
      default:
        return {
          badge: "Study abroad made simple",
          title: "Study Abroad Consultants",
          desc: "Counselling, shortlisting, applications, documents and visa guidance — everything in one place.",
          primary: "Book Free Consultation",
          secondary: "Download Guide",
        };
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="bg-black sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-white">
            Jawily
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
            <Link className="hover:opacity-70 transition" href="/courses">
              Courses
            </Link>
            <Link className="hover:opacity-70 transition" href="/universities">
              Universities
            </Link>
            <Link className="hover:opacity-70 transition" href="/accommodation">
              Accommodation
            </Link>
            <Link
              className="hover:opacity-70 transition"
              href="/education-loans"
            >
              Education Loans
            </Link>
            <Link className="hover:opacity-70 transition" href="/services">
              Services
            </Link>
            <Link className="hover:opacity-70 transition" href="/contact">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-white hover:opacity-70 transition"
                  title="Go to Dashboard"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="/apply"
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition"
                >
                  Apply Now
                </Link>
              </>
            ) : (
              <Link
                className="text-sm text-white hover:opacity-70 transition"
                href="/login"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-white via-white to-neutral-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(0,0,0,0.08),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(0,0,0,0.05),transparent_50%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-semibold text-black">
                {hero.badge}
              </div>

              <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-black">
                {hero.title}
              </h1>

              <p className="mt-4 text-base md:text-lg text-black/70">
                {hero.desc}
              </p>
            </div>

            <div className="flex gap-3 md:mt-1 flex-wrap">
              <button 
                onClick={() => {
                  if (hero.secondary === "Download Guide") {
                    handleDownloadGuide();
                  } else {
                    window.location.href = "/contact";
                  }
                }}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black border border-black/15 hover:border-black/30 hover:bg-black/[0.03] transition cursor-pointer">
                {hero.secondary}
              </button>
              <button 
                onClick={() => {
                  window.location.href = "/contact";
                }}
                className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer shadow-sm shadow-black/20">
                {hero.primary}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {tabs.map((t) => {
              const isActive = t === activeTab;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={[
                    "rounded-full px-5 py-2 text-sm font-semibold transition border cursor-pointer shadow-sm",
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-black/15 bg-white text-black hover:bg-black/[0.04]",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur border border-black/10 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] md:p-5">
            <SearchArea activeTab={activeTab} />
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center">
          <p className="text-xs tracking-widest text-black/50 font-semibold">
            BOOK A FREE CONSULTATION
          </p>
          <h2 className="text-3xl font-black mt-2 tracking-tight">
            Popular University Courses
          </h2>
          <p className="text-black/70 mt-3 max-w-2xl mx-auto">
            Explore categories and start your journey with a clear process.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <IconCard title="LAW" />
          <IconCard title="BUSINESS" />
          <IconCard title="ENGINEERING" />
          <IconCard title="MBA" />
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/courses"
            className="px-6 py-3 rounded-full border border-black/15 hover:border-black/30 font-semibold"
          >
            View All Courses
          </Link>
        </div>
      </section>

      {/* UNIVERSITIES */}
      <section id="universities" className="bg-neutral-50 border-y">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="text-center">
            <p className="text-xs tracking-widest text-black/50 font-semibold">
              BOOK A FREE CONSULTATION
            </p>
            <h2 className="text-3xl font-black mt-2 tracking-tight">
              Institution Profiles
            </h2>
            <p className="text-black/70 mt-3 max-w-2xl mx-auto">
              Rankings, scholarships and course options — all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-10">
            <SmallTile title="SEE ALL UNIVERSITIES" href="/universities" />
            <SmallTile title="PATHWAY" href="/coming-soon" />
            <SmallTile title="LANGUAGE SCHOOL" href="/coming-soon" />
            <SmallTile title="A-LEVEL / BOARDING" href="/coming-soon" />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center">
          <p className="text-xs tracking-widest text-black/50 font-semibold">
            BOOK A FREE CONSULTATION
          </p>
          <h2 className="text-3xl font-black mt-2 tracking-tight">
            Why Students Choose Jawily
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-10">
          <StatCard big="4.9/5" small="Reviews" />
          <StatCard big="3+" small="Years Experience" />
          <StatCard big="1050+" small="Applications Submitted" />
          <StatCard big="Awarded" small="Counselling Excellence" />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-neutral-50 border-y">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Services</h2>
              <p className="text-black/70 mt-2">
                Choose a plan. Get guided support.
              </p>
            </div>
            <Link
              href="/services"
              className="px-5 py-2 rounded-full border border-black/15 hover:border-black/30 font-semibold"
            >
              View All Services
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-10">
            <DynamicServices />
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section id="stories" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-3xl font-black tracking-tight">Student Stories</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Quote
            name="Ayesha"
            course="MBA - UK"
            text="Counselling was smooth and fast. Got shortlist in 2 days."
          />
          <Quote
            name="Rahul"
            course="Engineering - Canada"
            text="Document tracking made everything clear and simple."
          />
          <Quote
            name="Sara"
            course="Masters - Australia"
            text="The step-by-step process feels premium and easy."
          />
        </div>
      </section>

      {/* NEWS + EVENTS */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid lg:grid-cols-2 gap-8">
          <ListBox title="News" />
          <ListBox title="Events" />
        </div>

        <StudyingAbroadSection />
      </section>

      {/* CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Ready to Apply?</h2>
            <p className="text-white/70 mt-2">
              Get a free consultation and a clear next step plan.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-black hover:bg-white/90 font-semibold"
            >
              Book Free Consultation
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full border border-white/25 hover:border-white/50 font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="text-xl font-black">Jawily</div>
            <p className="text-black/60 mt-2">Study abroad made simple.</p>
          </div>

          <FooterCol
            title="Services"
            items={[
              { label: "Free Service", href: "/free-service" },
              { label: "Premium", href: "/premium" },
            ]}
          />
          <FooterCol
            title="Study Options"
            items={[
              { label: "Foundation", href: "/foundation" },
              { label: "Undergraduate", href: "/undergraduate" },
              { label: "Postgraduate", href: "/postgraduate" },
              { label: "PhD", href: "/phd" },
            ]}
          />
          <FooterCol
            title="Info"
            items={[
              { label: "Rankings", href: "/rankings" },
              { label: "Scholarships", href: "/scholarships" },
              { label: "Deadlines", href: "/deadlines" },
              { label: "Contact", href: "/contact" },
            ]}
          />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-black/50 border-t flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Jawily. All rights reserved.</p>
          <div className="flex gap-4">
            <Link className="hover:text-black" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-black" href="/terms">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===================== HERO SEARCH (DYNAMIC) ===================== */

function SearchArea({ activeTab }: { activeTab: Tab }) {
  const router = useRouter();
  const labelCls = "text-xs font-semibold text-black/70";
  const inputCls =
    "mt-1 w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-black/40";
  const selectCls =
    "mt-1 w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/40";

  type HomeCourseLevel = "Any" | "Undergraduate" | "Postgraduate" | "PhD" | "Diploma";
  type HomeUniversity = { name?: string; country?: string };
  type HomeCourse = { title?: string; level?: string };
  type HomeScholarship = { name?: string; country?: string; level?: string };

  const [universities, setUniversities] = useState<HomeUniversity[]>([]);
  const [courses, setCourses] = useState<HomeCourse[]>([]);
  const [scholarships, setScholarships] = useState<HomeScholarship[]>([]);
  const [loadingCoursesFilter, setLoadingCoursesFilter] = useState(false);
  const [loadingUniversitiesFilter, setLoadingUniversitiesFilter] = useState(false);
  const [loadingScholarshipsFilter, setLoadingScholarshipsFilter] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("Any");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("Any");
  const [selectedLevel, setSelectedLevel] = useState<HomeCourseLevel>("Any");

  const [selectedScholarshipCountry, setSelectedScholarshipCountry] = useState("Any");
  const [selectedScholarshipName, setSelectedScholarshipName] = useState("Any");
  const [selectedScholarshipLevel, setSelectedScholarshipLevel] = useState("Any");

  const [selectedUniversityCountry, setSelectedUniversityCountry] = useState("Any");
  const [selectedUniversityName, setSelectedUniversityName] = useState("Any");

  const [selectedAccommodationQuery, setSelectedAccommodationQuery] = useState("");
  const [selectedAccommodationMoveIn, setSelectedAccommodationMoveIn] = useState("");
  const [selectedAccommodationBudget, setSelectedAccommodationBudget] = useState<string>("Any");

  const [selectedLoanCountry, setSelectedLoanCountry] = useState("UK");
  const [selectedLoanAmount, setSelectedLoanAmount] = useState("");
  const [selectedLoanCoApplicant, setSelectedLoanCoApplicant] = useState("Yes");

  const countryOptions = useMemo(() => {
    const opts = Array.from(
      new Set(universities.map((u) => String(u?.country || "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [universities]);

  const courseTitleOptions = useMemo(() => {
    const opts = Array.from(
      new Set(courses.map((c) => String(c?.title || "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    return ["Any", ...opts];
  }, [courses]);

  const levelOptions = useMemo(() => {
    const allowed: HomeCourseLevel[] = ["Undergraduate", "Postgraduate", "PhD", "Diploma"];
    const set = new Set<HomeCourseLevel>();
    courses.forEach((c) => {
      const lvl = String(c?.level || "").trim() as HomeCourseLevel;
      if (allowed.includes(lvl)) set.add(lvl);
    });
    const opts = Array.from(set).sort((a, b) => a.localeCompare(b));
    return (["Any", ...opts] as HomeCourseLevel[]);
  }, [courses]);

  useEffect(() => {
    if (activeTab !== "Courses") return;

    const fetchOptions = async () => {
      try {
        setLoadingCoursesFilter(true);
        const [uniRes, courseRes] = await Promise.all([
          fetch(API_ENDPOINTS.UNIVERSITIES, { cache: "no-store" as any }),
          fetch(API_ENDPOINTS.COURSES, { cache: "no-store" as any }),
        ]);

        const uniData = uniRes.ok ? await uniRes.json() : [];
        const courseData = courseRes.ok ? await courseRes.json() : [];

        setUniversities(Array.isArray(uniData) ? uniData : []);
        setCourses(Array.isArray(courseData) ? courseData : []);
      } catch (e) {
        setUniversities([]);
        setCourses([]);
      } finally {
        setLoadingCoursesFilter(false);
      }
    };

    fetchOptions();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "Universities") return;

    const fetchUniversities = async () => {
      try {
        setLoadingUniversitiesFilter(true);
        const res = await fetch(API_ENDPOINTS.UNIVERSITIES, { cache: "no-store" as any });
        const data = res.ok ? await res.json() : [];
        setUniversities(Array.isArray(data) ? data : []);
      } catch (e) {
        setUniversities([]);
      } finally {
        setLoadingUniversitiesFilter(false);
      }
    };

    fetchUniversities();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "Scholarship") return;

    const fetchScholarships = async () => {
      try {
        setLoadingScholarshipsFilter(true);
        const res = await fetch(`${API_URL}/api/scholarships`, { cache: "no-store" as any });
        const data = res.ok ? await res.json() : [];
        setScholarships(Array.isArray(data) ? data : []);
      } catch (e) {
        setScholarships([]);
      } finally {
        setLoadingScholarshipsFilter(false);
      }
    };

    fetchScholarships();
  }, [activeTab]);

  const onSearch = () => {
    if (activeTab === "Courses") {
      const params = new URLSearchParams();
      if (selectedCountry && selectedCountry !== "Any") params.set("country", selectedCountry);
      if (selectedCourseTitle && selectedCourseTitle !== "Any") params.set("course", selectedCourseTitle);
      if (selectedLevel && selectedLevel !== "Any") params.set("level", selectedLevel);
      const qs = params.toString();
      router.push(qs ? `/courses?${qs}` : "/courses");
      return;
    }

    if (activeTab === "Accommodation") {
      const params = new URLSearchParams();
      if (selectedAccommodationQuery.trim()) params.set("q", selectedAccommodationQuery.trim());
      if (selectedAccommodationMoveIn) params.set("moveIn", selectedAccommodationMoveIn);

      if (selectedAccommodationBudget && selectedAccommodationBudget !== "Any") {
        params.set("budget", selectedAccommodationBudget);
      }

      const qs = params.toString();
      router.push(qs ? `/accommodation?${qs}` : "/accommodation");
      return;
    }

    if (activeTab === "Education Loan") {
      const params = new URLSearchParams();
      if (selectedLoanCountry && selectedLoanCountry !== "Any") {
        params.set("country", selectedLoanCountry);
      }
      if (selectedLoanAmount) {
        const n = Number(selectedLoanAmount.replace(/,/g, ""));
        if (Number.isFinite(n) && n > 0) params.set("amount", String(n));
      }
      if (selectedLoanCoApplicant && selectedLoanCoApplicant !== "Any") {
        params.set("coApplicant", selectedLoanCoApplicant);
      }
      const qs = params.toString();
      router.push(qs ? `/education-loans?${qs}` : "/education-loans");
      return;
    }

    if (activeTab === "Universities") {
      const params = new URLSearchParams();
      if (selectedUniversityCountry && selectedUniversityCountry !== "Any") {
        params.set("country", selectedUniversityCountry);
      }
      if (selectedUniversityName && selectedUniversityName !== "Any") {
        params.set("name", selectedUniversityName);
      }
      const qs = params.toString();
      router.push(qs ? `/universities?${qs}` : "/universities");
      return;
    }

    if (activeTab === "Scholarship") {
      const params = new URLSearchParams();
      if (selectedScholarshipCountry && selectedScholarshipCountry !== "Any") {
        params.set("country", selectedScholarshipCountry);
      }
      if (selectedScholarshipName && selectedScholarshipName !== "Any") {
        params.set("scholarship", selectedScholarshipName);
      }
      if (selectedScholarshipLevel && selectedScholarshipLevel !== "Any") {
        params.set("level", selectedScholarshipLevel);
      }
      const qs = params.toString();
      router.push(qs ? `/scholarships?${qs}` : "/scholarships");
      return;
    }

    alert(`Searching in: ${activeTab}`);
  };

  const GoBtn = () => (
    <button
      onClick={onSearch}
      className="w-full rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 cursor-pointer"
    >
      Go
    </button>
  );

  if (activeTab === "Courses") {
    return (
      <div className="grid gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4">
          <div className={labelCls}>Country</div>
          <select
            className={selectCls}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            disabled={loadingCoursesFilter}
          >
            {countryOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-5">
          <div className={labelCls}>Course name</div>
          <select
            className={selectCls}
            value={selectedCourseTitle}
            onChange={(e) => setSelectedCourseTitle(e.target.value)}
            disabled={loadingCoursesFilter}
          >
            {courseTitleOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <div className={labelCls}>Level</div>
          <select
            className={selectCls}
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as HomeCourseLevel)}
            disabled={loadingCoursesFilter}
          >
            {levelOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <GoBtn />
        </div>
      </div>
    );
  }

  if (activeTab === "Accommodation") {
    return (
      <div className="grid gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <div className={labelCls}>City / University</div>
          <input
            className={inputCls}
            placeholder="Search by city, university, or property"
            value={selectedAccommodationQuery}
            onChange={(e) => setSelectedAccommodationQuery(e.target.value)}
          />
        </div>

        <div className="md:col-span-3">
          <div className={labelCls}>Move-in by</div>
          <input
            className={inputCls}
            type="date"
            value={selectedAccommodationMoveIn}
            onChange={(e) => setSelectedAccommodationMoveIn(e.target.value)}
          />
        </div>

        <div className="md:col-span-3">
          <div className={labelCls}>Budget</div>
          <select
            className={selectCls}
            value={selectedAccommodationBudget}
            onChange={(e) => setSelectedAccommodationBudget(e.target.value)}
          >
            <option value="Any">Any</option>
            <option value="150">Under £150/week</option>
            <option value="250">£150–£250/week</option>
            <option value="400">£250–£400/week</option>
            <option value="999999">£400+/week</option>
          </select>
        </div>

        <div className="md:col-span-1">
          <GoBtn />
        </div>
      </div>
    );
  }

  if (activeTab === "Education Loan") {
    return (
      <div className="grid gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4">
          <div className={labelCls}>Country</div>
          <select
            className={selectCls}
            value={selectedLoanCountry}
            onChange={(e) => setSelectedLoanCountry(e.target.value)}
          >
            <option value="UK">UK</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <div className={labelCls}>Loan Amount</div>
          <input
            className={inputCls}
            placeholder="e.g. 20,00,000"
            value={selectedLoanAmount}
            onChange={(e) => setSelectedLoanAmount(e.target.value)}
          />
        </div>

        <div className="md:col-span-3">
          <div className={labelCls}>Co-applicant</div>
          <select
            className={selectCls}
            value={selectedLoanCoApplicant}
            onChange={(e) => setSelectedLoanCoApplicant(e.target.value)}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="md:col-span-1">
          <GoBtn />
        </div>

        <div className="md:col-span-12 mt-2 rounded-xl border border-black/10 bg-black/[0.02] p-3 text-xs text-black/60">
          Tip: Eligibility depends on university, course, collateral, and income.
        </div>
      </div>
    );
  }

  if (activeTab === "Universities") {
    const universityCountryOptions = [
      "Any",
      ...Array.from(
        new Set(universities.map((u) => String(u?.country || "").trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    ];

    const universityNameOptions = [
      "Any",
      ...Array.from(
        new Set(universities.map((u) => String(u?.name || "").trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    ];

    return (
      <div className="grid gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4">
          <div className={labelCls}>Country</div>
          <select
            className={selectCls}
            value={selectedUniversityCountry}
            onChange={(e) => setSelectedUniversityCountry(e.target.value)}
            disabled={loadingUniversitiesFilter}
          >
            {universityCountryOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-7">
          <div className={labelCls}>University name</div>
          <select
            className={selectCls}
            value={selectedUniversityName}
            onChange={(e) => setSelectedUniversityName(e.target.value)}
            disabled={loadingUniversitiesFilter}
          >
            {universityNameOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <GoBtn />
        </div>
      </div>
    );
  }

  if (activeTab === "Scholarship") {
    const scholarshipCountryOptions = [
      "Any",
      ...Array.from(
        new Set(scholarships.map((s) => String(s?.country || "").trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    ];

    const scholarshipNameOptions = [
      "Any",
      ...Array.from(
        new Set(scholarships.map((s) => String(s?.name || "").trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    ];

    const scholarshipLevelOptions = [
      "Any",
      ...Array.from(
        new Set(scholarships.map((s) => String(s?.level || "").trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    ];

    return (
      <div className="grid gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4">
          <div className={labelCls}>Country</div>
          <select
            className={selectCls}
            value={selectedScholarshipCountry}
            onChange={(e) => setSelectedScholarshipCountry(e.target.value)}
            disabled={loadingScholarshipsFilter}
          >
            {scholarshipCountryOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-5">
          <div className={labelCls}>Scholarship name</div>
          <select
            className={selectCls}
            value={selectedScholarshipName}
            onChange={(e) => setSelectedScholarshipName(e.target.value)}
            disabled={loadingScholarshipsFilter}
          >
            {scholarshipNameOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <div className={labelCls}>Level</div>
          <select
            className={selectCls}
            value={selectedScholarshipLevel}
            onChange={(e) => setSelectedScholarshipLevel(e.target.value)}
            disabled={loadingScholarshipsFilter}
          >
            {scholarshipLevelOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <GoBtn />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-12 md:items-end">
      <div className="md:col-span-5">
        <div className={labelCls}>Country</div>
        <select className={selectCls} defaultValue="UK">
          <option>UK</option>
          <option>USA</option>
          <option>Canada</option>
          <option>Australia</option>
          <option>Germany</option>
        </select>
      </div>

      <div className="md:col-span-5">
        <div className={labelCls}>Course / Keyword</div>
        <input className={inputCls} placeholder="e.g. Computer Science" />
      </div>

      <div className="md:col-span-1">
        <div className={labelCls}>Level</div>
        <select className={selectCls} defaultValue="Any">
          <option>Any</option>
          <option>Foundation</option>
          <option>Undergraduate</option>
          <option>Postgraduate</option>
          <option>PhD</option>
        </select>
      </div>

      <div className="md:col-span-1">
        <GoBtn />
      </div>
    </div>
  );
}

/* ===================== REST COMPONENTS ===================== */

function IconCard({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-black/10 p-6 bg-white hover:border-black/25 transition text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200">
      <div className="h-14 w-14 rounded-2xl bg-black text-white mx-auto flex items-center justify-center font-black text-lg shadow-sm shadow-black/20">
        {title[0]}
      </div>
      <div className="mt-4 font-black">{title}</div>
      <p className="text-black/60 text-sm mt-1">Explore programmes</p>
    </div>
  );
}

function SmallTile({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-black/10 bg-white p-6 text-center hover:border-black/25 transition block shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
    >
      <div className="font-black">{title}</div>
      <p className="text-black/60 text-sm mt-2">View details</p>
    </Link>
  );
}

function StatCard({ big, small }: { big: string; small: string }) {
  return (
    <div className="rounded-2xl border border-black/10 p-6 text-center hover:border-black/25 transition bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200">
      <div className="text-3xl font-black">{big}</div>
      <div className="text-black/60 mt-2">{small}</div>
    </div>
  );
}

function DynamicServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SERVICES);
        if (response.ok) {
          const data = await response.json();
          setServices(data.slice(0, 4)); // Show maximum 4 services
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="h-4 bg-black/10 rounded w-20 mb-4"></div>
            <div className="h-6 bg-black/10 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-black/10 rounded w-full mb-4"></div>
            <div className="h-4 bg-black/10 rounded w-24"></div>
          </div>
        ))}
      </>
    );
  }

  if (services.length === 0) {
    return (
      <>
        <Link href="/free-service" className="rounded-2xl border border-black/10 bg-white p-6 hover:border-black/25 transition text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200 block">
          <div className="h-14 w-14 rounded-2xl bg-black text-white mx-auto flex items-center justify-center font-black text-lg shadow-sm shadow-black/20">F</div>
          <div className="mt-4 font-black">Free Service</div>
          <p className="text-black/60 text-sm mt-1">Get started with our free consultation and guidance</p>
        </Link>
        <Link href="/premium" className="rounded-2xl border border-black/10 bg-white p-6 hover:border-black/25 transition text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200 block">
          <div className="h-14 w-14 rounded-2xl bg-black text-white mx-auto flex items-center justify-center font-black text-lg shadow-sm shadow-black/20">P</div>
          <div className="mt-4 font-black">Premium</div>
          <p className="text-black/60 text-sm mt-1">End-to-end premium support for your application</p>
        </Link>
      </>
    );
  }

  return services.map((service) => (
    <div key={service._id} className="rounded-2xl border border-black/10 bg-white p-6 hover:border-black/25 transition">
      <div className="inline-flex text-xs px-3 py-1 rounded-full border border-black/15 text-black/70 font-semibold">
        {service.tag}
      </div>
      <h3 className="text-lg font-black mt-4">{service.title}</h3>
      <p className="text-black/60 text-sm mt-2 line-clamp-3">
        {service.description}
      </p>
      {service.price && (
        <div className="mt-3 text-lg font-black text-black">
          ${service.price}
        </div>
      )}
      <Link
        href={`/services/${service._id}`}
        className="mt-5 inline-block text-sm font-semibold underline underline-offset-4"
      >
        View details
      </Link>
    </div>
  ));
}

function ServiceCard({
  title,
  tag,
  href,
}: {
  title: string;
  tag: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 hover:border-black/25 transition">
      <div className="inline-flex text-xs px-3 py-1 rounded-full border border-black/15 text-black/70 font-semibold">
        {tag}
      </div>
      <h3 className="text-lg font-black mt-4">{title}</h3>
      <p className="text-black/60 text-sm mt-2">
        Guided support with clear steps.
      </p>

      <Link
        href={href}
        className="mt-5 inline-block text-sm font-semibold underline underline-offset-4"
      >
        View details
      </Link>
    </div>
  );
}

function Quote({
  name,
  course,
  text,
}: {
  name: string;
  course: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-6 bg-neutral-50 hover:border-black/25 transition shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200">
      <p className="text-black">“{text}”</p>
      <div className="mt-4">
        <p className="font-black">{name}</p>
        <p className="text-sm text-black/60">{course}</p>
      </div>
    </div>
  );
}

function ListBox({ title }: { title: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = title === 'News' ? API_ENDPOINTS.NEWS : API_ENDPOINTS.EVENTS;
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setItems(data.slice(0, 3)); // Show only 3 latest items
        }
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [title]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const viewAllHref = title === 'News' ? '/news' : '/events';

  return (
    <div className="rounded-2xl border border-black/10 p-6 hover:border-black/25 transition bg-white shadow-sm hover:shadow-md duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black">{title}</h3>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold underline underline-offset-4"
        >
          View All
        </Link>
      </div>
      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="text-black/60">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-black/60">No {title.toLowerCase()} available</div>
        ) : (
          items.map((item, i) => (
            <div
              key={item._id || i}
              className="border-b border-black/10 pb-4 last:border-b-0 last:pb-0 hover:bg-black/[0.02] -mx-2 px-2 py-2 rounded-lg transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs text-black/50 font-semibold mb-1">
                    {formatDate(item.date)}
                  </div>
                  <div className="font-semibold text-black leading-tight">
                    {item.title}
                  </div>
                </div>
                {title === 'Events' && (
                  <div className="text-xs text-black/40 whitespace-nowrap">
                    {new Date(item.date) >= new Date() ? 'Upcoming' : 'Past'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BlogCard({
  title,
  description,
  image,
  href,
}: {
  title: string;
  description: string;
  image?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-black/10 overflow-hidden bg-white hover:border-black/25 transition block shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          className="h-44 w-full object-cover bg-neutral-200"
        />
      ) : (
        <div className="h-44 bg-neutral-200" />
      )}
      <div className="p-6">
        <h3 className="font-black leading-snug">{title}</h3>
        <p className="text-black/60 text-sm mt-2 line-clamp-3">{description}</p>
        <span className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
          Read more
        </span>
      </div>
    </Link>
  );
}

function StudyingAbroadSection() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.BLOGS, { cache: "no-store" as any });
        if (!res.ok) {
          setItems([]);
          return;
        }
        const data = await res.json();
        setItems(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-black tracking-tight">Studying Abroad</h2>
        <Link
          href="/blog"
          className="text-sm font-semibold underline underline-offset-4"
        >
          View All
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
        {loading ? (
          <div className="text-black/60">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-black/60">No blogs available</div>
        ) : (
          items.map((x) => (
            <BlogCard
              key={x._id}
              title={String(x.title || "")}
              description={String(x.excerpt || x.content || "")}
              image={x.image ? String(x.image) : undefined}
              href={`/blog/${x._id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="font-black">{title}</div>
      <ul className="mt-3 space-y-2 text-black/60">
        {items.map((x) => (
          <li key={x.href}>
            <Link className="hover:text-black" href={x.href}>
              {x.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
