"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { 
  FiLogOut, 
  FiUser, 
  FiMail, 
  FiHash, 
  FiFileText, 
  FiPlus, 
  FiClock,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader
} from "react-icons/fi";
import { API_URL } from "../../lib/api";

type Submission = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  message?: string;
  formType: string;
  applicationStatus?: string;
  createdAt: string;
};

type Purchase = {
  _id: string;
  purchaserName?: string;
  planName: string;
  planId: string;
  amount: number;
  currency?: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const apiUrl = useMemo(() => API_URL, []);
  const [user, setUser] = useState<any>(null);
  const [apps, setApps] = useState<Submission[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState<string | null>(null);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [purchasesError, setPurchasesError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.push("/login");
        return;
      }
      const u = JSON.parse(raw);
      setUser(u);
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const userId = user?.id || user?._id;
      if (!userId) return;

      try {
        setLoadingApps(true);
        setAppsError(null);
        const response = await fetch(
          `${apiUrl}/api/form-submissions?userId=${encodeURIComponent(String(userId))}`
        );
        if (!response.ok) throw new Error("Failed to load applications");
        const data = await response.json();
        setApps(Array.isArray(data) ? data : []);
      } catch (e) {
        setAppsError(e instanceof Error ? e.message : "Failed to load applications");
      } finally {
        setLoadingApps(false);
      }
    };

    load();
  }, [apiUrl, user]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const userId = user?.id || user?._id;
      if (!userId) return;

      try {
        setLoadingPurchases(true);
        setPurchasesError(null);
        const response = await fetch(
          `${apiUrl}/api/payments/purchases?userId=${encodeURIComponent(String(userId))}`
        );
        if (!response.ok) throw new Error("Failed to load purchases");
        const data = await response.json();
        setPurchases(Array.isArray(data) ? data : []);
      } catch (e) {
        setPurchasesError(e instanceof Error ? e.message : "Failed to load purchases");
        setPurchases([]);
      } finally {
        setLoadingPurchases(false);
      }
    };

    load();
  }, [apiUrl, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getStatusColor = (status: string = "Submitted") => {
    const colors: Record<string, string> = {
      "Submitted": "bg-blue-50 text-blue-700 border-blue-200",
      "Under Review": "bg-yellow-50 text-yellow-700 border-yellow-200",
      "Approved": "bg-green-50 text-green-700 border-green-200",
      "Rejected": "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-neutral-50 text-black/70 border-black/10";
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div className="relative">
              <h1 className="text-5xl font-black bg-gradient-to-r from-black to-neutral-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-black/60 mt-2 text-lg flex items-center gap-2">
                <FiFileText className="inline" />
                Track your application progress
              </p>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-black/5 rounded-full blur-3xl -z-10" />
            </div>
            
            <button
              onClick={handleLogout}
              className="group px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FiLogOut className="group-hover:translate-x-1 transition-transform" />
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard 
              icon={<FiFileText />}
              title="Total Submissions" 
              value={apps.length.toString()} 
              trend={apps.length > 0 ? "+ Active" : "No submissions"}
            />
            <StatCard 
              icon={<FiCheckCircle />}
              title="Pending Review" 
              value={apps.filter(a => a.applicationStatus === "Submitted" || !a.applicationStatus).length.toString()}
              trend="Awaiting feedback"
            />
            <StatCard 
              icon={<FiClock />}
              title="Latest Activity" 
              value={apps.length > 0 ? new Date(apps[0].createdAt).toLocaleDateString() : "—"}
              trend="Most recent submission"
            />
          </div>

          {/* Profile Section */}
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent rounded-3xl" />
            <div className="relative bg-white/80 backdrop-blur-sm border border-black/15 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-black rounded-xl text-white">
                  <FiUser className="text-xl" />
                </div>
                <h2 className="text-2xl font-black">Profile Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProfileCard 
                  icon={<FiUser />}
                  label="Full Name"
                  value={user?.name || "—"}
                />
                <ProfileCard 
                  icon={<FiMail />}
                  label="Email Address"
                  value={user?.email || "—"}
                />
                <ProfileCard 
                  icon={<FiHash />}
                  label="User ID"
                  value={user?.id || user?._id || "—"}
                />
              </div>
            </div>
          </div>

          {/* Purchases */}
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent rounded-3xl" />
            <div className="relative bg-white/80 backdrop-blur-sm border border-black/15 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-black rounded-xl text-white">
                  <FiCheckCircle className="text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Purchased Plans</h2>
                  <p className="text-black/60 text-sm mt-1">Your premium plan purchases</p>
                </div>
              </div>

              {purchasesError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 flex items-center gap-3">
                  <FiAlertCircle className="text-xl flex-shrink-0" />
                  <p>{purchasesError}</p>
                </div>
              )}

              {loadingPurchases ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <FiLoader className="text-3xl text-black/40 animate-spin mb-3" />
                  <p className="text-black/60">Loading purchases...</p>
                </div>
              ) : purchases.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-neutral-50 p-6">
                  <div className="text-sm font-semibold">No purchases yet</div>
                  <div className="mt-1 text-sm text-black/70">Buy a plan from the Premium page to see it here.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchases.map((p) => (
                    <div key={p._id} className="rounded-2xl border border-black/10 bg-white p-6">
                      <div className="text-xs text-black/50 font-semibold">Plan</div>
                      <div className="mt-1 text-lg font-black">{p.planName}</div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-neutral-50 border border-black/5 p-4">
                          <div className="text-xs text-black/40 font-semibold">Purchased By</div>
                          <div className="mt-1 font-semibold break-words">{p.purchaserName || user?.name || "—"}</div>
                        </div>
                        <div className="rounded-xl bg-neutral-50 border border-black/5 p-4">
                          <div className="text-xs text-black/40 font-semibold">Purchased On</div>
                          <div className="mt-1 font-semibold">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submissions Section */}
          <div className="relative">
            <div className="absolute -right-4 top-0 w-72 h-72 bg-black/5 rounded-full blur-3xl" />
            
            <div className="relative bg-white/80 backdrop-blur-sm border border-black/15 rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-black rounded-xl text-white">
                    <FiFileText className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">My Submissions</h2>
                    <p className="text-black/60 text-sm mt-1">
                      You have {apps.length} submission{apps.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <a
                  href="/apply"
                  className="group px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FiPlus className="group-hover:rotate-90 transition-transform" />
                  New Submission
                </a>
              </div>

              {appsError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 flex items-center gap-3">
                  <FiAlertCircle className="text-xl flex-shrink-0" />
                  <p>{appsError}</p>
                </div>
              )}

              {loadingApps ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FiLoader className="text-4xl text-black/40 animate-spin mb-4" />
                  <p className="text-black/60">Loading your submissions...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apps.map((a, index) => (
                    <a
                      key={a._id}
                      href={`/submissions/${a._id}`}
                      className="group block rounded-2xl border border-black/10 bg-gradient-to-r from-white to-neutral-50/50 p-6 hover:border-black/30 hover:shadow-xl transition-all duration-300"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-xl font-bold flex items-center gap-2">
                                {a.firstName} {a.lastName}
                                <span className="text-sm font-normal text-black/50 flex items-center gap-1">
                                  <FiMapPin className="text-xs" />
                                  {a.country}
                                </span>
                              </h3>
                              <p className="text-sm text-black/60 flex items-center gap-2 mt-1">
                                <FiMail className="text-xs" />
                                {a.email}
                                <span className="w-1 h-1 bg-black/30 rounded-full" />
                                <FiPhone className="text-xs" />
                                {a.phone}
                              </p>
                            </div>
                            <div className="text-xs text-black/40 flex items-center gap-1 bg-black/5 px-3 py-1.5 rounded-full">
                              <FiClock />
                              {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="px-3 py-1.5 bg-black/5 rounded-lg text-xs font-semibold flex items-center gap-1">
                              <FiFileText className="text-xs" />
                              {a.formType || "Form"}
                            </span>
                            
                            {a.formType === "application" && (
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 ${getStatusColor(a.applicationStatus)}`}>
                                {a.applicationStatus === "Approved" && <FiCheckCircle />}
                                {a.applicationStatus === "Rejected" && <FiAlertCircle />}
                                {(!a.applicationStatus || a.applicationStatus === "Submitted") && <FiClock />}
                                {a.applicationStatus || "Submitted"}
                              </span>
                            )}
                          </div>

                          {a.message && (
                            <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-black/5 flex items-start gap-3">
                              <FiMessageSquare className="text-black/40 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-black/70 line-clamp-2">{a.message}</p>
                            </div>
                          )}
                        </div>

                        <div className="lg:self-center">
                          <div className="text-black/40 group-hover:text-black transition-colors text-sm font-medium flex items-center gap-1">
                            View Details
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}

                  {apps.length === 0 && (
                    <div className="text-center py-16 px-4">
                      <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiFileText className="text-3xl text-black/30" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No submissions yet</h3>
                      <p className="text-black/60 mb-6">Ready to start your journey? Create your first submission.</p>
                      <a
                        href="/apply"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-300"
                      >
                        <FiPlus />
                        Create Submission
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <Footer />
    </>
  );
}

function StatCard({ icon, title, value, trend }: { icon: React.ReactNode; title: string; value: string; trend: string }) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-black/15 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-black/5 rounded-lg text-black">
            {icon}
          </div>
          <span className="text-xs text-black/40">{trend}</span>
        </div>
        <p className="text-sm text-black/60">{title}</p>
        <p className="text-3xl font-black mt-1">{value}</p>
      </div>
    </div>
  );
}

function ProfileCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="group relative bg-neutral-50 border border-black/10 rounded-xl p-5 hover:border-black/30 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-black/5 rounded-lg text-black group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-xs text-black/40 mb-1">{label}</p>
          <p className="font-semibold text-sm break-all">{value}</p>
        </div>
      </div>
    </div>
  );
}