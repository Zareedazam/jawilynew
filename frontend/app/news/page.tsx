"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface NewsItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content?: string;
  author?: string;
  image?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/news`);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          </nav>

          <Link
            href="/"
            className="text-sm text-white hover:opacity-70 transition"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.06),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(0,0,0,0.04),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-semibold text-black">
              Latest Updates
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-black">
              News & Updates
            </h1>
            <p className="mt-4 text-base md:text-lg text-black/70">
              Stay informed with the latest news, announcements, and updates from Jawily.
            </p>
          </div>
        </div>
      </section>

      {/* NEWS LIST */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        {loading ? (
          <div className="text-center py-14">
            <div className="text-black/60">Loading news...</div>
          </div>
        ) : error ? (
          <div className="text-center py-14">
            <div className="text-red-600">Error: {error}</div>
            <button
              onClick={fetchNews}
              className="mt-4 px-6 py-2 rounded-full border border-black/15 hover:border-black/30 font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-14">
            <div className="text-black/60">No news available at the moment.</div>
          </div>
        ) : (
          <div className="space-y-8">
            {news.map((item) => (
              <article
                key={item._id}
                className="rounded-2xl border border-black/10 p-6 hover:border-black/25 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-sm text-black/60 mb-2">
                      <span className="inline-flex text-xs px-3 py-1 rounded-full border border-black/15 text-black/70 font-semibold">
                        {item.category}
                      </span>
                      <span>{formatDate(item.date)}</span>
                      {item.author && <span>By {item.author}</span>}
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-3">
                      {item.title}
                    </h2>
                    <p className="text-black/70 leading-relaxed mb-4">
                      {item.excerpt}
                    </p>
                    {item.content && (
                      <div className="text-black/60 leading-relaxed">
                        {item.content.length > 300 
                          ? `${item.content.substring(0, 300)}...` 
                          : item.content}
                      </div>
                    )}
                  </div>
                  {item.image && (
                    <div className="md:w-64 md:ml-6">
                      <div className="rounded-xl overflow-hidden bg-neutral-200 h-48 md:h-full">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-full border border-black/15 hover:border-black/30 font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
