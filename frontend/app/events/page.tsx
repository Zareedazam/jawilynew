"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface EventItem {
  _id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  time?: string;
  capacity?: number;
  image?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/events`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    return timeString;
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

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
              Upcoming Events
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-black">
              Events & Workshops
            </h1>
            <p className="mt-4 text-base md:text-lg text-black/70">
              Join our events, workshops, and information sessions to learn more about studying abroad.
            </p>
          </div>
        </div>
      </section>

      {/* EVENTS LIST */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        {loading ? (
          <div className="text-center py-14">
            <div className="text-black/60">Loading events...</div>
          </div>
        ) : error ? (
          <div className="text-center py-14">
            <div className="text-red-600">Error: {error}</div>
            <button
              onClick={fetchEvents}
              className="mt-4 px-6 py-2 rounded-full border border-black/15 hover:border-black/30 font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-14">
            <div className="text-black/60">No events scheduled at the moment.</div>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedEvents.map((event) => (
              <article
                key={event._id}
                className={`rounded-2xl border p-6 hover:border-black/25 transition ${
                  isUpcoming(event.date) 
                    ? "border-black/20 bg-white" 
                    : "border-black/5 bg-neutral-50 opacity-75"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {isUpcoming(event.date) && (
                        <span className="inline-flex text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                          Upcoming
                        </span>
                      )}
                      <span className="text-sm text-black/60">
                        {formatDate(event.date)}
                      </span>
                      {event.time && (
                        <span className="text-sm text-black/60">
                          at {formatTime(event.time)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-3">
                      {event.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-black/60 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {event.location}
                      </div>
                      {event.capacity && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          {event.capacity} seats
                        </div>
                      )}
                    </div>
                    <p className="text-black/70 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  {event.image && (
                    <div className="md:w-64 md:ml-6">
                      <div className="rounded-xl overflow-hidden bg-neutral-200 h-48 md:h-full">
                        <img
                          src={event.image}
                          alt={event.title}
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
