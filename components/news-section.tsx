"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User } from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  image?: string;
  status: string;
  published_at?: string;
  created_at: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function NewsSection() {
  const [news, setNews] = React.useState<NewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] =
    React.useState<NewsArticle | null>(null);

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/news/published?per_page=12");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.success) {
          let newsData: NewsArticle[] = [];
          if (result.data && typeof result.data === "object") {
            if (Array.isArray(result.data.data)) newsData = result.data.data;
            else if (Array.isArray(result.data)) newsData = result.data;
          }
          setNews(newsData);
        } else {
          throw new Error(result.message || "Failed to fetch news");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArticle(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = selectedArticle ? "hidden" : "unset";
  }, [selectedArticle]);

  return (
    <>
      <div className="py-16 px-4 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-3"
            style={{ background: "#E8F5E9", color: "#1A5C2A" }}
          >
            Community Updates
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: "#0F3A1A" }}
          >
            Latest News
          </h2>
          <p style={{ color: "#2E7D40" }}>
            Read the latest stories and updates from Verdant Acres
          </p>
        </div>

        {/* States */}
        {loading ? (
          <div className="text-center py-12">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: "#1A5C2A" }}
            />
            <p className="mt-4" style={{ color: "#2E7D40" }}>
              Loading news...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load news: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="font-semibold transition-colors"
              style={{ color: "#1A5C2A" }}
            >
              Try Again
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: "#2E7D40" }}>No news available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-2xl overflow-hidden shadow-md transition-all cursor-pointer border"
                style={{ borderColor: "#E8F5E9" }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 32px rgba(26,92,42,0.12)",
                }}
              >
                {/* Card Image */}
                <div
                  className="relative h-48 overflow-hidden"
                  style={{ background: "#E8F5E9" }}
                >
                  <img
                    src={
                      article.image
                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${article.image}`
                        : "/placeholder.svg"
                    }
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  {/* Category pill */}
                  <span
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(15,58,26,0.85)",
                      color: "#A8D5B5",
                    }}
                  >
                    {article.category}
                  </span>
                </div>

                <div className="p-5">
                  <p
                    className="text-xs mb-2 flex items-center gap-1"
                    style={{ color: "#4CAF6B" }}
                  >
                    <Calendar className="w-3 h-3" />
                    {new Date(
                      article.published_at || article.created_at,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3
                    className="text-base font-bold mb-2 line-clamp-2"
                    style={{ color: "#0F3A1A" }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-3"
                    style={{ color: "#2E7D40" }}
                  >
                    {article.content.substring(0, 150)}...
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                {selectedArticle.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${selectedArticle.image}`}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #1A5C2A, #4CAF6B)",
                    }}
                  >
                    <img
                      src="/image.png"
                      alt=""
                      className="w-32 h-32 object-contain opacity-30"
                    />
                  </div>
                )}
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg transition-colors"
                  style={{ color: "#0F3A1A" }}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8">
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                  style={{ background: "#E8F5E9", color: "#1A5C2A" }}
                >
                  {selectedArticle.category}
                </span>

                <h2
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ color: "#0F3A1A" }}
                >
                  {selectedArticle.title}
                </h2>

                {/* Meta */}
                <div
                  className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b text-sm"
                  style={{ color: "#2E7D40", borderColor: "#E8F5E9" }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="w-4 h-4"
                      style={{ color: "#4CAF6B" }}
                    />
                    <span>
                      {new Date(
                        selectedArticle.published_at ||
                          selectedArticle.created_at,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {selectedArticle.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" style={{ color: "#4CAF6B" }} />
                      <span>By {selectedArticle.author.name}</span>
                    </div>
                  )}
                </div>

                <div className="prose max-w-none">
                  <p
                    className="text-base leading-relaxed whitespace-pre-line"
                    style={{ color: "#1A5C2A" }}
                  >
                    {selectedArticle.content}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="px-6 md:px-8 py-4 border-t"
                style={{ background: "#F0F7F1", borderColor: "#C8E6C9" }}
              >
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                  style={{ background: "#1A5C2A" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "#2E7D40")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "#1A5C2A")
                  }
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
