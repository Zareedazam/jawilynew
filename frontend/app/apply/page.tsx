"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_ENDPOINTS, API_URL } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ALL_COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. Swaziland)",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

type University = { name?: string; country?: string };
type Course = { title?: string; university?: string; level?: string };

export default function ApplyPage() {
  const router = useRouter();
  const apiUrl = useMemo(() => API_URL, []);

  const [user, setUser] = useState<any>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [nationality, setNationality] = useState("");
  const [typeOfStudy, setTypeOfStudy] = useState("");
  const [subjectInterested, setSubjectInterested] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [heardAbout, setHeardAbout] = useState("");
  const [livingInUk, setLivingInUk] = useState<"yes" | "no" | "">("");
  const [privacyConsent, setPrivacyConsent] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.push("/login");
        return;
      }

      const u = JSON.parse(raw);
      setUser(u);

      if (typeof u?.name === "string" && u.name.trim()) {
        const parts = u.name.trim().split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (typeof u?.email === "string") setEmail(u.email);
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.UNIVERSITIES, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setUniversities(arr);
        const set = new Set<string>();
        for (const u of arr) {
          const c = typeof u?.country === "string" ? u.country.trim() : "";
          if (c) set.add(c);
        }
        setCountryOptions(Array.from(set).sort((a, b) => a.localeCompare(b)));
      } catch {
        setCountryOptions([]);
        setUniversities([]);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.COURSES, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  const universityCountryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const u of universities) {
      const name = typeof u?.name === "string" ? u.name.trim().toLowerCase() : "";
      const c = typeof u?.country === "string" ? u.country.trim() : "";
      if (name && c) map.set(name, c);
    }
    return map;
  }, [universities]);

  const coursesInSelectedCountry = useMemo(() => {
    const selected = country.trim().toLowerCase();
    if (!selected) return [];

    return courses.filter((c) => {
      const uni = typeof c?.university === "string" ? c.university.trim().toLowerCase() : "";
      if (!uni) return false;
      const uniCountry = universityCountryMap.get(uni);
      return typeof uniCountry === "string" && uniCountry.trim().toLowerCase() === selected;
    });
  }, [courses, country, universityCountryMap]);

  const typeOfStudyOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of coursesInSelectedCountry) {
      const level = typeof c?.level === "string" ? c.level.trim() : "";
      if (level) set.add(level);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [coursesInSelectedCountry]);

  const subjectInterestedOptions = useMemo(() => {
    const set = new Set<string>();
    const typeQ = typeOfStudy.trim().toLowerCase();
    for (const c of coursesInSelectedCountry) {
      const level = typeof c?.level === "string" ? c.level.trim() : "";
      if (typeQ && level.toLowerCase() !== typeQ) continue;

      const title = typeof c?.title === "string" ? c.title.trim() : "";
      if (title) set.add(title);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [coursesInSelectedCountry, typeOfStudy]);

  useEffect(() => {
    setTypeOfStudy("");
    setSubjectInterested("");
  }, [country]);

  useEffect(() => {
    setSubjectInterested("");
  }, [typeOfStudy]);

  const isFormValid = useMemo(() => {
    return Boolean(
      firstName.trim() &&
        lastName.trim() &&
        phone.trim() &&
        email.trim() &&
        country.trim() &&
        nationality.trim() &&
        typeOfStudy.trim() &&
        yearOfStudy.trim() &&
        subjectInterested.trim() &&
        heardAbout.trim() &&
        livingInUk &&
        privacyConsent
    );
  }, [
    firstName,
    lastName,
    phone,
    email,
    country,
    nationality,
    typeOfStudy,
    yearOfStudy,
    subjectInterested,
    heardAbout,
    livingInUk,
    privacyConsent,
  ]);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      if (!isFormValid) {
        setError("Please fill required fields and accept privacy policy.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/form-submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          country,
          message,
          formType: "application",
          userId: user?.id || user?._id,
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        throw new Error(t || "Failed to submit");
      }

      setSuccess("Application submitted successfully.");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Book your Free Consultation
        </h1>
        <p className="mt-3 text-black/70 max-w-3xl">
          Our team will contact you within 24 hours to arrange your initial
          consultation with an education expert.
        </p>

        {/* Form Card */}
        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="First Name">
                <input
                  className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Field>

              <Field label="Family Name">
                <input
                  className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                  placeholder="Enter family name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Mobile Contact">
                <input
                  className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                  placeholder="e.g., +92 300 0000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Country">
                <select
                  className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">-- Please select --</option>
                  {countryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message (optional)">
                <input
                  className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
                  placeholder="Write message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Field>
            </div>

            {/* Row 3 (3 dropdowns) */}
            <div className="grid md:grid-cols-3 gap-5">
              <Field label="Nationality">
                <select
                  className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                >
                  <option value="">-- Please select --</option>
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Type of Study">
                <select
                  className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
                  value={typeOfStudy}
                  onChange={(e) => setTypeOfStudy(e.target.value)}
                  disabled={!country || typeOfStudyOptions.length === 0}
                >
                  <option value="">-- Please select --</option>
                  {typeOfStudyOptions.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Year of Study">
                <select
                  className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                >
                  <option value="">-- Please select --</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </Field>
            </div>

            {/* Row 4 (2 dropdowns) */}
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Subject Interested">
                <select
                  className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
                  value={subjectInterested}
                  onChange={(e) => setSubjectInterested(e.target.value)}
                  disabled={!country || subjectInterestedOptions.length === 0}
                >
                  <option value="">-- Please select --</option>
                  {subjectInterestedOptions.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Where did you hear about Jawily?">
                <select
                  className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30"
                  value={heardAbout}
                  onChange={(e) => setHeardAbout(e.target.value)}
                >
                  <option value="">-- Please select --</option>
                  <option value="Google">Google</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Friend / Referral">Friend / Referral</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>

            {/* Radio */}
            <div>
              <p className="text-sm font-semibold text-black/80">
                Are you currently living in the UK?
              </p>
              <div className="mt-3 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="inuk"
                    className="h-4 w-4"
                    value="yes"
                    checked={livingInUk === "yes"}
                    onChange={() => setLivingInUk("yes")}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="inuk"
                    className="h-4 w-4"
                    value="no"
                    checked={livingInUk === "no"}
                    onChange={() => setLivingInUk("no")}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
              />
              <p className="text-sm text-black/70 leading-relaxed">
                I consent to receive digital communications regarding university
                application services. I understand I may change preferences or opt
                out anytime. <span className="underline">View Privacy Policy</span>.
              </p>
            </div>

            {/* Submit Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <div className="text-xs text-black/50">
                {error && <div className="text-red-600">{error}</div>}
                {success && <div className="text-emerald-700">{success}</div>}
              </div>

              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="w-full sm:w-auto px-10 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Optional small note */}
        <p className="mt-6 text-xs text-black/50">
          By submitting, you agree to our terms and privacy policy.
        </p>
      </div>
      </div>
      <Footer />
    </>
  );
}

/* Small helper */
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
