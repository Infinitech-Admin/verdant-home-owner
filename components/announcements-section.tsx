"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ArrowRight, Calendar, Loader2, X, Tag } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  date: string;
  category: "Update" | "Event" | "Alert" | "Development" | "Health" | "Notice";
  description: string;
  content: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements?per_page=6`,
      );
      const data = await response.json();
      if (data.success && data.data) {
        setAnnouncements(data.data.data || []);
      } else {
        setError("Failed to load announcements");
      }
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) return;
    setSubscribing(true);
    setTimeout(() => {
      setEmail("");
      setSubscribing(false);
    }, 1500);
  };

  const getCategoryStyle = (
    category: string,
  ): { background: string; color: string } => {
    const styles: Record<string, { background: string; color: string }> = {
      Alert: { background: "#FEE2E2", color: "#B91C1C" },
      Event: { background: "#EDE9FE", color: "#6D28D9" },
      Update: { background: "#DBEAFE", color: "#1D4ED8" },
      Development: { background: "#E0E7FF", color: "#3730A3" },
      Health: { background: "#D1FAE5", color: "#065F46" },
      Notice: { background: "#E8F5E9", color: "#1A5C2A" },
    };
    return styles[category] || { background: "#F3F4F6", color: "#374151" };
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(to bottom, #F0F7F1, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bell className="w-10 h-10" style={{ color: "#1A5C2A" }} />
            </motion.div>
          </div>
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: "#E8F5E9", color: "#1A5C2A" }}
          >
            Stay Informed
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "#0F3A1A" }}
          >
            Latest Announcements
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: "#2E7D40" }}>
            Stay informed with the most recent updates and important notices
            from Verdant Acres Villagers Association, Inc.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2
                className="w-10 h-10 animate-spin mx-auto mb-3"
                style={{ color: "#1A5C2A" }}
              />
              <p style={{ color: "#2E7D40" }}>Loading announcements...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAnnouncements}
              className="px-6 py-3 rounded-lg text-white font-semibold transition-colors"
              style={{ background: "#1A5C2A" }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && announcements.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {announcements.map((announcement, i) => {
                const catStyle = getCategoryStyle(announcement.category);
                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedAnnouncement(announcement)}
                    className="group p-6 rounded-2xl bg-white border transition-all cursor-pointer"
                    style={{ borderColor: "#C8E6C9" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#4CAF6B";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 8px 24px rgba(26,92,42,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#C8E6C9";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={catStyle}
                      >
                        <Tag className="w-3 h-3" />
                        {announcement.category}
                      </span>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#4CAF6B" }}
                      />
                    </div>
                    <h3
                      className="text-lg font-bold mb-2 line-clamp-2 transition-colors"
                      style={{ color: "#0F3A1A" }}
                    >
                      {announcement.title}
                    </h3>
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: "#2E7D40" }}
                    >
                      {announcement.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className="flex items-center gap-1"
                        style={{ color: "#4CAF6B" }}
                      >
                        <Calendar className="w-3 h-3" />{" "}
                        {formatDate(announcement.date)}
                      </span>
                      <ArrowRight
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        style={{ color: "#1A5C2A" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Subscribe CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-8 md:p-12 text-center text-white shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 50%, #2E7D40 100%)",
              }}
            >
              {/* Decorative top line */}
              <div
                className="w-16 h-1 rounded-full mx-auto mb-6"
                style={{ background: "#4CAF6B" }}
              />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Subscribe to VAVA Updates
              </h2>
              <p
                className="mb-6 max-w-2xl mx-auto text-lg"
                style={{ color: "#C8E6C9" }}
              >
                Get the latest announcements from Verdant Acres Villagers
                Association delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 shadow-lg"
                  style={{
                    color: "#0F3A1A",
                    background: "#FFFFFF",
                    // @ts-ignore
                    "--tw-ring-color": "#4CAF6B",
                  }}
                />
                <motion.button
                  onClick={handleSubscribe}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={subscribing}
                  className="px-6 py-3 font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
                  style={{ background: "#4CAF6B", color: "#0F3A1A" }}
                >
                  {subscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && announcements.length === 0 && (
          <div className="text-center py-12">
            <Bell
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "#C8E6C9" }}
            />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#1A5C2A" }}
            >
              No Announcements Yet
            </h3>
            <p style={{ color: "#2E7D40" }}>
              Check back later for updates and notices from VAVA.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAnnouncement(null)}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div
                className="text-white px-6 py-4 flex items-center justify-between"
                style={{
                  background: "linear-gradient(135deg, #0F3A1A, #1A5C2A)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Bell className="w-6 h-6 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold truncate">
                      Announcement Details
                    </h2>
                    <p className="text-sm" style={{ color: "#A8D5B5" }}>
                      ID #{selectedAnnouncement.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 rounded-lg transition-colors flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.2)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.1)")
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase"
                      style={getCategoryStyle(selectedAnnouncement.category)}
                    >
                      <Tag className="w-3 h-3" />
                      {selectedAnnouncement.category}
                    </span>
                    <span
                      className="text-sm flex items-center gap-1"
                      style={{ color: "#4CAF6B" }}
                    >
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedAnnouncement.date)}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: "#0F3A1A" }}
                    >
                      {selectedAnnouncement.title}
                    </h3>
                    <p style={{ color: "#2E7D40" }}>
                      {selectedAnnouncement.description}
                    </p>
                  </div>

                  <div>
                    <h4
                      className="text-sm font-semibold mb-2 uppercase tracking-wide"
                      style={{ color: "#1A5C2A" }}
                    >
                      Full Content
                    </h4>
                    <div
                      className="p-4 rounded-lg border"
                      style={{ background: "#F0F7F1", borderColor: "#C8E6C9" }}
                    >
                      <p
                        className="whitespace-pre-wrap leading-relaxed"
                        style={{ color: "#0F3A1A" }}
                      >
                        {selectedAnnouncement.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="px-6 py-4 border-t flex justify-end"
                style={{ background: "#F0F7F1", borderColor: "#C8E6C9" }}
              >
                <button
                  onClick={() => setSelectedAnnouncement(null)}
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
    </div>
  );
}
