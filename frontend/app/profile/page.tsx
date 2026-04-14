export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Profile & Settings
            </h1>
            <p className="mt-3 text-black/70 max-w-2xl">
              Update your details and preferences. (UI only)
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a
              href="/dashboard"
              className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
            >
              Go to Dashboard
            </a>
            <a
              href="/"
              className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
            >
              Back to Home
            </a>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* Left: Profile card */}
          <div className="rounded-2xl border border-black/10 p-6 bg-white">
            <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl">
              J
            </div>

            <h2 className="mt-4 text-xl font-black">Student Name</h2>
            <p className="text-sm text-black/60 mt-1">student@email.com</p>

            <div className="mt-6 space-y-3 text-sm">
              <InfoRow label="Phone" value="+92 300 0000000" />
              <InfoRow label="Country" value="Pakistan" />
              <InfoRow label="Preferred" value="UK / Canada" />
            </div>

            <button className="mt-6 w-full px-5 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30">
              Upload Photo (later)
            </button>
          </div>

          {/* Right: Settings forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal info */}
            <Section title="Personal Information" desc="Keep your profile updated.">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input
                    className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                    placeholder="Student Name"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                    placeholder="student@email.com"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                    placeholder="+92 300 0000000"
                  />
                </Field>
                <Field label="Nationality">
                  <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
                    <option>Pakistan</option>
                    <option>India</option>
                    <option>UAE</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>

              <div className="mt-6 flex gap-3 flex-wrap">
                <button className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90">
                  Save Changes
                </button>
                <button className="px-8 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30">
                  Cancel
                </button>
              </div>
            </Section>

            {/* Study preferences */}
            <Section title="Study Preferences" desc="These help us shortlist better.">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Preferred Country">
                  <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
                    <option>UK</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>USA</option>
                  </select>
                </Field>

                <Field label="Study Level">
                  <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
                    <option>Masters</option>
                    <option>Bachelors</option>
                    <option>PhD</option>
                  </select>
                </Field>

                <Field label="Subject Interest">
                  <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
                    <option>Business</option>
                    <option>Engineering</option>
                    <option>Computer Science</option>
                    <option>Law</option>
                    <option>Health</option>
                  </select>
                </Field>

                <Field label="Intake Year">
                  <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                  </select>
                </Field>
              </div>

              <div className="mt-6 flex gap-3 flex-wrap">
                <button className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90">
                  Update Preferences
                </button>
              </div>
            </Section>

            {/* Password */}
            <Section title="Security" desc="Change password anytime.">
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Current Password">
                  <input
                    type="password"
                    className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                    placeholder="••••••••"
                  />
                </Field>
                <Field label="New Password">
                  <input
                    type="password"
                    className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                    placeholder="••••••••"
                  />
                </Field>
                <Field label="Confirm Password">
                  <input
                    type="password"
                    className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                    placeholder="••••••••"
                  />
                </Field>
              </div>

              <div className="mt-6 flex gap-3 flex-wrap">
                <button className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90">
                  Change Password
                </button>
              </div>
            </Section>

            {/* Notifications */}
            <Section title="Notifications" desc="Choose what you want to receive.">
              <div className="space-y-3">
                <ToggleRow label="Email updates" />
                <ToggleRow label="WhatsApp updates" />
                <ToggleRow label="Scholarship alerts" />
              </div>

              <div className="mt-6 flex gap-3 flex-wrap">
                <button className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90">
                  Save Notifications
                </button>
              </div>
            </Section>

            {/* Danger */}
            <div className="rounded-2xl border border-black/10 p-6 bg-white">
              <h3 className="text-lg font-black">Danger zone</h3>
              <p className="text-sm text-black/60 mt-2">
                These actions are irreversible. (UI only)
              </p>

              <div className="mt-5 flex gap-3 flex-wrap">
                <button className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30">
                  Logout
                </button>
                <button className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-black/50">
          *Backend/auth later connect hoga.
        </p>
      </div>
    </div>
  );
}

/* components */

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 p-6 bg-white">
      <h2 className="text-xl font-black tracking-tight">{title}</h2>
      <p className="text-sm text-black/60 mt-2">{desc}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black/80 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-black/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function ToggleRow({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-black/10 px-4 py-3">
      <span className="text-sm font-semibold text-black/80">{label}</span>
      <input type="checkbox" className="h-5 w-5" />
    </label>
  );
}
