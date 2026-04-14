export default function ApplicationsPage() {
  const apps = [
    {
      id: "APP-1024",
      course: "MBA",
      university: "University of London",
      country: "UK",
      status: "Under Review",
      updated: "5 Aug",
    },
    {
      id: "APP-1031",
      course: "Computer Science",
      university: "University of Toronto",
      country: "Canada",
      status: "Documents Pending",
      updated: "2 Aug",
    },
    {
      id: "APP-1040",
      course: "Data Science",
      university: "University of Melbourne",
      country: "Australia",
      status: "Submitted",
      updated: "29 Jul",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              My Applications
            </h1>
            <p className="mt-3 text-black/70 max-w-2xl">
              Track all your applications in one place. (UI only)
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a
              href="/apply"
              className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
            >
              New Application
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
            >
              Back to Dashboard
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-10 rounded-2xl border border-black/10 p-5 md:p-6">
          <div className="grid md:grid-cols-4 gap-3">
            <input
              className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
              placeholder="Search by course/university"
            />

            <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
              <option>Status</option>
              <option>Submitted</option>
              <option>Under Review</option>
              <option>Documents Pending</option>
              <option>Offer Received</option>
              <option>Rejected</option>
            </select>

            <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
              <option>Country</option>
              <option>UK</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>USA</option>
            </select>

            <button className="w-full rounded-xl bg-black text-white font-semibold py-3 hover:opacity-90">
              Apply
            </button>
          </div>

          <p className="text-xs text-black/50 mt-3">
            *Filters later connect honge.
          </p>
        </div>

        {/* Table */}
        <div className="mt-8 rounded-2xl border border-black/10 overflow-hidden">
          <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between">
            <p className="font-black">Applications</p>
            <p className="text-sm text-black/60">
              Total: <span className="font-semibold text-black">{apps.length}</span>
            </p>
          </div>

          <div className="overflow-x-auto bg-white">
            <table className="min-w-full text-sm">
              <thead className="border-b border-black/10 text-black/60">
                <tr>
                  <th className="text-left font-semibold px-6 py-4">App ID</th>
                  <th className="text-left font-semibold px-6 py-4">Course</th>
                  <th className="text-left font-semibold px-6 py-4">University</th>
                  <th className="text-left font-semibold px-6 py-4">Country</th>
                  <th className="text-left font-semibold px-6 py-4">Status</th>
                  <th className="text-left font-semibold px-6 py-4">Updated</th>
                  <th className="text-right font-semibold px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} className="border-b border-black/10 last:border-b-0">
                    <td className="px-6 py-4 font-semibold">{a.id}</td>
                    <td className="px-6 py-4">{a.course}</td>
                    <td className="px-6 py-4">{a.university}</td>
                    <td className="px-6 py-4">{a.country}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={a.status} />
                    </td>
                    <td className="px-6 py-4 text-black/60">{a.updated}</td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href="/dashboard"
                        className="px-4 py-2 rounded-full border border-black/15 font-semibold hover:border-black/30"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-black/50">
          *UI only. Real data later connect hoga.
        </p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const base =
    "inline-flex px-3 py-1 rounded-full text-xs font-semibold border";

  const style =
    status === "Submitted"
      ? "border-black/15 text-black/80"
      : status === "Under Review"
      ? "border-black/25 text-black"
      : status === "Documents Pending"
      ? "border-black/15 text-black/80"
      : "border-black/15 text-black/80";

  return <span className={`${base} ${style}`}>{status}</span>;
}
