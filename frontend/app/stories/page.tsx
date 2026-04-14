export default function StoriesPage() {
  const stories = [
    {
      name: "Ayesha",
      country: "UK",
      course: "MBA",
      result: "Offer received in 3 weeks",
      text: "Jawily helped me shortlist universities fast and made my application clean.",
    },
    {
      name: "Rahul",
      country: "Canada",
      course: "Engineering",
      result: "Scholarship shortlisted",
      text: "Document checklist and timeline tracking saved a lot of time.",
    },
    {
      name: "Sara",
      country: "Australia",
      course: "Masters",
      result: "Visa guidance completed",
      text: "Step-by-step process felt premium and easy. No confusion at all.",
    },
    {
      name: "Hassan",
      country: "UK",
      course: "Computer Science",
      result: "Shortlist in 2 days",
      text: "Counsellor guidance was clear and practical. Very smooth journey.",
    },
    {
      name: "Neha",
      country: "USA",
      course: "Data Science",
      result: "Offer + funding options",
      text: "SOP review and profile strategy really helped me stand out.",
    },
    {
      name: "Bilal",
      country: "Canada",
      course: "Public Health",
      result: "Application submitted",
      text: "Everything is organized. You always know what’s next.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Student Stories
            </h1>
            <p className="mt-3 text-black/70 max-w-2xl">
              Real journeys. Clear outcomes. Simple process.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a
              href="/apply"
              className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
            >
              Share Your Story
            </a>
            <a
              href="/"
              className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Filter strip (UI) */}
        <div className="mt-10 rounded-2xl border border-black/10 p-5 md:p-6">
          <div className="grid md:grid-cols-4 gap-3">
            <input
              className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
              placeholder="Search name/course"
            />

            <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
              <option>Country</option>
              <option>UK</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>USA</option>
            </select>

            <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
              <option>Level</option>
              <option>Bachelors</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>

            <button className="w-full rounded-xl bg-black text-white font-semibold py-3 hover:opacity-90">
              Apply Filters
            </button>
          </div>

          <p className="text-xs text-black/50 mt-3">
            *UI only. Backend filters later.
          </p>
        </div>

        {/* Stories grid */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => (
            <StoryCard key={s.name + s.course} story={s} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-black/10 bg-neutral-50 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Want a story like this?
            </h2>
            <p className="text-black/70 mt-2">
              Book a free consultation and get a step-by-step roadmap.
            </p>
          </div>
          <a
            href="/apply"
            className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
          >
            Book Free Consultation
          </a>
        </div>
      </div>
    </div>
  );
}

function StoryCard({
  story,
}: {
  story: {
    name: string;
    country: string;
    course: string;
    result: string;
    text: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 hover:border-black/25 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight">{story.name}</h3>
          <p className="text-sm text-black/60 mt-1">
            {story.course} • {story.country}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold border border-black/15 text-black/70">
          {story.result}
        </span>
      </div>

      <p className="mt-4 text-black/70 leading-relaxed">
        “{story.text}”
      </p>

      <div className="mt-5 flex gap-2 flex-wrap">
        <a
          href="/apply"
          className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90"
        >
          Apply
        </a>
        <button className="px-4 py-2 rounded-full border border-black/15 text-sm font-semibold hover:border-black/30">
          View Profile
        </button>
      </div>
    </div>
  );
}
