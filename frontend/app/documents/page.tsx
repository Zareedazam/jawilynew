export default function DocumentsPage() {
  const docs = [
    { name: "Passport (front & back)", status: "Pending", note: "Clear photo / scan" },
    { name: "Academic Transcripts", status: "Uploaded", note: "Latest available" },
    { name: "Statement of Purpose (SOP)", status: "Pending", note: "PDF preferred" },
    { name: "English Test Result", status: "Pending", note: "IELTS/TOEFL/Duolingo" },
    { name: "Recommendation Letters", status: "Uploaded", note: "2 letters recommended" },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Documents
            </h1>
            <p className="mt-3 text-black/70 max-w-2xl">
              Upload required documents to speed up your application. (UI only)
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a
              href="/dashboard/applications"
              className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
            >
              My Applications
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
            >
              Back to Dashboard
            </a>
          </div>
        </div>

        {/* Upload box */}
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
            <h2 className="text-xl font-black">Upload files</h2>
            <p className="text-sm text-black/60 mt-2">
              Drag & drop supported. PDF/JPG/PNG. (UI only)
            </p>

            <div className="mt-6 rounded-2xl border border-dashed border-black/25 bg-neutral-50 p-10 text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center font-black">
                ↑
              </div>
              <p className="mt-4 font-black">Drop files here</p>
              <p className="text-sm text-black/60 mt-1">
                or choose a file to upload
              </p>

              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
                >
                  Choose File
                </button>
                <button
                  type="button"
                  className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
                >
                  Upload Later
                </button>
              </div>

              <p className="text-xs text-black/50 mt-4">
                *Real upload later connect hoga.
              </p>
            </div>

            {/* Tips */}
            <div className="mt-6 rounded-2xl border border-black/10 p-6">
              <h3 className="font-black">Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-black/70">
                <li>• Use clear scans. Avoid blur.</li>
                <li>• Name files properly (passport.pdf, transcript.pdf).</li>
                <li>• Upload SOP in PDF.</li>
              </ul>
            </div>
          </div>

          {/* Checklist */}
          <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
            <h2 className="text-xl font-black">Checklist</h2>
            <p className="text-sm text-black/60 mt-2">
              Track what’s done and what’s pending.
            </p>

            <div className="mt-6 space-y-3">
              {docs.map((d) => (
                <DocRow key={d.name} doc={d} />
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <p className="font-black">Completion</p>
              <p className="text-sm text-black/60 mt-1">
                2 / 5 uploaded
              </p>
              <div className="mt-3 h-2 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full w-[40%] bg-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-black/50">
          *UI only. Supabase/Backend connect karne ke baad real upload chalega.
        </p>
      </div>
    </div>
  );
}

function DocRow({
  doc,
}: {
  doc: { name: string; status: string; note: string };
}) {
  const isUploaded = doc.status === "Uploaded";

  return (
    <div className="rounded-xl border border-black/10 px-4 py-3 flex items-start justify-between gap-4">
      <div>
        <p className="font-semibold">{doc.name}</p>
        <p className="text-xs text-black/60 mt-1">{doc.note}</p>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            isUploaded
              ? "border-black/25 text-black"
              : "border-black/15 text-black/70"
          }`}
        >
          {doc.status}
        </span>

        <button
          type="button"
          className="px-3 py-2 rounded-full border border-black/15 text-xs font-semibold hover:border-black/30"
        >
          {isUploaded ? "Replace" : "Upload"}
        </button>
      </div>
    </div>
  );
}
