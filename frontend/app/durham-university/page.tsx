import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Durham University – Rankings, Alumni, Scholarships & Careers",
  description:
    "Explore Durham University: global and UK rankings, notable alumni, top recruiters, scholarships and key information for international students.",
};

type KV = { label: string; value: string };

export default function DurhamUniversityPage() {
  /* ================= DATA ================= */

  const overview =
    "Durham University is a prestigious public research university in the United Kingdom and a member of the Russell Group. It is internationally recognised for academic excellence, a strong collegiate tradition, and excellent graduate outcomes.";

  const institutionDetails: KV[] = [
    { label: "Location", value: "Durham, England" },
    { label: "Established", value: "1832" },
    { label: "University Type", value: "Public Research University" },
    { label: "International Students", value: "~30%" },
    { label: "Famous For", value: "Law, Business, Engineering" },
  ];

  const rankings = [
    { body: "QS World University Rankings", rank: "94th", type: "Global" },
    { body: "Times Higher Education (THE)", rank: "175th", type: "Global" },
    { body: "The Guardian University Guide", rank: "5th", type: "UK" },
    { body: "The Complete University Guide", rank: "3rd", type: "UK" },
  ];

  const notableAlumni = [
    { name: "Tim Smit", role: "Founder of the Eden Project" },
    { name: "David Sproxton", role: "Co-founder of Aardman Animations" },
    { name: "Andrew Strauss", role: "Former England Cricketer" },
    { name: "Justin Welby", role: "Archbishop of Canterbury" },
    { name: "Sir George Malcolm Brown", role: "Renowned Geologist" },
  ];

  const topRecruiters = [
    "Deloitte",
    "PwC",
    "EY",
    "KPMG",
    "Amazon",
    "Google",
    "Barclays",
    "HSBC",
  ];

  const scholarships = [
    {
      name: "Merit-Based Scholarships",
      value: "Partial tuition fee reduction",
    },
    {
      name: "International Excellence Scholarships",
      value: "Competitive awards for high-achieving students",
    },
    {
      name: "Departmental Scholarships",
      value: "Subject-specific financial support",
    },
    {
      name: "Country-Specific Awards",
      value: "Limited scholarships for selected countries",
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-xs tracking-widest text-black/50 font-semibold">
              UNIVERSITY PROFILE
            </p>
            <h1 className="text-3xl md:text-4xl font-black mt-2">
              Durham University
            </h1>
            <p className="text-black/70 mt-2">
              Durham, England • United Kingdom
            </p>
          </div>

          <a
            href="/apply"
            className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
          >
            Get Free Counselling
          </a>
        </div>

        {/* Layout */}
        <div className="mt-10 grid lg:grid-cols-12 gap-6 items-start">
          {/* Main */}
          <div className="lg:col-span-8 space-y-6">
            <SectionCard title="Overview">
              <p className="text-black/75 leading-relaxed">{overview}</p>
            </SectionCard>

            <SectionCard title="Global & UK Rankings">
              <Table
                head={["Ranking Body", "Rank", "Type"]}
                rows={rankings.map((r) => [r.body, r.rank, r.type])}
              />
            </SectionCard>

            <SectionCard title="Notable Alumni">
              <Table
                head={["Alumni Name", "Known For"]}
                rows={notableAlumni.map((a) => [a.name, a.role])}
              />
            </SectionCard>

            <SectionCard title="Scholarships">
              <Table
                head={["Scholarship", "Details"]}
                rows={scholarships.map((s) => [s.name, s.value])}
              />
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <SidebarCard title="Institution Details">
              <KeyValue rows={institutionDetails} />
              <a
                href="/apply"
                className="mt-4 block w-full px-4 py-3 rounded-xl bg-black text-white text-sm font-semibold text-center hover:opacity-90"
              >
                Book Consultation
              </a>
            </SidebarCard>

            <SidebarCard title="Top Recruiters">
              <div className="flex flex-wrap gap-2">
                {topRecruiters.map((r) => (
                  <span
                    key={r}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-black/15"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </SidebarCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-6">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-6">
      <h3 className="text-base font-black">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function KeyValue({ rows }: { rows: KV[] }) {
  return (
    <dl className="space-y-3">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-4">
          <dt className="text-sm font-semibold text-black/70">{r.label}</dt>
          <dd className="text-sm font-semibold text-black">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Table({
  head,
  rows,
}: {
  head: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50">
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 font-semibold text-black/70"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-black/10">
              {r.map((c) => (
                <td key={c} className="px-4 py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
