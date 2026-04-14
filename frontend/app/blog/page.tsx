"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "../../lib/api";

type BlogItem = {
  _id: string;
  title?: string;
  category?: string;
  date?: string;
  excerpt?: string;
  content?: string;
  image?: string;
};

export default function BlogPage() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.BLOGS, { cache: "no-store" as any });
        const data = res.ok ? await res.json() : [];
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Blog & News
            </h1>
            <p className="mt-3 text-black/70 max-w-2xl">
              Short, practical guides to help you decide faster.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a
              href="/apply"
              className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90"
            >
              Book Consultation
            </a>
            <a
              href="/"
              className="px-6 py-3 rounded-full border border-black/15 font-semibold hover:border-black/30"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Filters (UI) */}
        <div className="mt-10 rounded-2xl border border-black/10 p-5 md:p-6">
          <div className="grid md:grid-cols-4 gap-3">
            <input
              className="w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black/30"
              placeholder="Search articles"
            />

            <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
              <option>Category</option>
              <option>Guide</option>
              <option>Universities</option>
              <option>Scholarship</option>
              <option>Visa</option>
              <option>SOP</option>
              <option>English Test</option>
            </select>

            <select className="w-full rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-black/30">
              <option>Sort</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Popular</option>
            </select>

            <button className="w-full rounded-xl bg-black text-white font-semibold py-3 hover:opacity-90">
              Apply
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="text-black/60">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-black/60">No blogs available</div>
          ) : (
            items.map((p) => <PostCard key={p._id} post={p} />)
          )}
        </div>

        {/* Pagination UI */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <button className="px-4 py-2 rounded-full border border-black/15 font-semibold hover:border-black/30">
            Prev
          </button>
          <button className="px-4 py-2 rounded-full bg-black text-white font-semibold">
            1
          </button>
          <button className="px-4 py-2 rounded-full border border-black/15 font-semibold hover:border-black/30">
            2
          </button>
          <button className="px-4 py-2 rounded-full border border-black/15 font-semibold hover:border-black/30">
            3
          </button>
          <button className="px-4 py-2 rounded-full border border-black/15 font-semibold hover:border-black/30">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function PostCard({
  post,
}: {
  post: BlogItem;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white overflow-hidden hover:border-black/25 transition">
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt={String(post.title || "")}
          className="h-40 w-full object-cover bg-neutral-200"
        />
      ) : (
        <div className="h-40 bg-neutral-200" />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-black/50">
            {post.date ? new Date(post.date).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : ""}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border border-black/15 text-black/70">
            {String(post.category || "")}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-black tracking-tight">
          {String(post.title || "")}
        </h3>

        <p className="mt-2 text-sm text-black/70 leading-relaxed">
          {String(post.excerpt || post.content || "")}
        </p>

        <div className="mt-5 flex gap-2 flex-wrap">
          <Link
            href={`/blog/${post._id}`}
            className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90"
          >
            Read
          </Link>
          <button className="px-4 py-2 rounded-full border border-black/15 text-sm font-semibold hover:border-black/30">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
