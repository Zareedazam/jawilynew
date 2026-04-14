"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "../../../lib/api";

type BlogItem = {
  _id: string;
  title?: string;
  category?: string;
  date?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: string;
};

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [item, setItem] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_ENDPOINTS.BLOGS}/${id}`, { cache: "no-store" as any });
        if (!res.ok) {
          setError(`Failed to load blog (HTTP ${res.status})`);
          setItem(null);
          return;
        }

        const data = await res.json();
        setItem(data && typeof data === "object" ? data : null);
      } catch (e: any) {
        setError(e?.message || "Failed to load blog");
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="text-sm font-semibold underline underline-offset-4"
          >
            Back to Blogs
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 text-black/60">Loading...</div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-black/10 bg-neutral-50 p-6 text-black/70">
            {error}
          </div>
        ) : !item ? (
          <div className="mt-10 text-black/60">Blog not found</div>
        ) : (
          <article className="mt-10">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={String(item.title || "")}
                className="w-full rounded-2xl border border-black/10 object-cover bg-neutral-200"
              />
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {item.category ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold border border-black/15 text-black/70">
                  {String(item.category)}
                </span>
              ) : null}
              {item.date ? (
                <span className="text-xs font-semibold text-black/50">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
              {String(item.title || "")}
            </h1>

            {item.excerpt ? (
              <p className="mt-4 text-black/70 leading-relaxed">
                {String(item.excerpt)}
              </p>
            ) : null}

            {item.content ? (
              <div className="mt-6 whitespace-pre-wrap text-black/80 leading-relaxed">
                {String(item.content)}
              </div>
            ) : null}
          </article>
        )}
      </div>
    </div>
  );
}
