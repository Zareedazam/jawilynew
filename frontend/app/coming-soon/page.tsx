import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ComingSoonPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center px-6 py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/5 mb-6">
            <svg className="w-10 h-10 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Coming Soon</h1>
          <p className="mt-4 text-black/60 text-lg max-w-md mx-auto">
            We're working hard on this page. It will be available soon. Stay tuned!
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
