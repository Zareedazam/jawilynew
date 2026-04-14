"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:opacity-70 transition"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-black border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4 text-sm font-medium text-white">
            <Link 
              className="hover:opacity-70 transition" 
              href="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              className="hover:opacity-70 transition" 
              href="/universities"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Universities
            </Link>
            <Link 
              className="hover:opacity-70 transition" 
              href="/accommodation"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accommodation
            </Link>
            <Link
              className="hover:opacity-70 transition"
              href="/education-loans"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Education Loans
            </Link>
            <Link 
              className="hover:opacity-70 transition" 
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              className="hover:opacity-70 transition" 
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
