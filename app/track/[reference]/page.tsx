"use client";

// PATH: app/track/[reference]/page.tsx

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ChevronLeft,
  Copy,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";
type PaymentStatus = "unpaid" | "pending_verification" | "paid";

type Booking = {
  id: number;
  reference_number: string;
  service: { id: number; key: string; name: string; icon: string } | null;
  full_name: string;
  email: string;
  phone: string;
  house_number: string;
  street: string;
  booking_details: Record<string, string>;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: BookingStatus;
  payment_method: string | null;
  payment_reference: string | null;
  payment_screenshot_url: string | null;
  payment_status: PaymentStatus;
  amount_paid: number | null;
  payment_confirmed_at: string | null;
  created_at: string;
};

// ─── Status config ────────────────────────────────────────────────────────────

const BOOKING_STATUS: Record<
  BookingStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending Review",
    color: "#7B5800",
    bg: "#FFF8E1",
    icon: <Clock size={16} />,
  },
  confirmed: {
    label: "Confirmed",
    color: "#1A5C2A",
    bg: "#E8F5E9",
    icon: <CheckCircle2 size={16} />,
  },
  processing: {
    label: "Processing",
    color: "#1565C0",
    bg: "#E3F2FD",
    icon: <Loader2 size={16} className="animate-spin" />,
  },
  completed: {
    label: "Completed",
    color: "#1A5C2A",
    bg: "#E8F5E9",
    icon: <CheckCircle2 size={16} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "#B71C1C",
    bg: "#FFEBEE",
    icon: <XCircle size={16} />,
  },
};

const PAYMENT_STATUS: Record<
  PaymentStatus,
  { label: string; color: string; bg: string }
> = {
  unpaid: { label: "Unpaid", color: "#B71C1C", bg: "#FFEBEE" },
  pending_verification: {
    label: "Pending Verification",
    color: "#7B5800",
    bg: "#FFF8E1",
  },
  paid: { label: "Paid", color: "#1A5C2A", bg: "#E8F5E9" },
};

// ─── Timeline steps ───────────────────────────────────────────────────────────

const TIMELINE: { status: BookingStatus; label: string; desc: string }[] = [
  {
    status: "pending",
    label: "Submitted",
    desc: "Your request has been received",
  },
  {
    status: "confirmed",
    label: "Confirmed",
    desc: "VAVA has confirmed your booking",
  },
  {
    status: "processing",
    label: "Processing",
    desc: "Your request is being processed",
  },
  {
    status: "completed",
    label: "Completed",
    desc: "Service has been completed",
  },
];

const STATUS_ORDER: BookingStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "completed",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrackBookingPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  // ✅ Next.js 15: unwrap params with React.use()
  const { reference } = use(params);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [screenshotOpen, setScreenshotOpen] = useState(false);

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/bookings/${reference}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBooking(d.data);
        else setError(d.message || "Booking not found.");
      })
      .catch(() => setError("Could not load booking. Please try again."))
      .finally(() => setLoading(false));
  }, [reference]);

  const copyRef = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStep = booking ? STATUS_ORDER.indexOf(booking.status) : -1;

  // ── Loading ──
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F0F7F1" }}
      >
        <Loader2
          size={36}
          className="animate-spin"
          style={{ color: "#1A5C2A" }}
        />
      </div>
    );
  }

  // ── Error / not found ──
  if (error || !booking) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ background: "#F0F7F1" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "#FFEBEE" }}
        >
          <XCircle size={40} style={{ color: "#B71C1C" }} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#0F3A1A" }}>
            Booking Not Found
          </h1>
          <p className="text-sm" style={{ color: "#4CAF6B" }}>
            {error || "We couldn't find a booking with that reference number."}
          </p>
        </div>
        <Link href="/services">
          <button
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #1A5C2A, #2E7D40)" }}
          >
            Back to Services
          </button>
        </Link>
      </div>
    );
  }

  const bookingStatus =
    BOOKING_STATUS[booking.status] ?? BOOKING_STATUS.pending;
  const paymentStatus =
    PAYMENT_STATUS[booking.payment_status] ?? PAYMENT_STATUS.unpaid;

  return (
    <div className="min-h-screen pb-16" style={{ background: "#F0F7F1" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm mb-4 transition-opacity hover:opacity-70"
            style={{ color: "#A5D6A7" }}
          >
            <ChevronLeft size={16} /> Back to Services
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              {booking.service?.icon ?? "📋"}
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: "#A5D6A7" }}
              >
                Booking Tracker
              </p>
              <h1 className="text-xl font-bold text-white">
                {booking.service?.name ?? "Service Request"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-4 pt-6">
        {/* Reference + status */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border p-5"
          style={{ borderColor: "#C8E6C9" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p
                className="text-xs font-medium mb-1"
                style={{ color: "#4CAF6B" }}
              >
                Reference Number
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-bold tracking-widest"
                  style={{ color: "#0F3A1A" }}
                >
                  {booking.reference_number}
                </span>
                <button
                  onClick={copyRef}
                  className="p-1.5 rounded-lg transition"
                  style={{ color: "#4CAF6B" }}
                >
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-xs mt-1" style={{ color: "#9E9E9E" }}>
                Submitted{" "}
                {new Date(booking.created_at).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: bookingStatus.bg,
                color: bookingStatus.color,
              }}
            >
              {bookingStatus.icon} {bookingStatus.label}
            </span>
          </div>
        </motion.div>

        {/* Timeline — hide for cancelled */}
        {booking.status !== "cancelled" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-sm border p-5"
            style={{ borderColor: "#C8E6C9" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ color: "#4CAF6B" }}
            >
              Progress
            </p>
            <div className="relative">
              {/* Track line */}
              <div
                className="absolute left-3 top-3 bottom-3 w-0.5"
                style={{ background: "#E8F5E9" }}
              />
              <div
                className="absolute left-3 top-3 w-0.5 transition-all duration-700"
                style={{
                  background: "#1A5C2A",
                  height:
                    currentStep >= 0
                      ? `${(currentStep / (TIMELINE.length - 1)) * 100}%`
                      : "0%",
                }}
              />
              <div className="space-y-6">
                {TIMELINE.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div
                      key={step.status}
                      className="flex items-start gap-4 relative"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all"
                        style={{
                          background: done ? "#1A5C2A" : "#E8F5E9",
                          border: active ? "2px solid #4CAF6B" : "none",
                        }}
                      >
                        {done ? (
                          <CheckCircle2 size={14} style={{ color: "#fff" }} />
                        ) : (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#C8E6C9" }}
                          />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: done ? "#0F3A1A" : "#9E9E9E" }}
                        >
                          {step.label}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: done ? "#2E7D40" : "#BDBDBD" }}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Resident details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border p-5"
          style={{ borderColor: "#C8E6C9" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#4CAF6B" }}
          >
            Resident Information
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {(
              [
                { label: "Full Name", value: booking.full_name },
                { label: "Email", value: booking.email },
                { label: "Phone", value: booking.phone },
                {
                  label: "Address",
                  value: `${booking.house_number} ${booking.street}`,
                },
                booking.preferred_date
                  ? {
                      label: "Preferred Date",
                      value: new Date(
                        booking.preferred_date,
                      ).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }),
                    }
                  : null,
                booking.preferred_time
                  ? { label: "Preferred Time", value: booking.preferred_time }
                  : null,
              ] as ({ label: string; value: string } | null)[]
            )
              .filter(Boolean)
              .map((item) => (
                <div key={item!.label}>
                  <p className="text-xs" style={{ color: "#9E9E9E" }}>
                    {item!.label}
                  </p>
                  <p
                    className="text-sm font-medium mt-0.5"
                    style={{ color: "#0F3A1A" }}
                  >
                    {item!.value}
                  </p>
                </div>
              ))}
          </div>
          {booking.notes && (
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: "#E8F5E9" }}
            >
              <p className="text-xs mb-1" style={{ color: "#9E9E9E" }}>
                Notes
              </p>
              <p className="text-sm" style={{ color: "#0F3A1A" }}>
                {booking.notes}
              </p>
            </div>
          )}
        </motion.div>

        {/* Service details */}
        {booking.booking_details &&
          Object.keys(booking.booking_details).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm border p-5"
              style={{ borderColor: "#C8E6C9" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#4CAF6B" }}
              >
                Service Details
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(booking.booking_details).map(([key, value]) => (
                  <div key={key}>
                    <p
                      className="text-xs capitalize"
                      style={{ color: "#9E9E9E" }}
                    >
                      {key.replace(/_/g, " ")}
                    </p>
                    <p
                      className="text-sm font-medium mt-0.5"
                      style={{ color: "#0F3A1A" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        {/* Payment details */}
        {(booking.payment_method || booking.payment_status !== "unpaid") && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border p-5"
            style={{ borderColor: "#C8E6C9" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#4CAF6B" }}
              >
                Payment
              </p>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: paymentStatus.bg,
                  color: paymentStatus.color,
                }}
              >
                {paymentStatus.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {booking.amount_paid != null && (
                <div>
                  <p className="text-xs" style={{ color: "#9E9E9E" }}>
                    Amount Paid
                  </p>
                  <p
                    className="text-lg font-bold mt-0.5"
                    style={{ color: "#0F3A1A" }}
                  >
                    ₱
                    {booking.amount_paid.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              )}
              {booking.payment_method && (
                <div>
                  <p className="text-xs" style={{ color: "#9E9E9E" }}>
                    Method
                  </p>
                  <p
                    className="text-sm font-medium mt-0.5 capitalize"
                    style={{ color: "#0F3A1A" }}
                  >
                    {booking.payment_method.replace(/_/g, " ")}
                  </p>
                </div>
              )}
              {booking.payment_reference && (
                <div className="col-span-2">
                  <p className="text-xs" style={{ color: "#9E9E9E" }}>
                    Transaction Reference
                  </p>
                  <p
                    className="text-sm font-medium mt-0.5 font-mono"
                    style={{ color: "#0F3A1A" }}
                  >
                    {booking.payment_reference}
                  </p>
                </div>
              )}
              {booking.payment_confirmed_at && (
                <div className="col-span-2">
                  <p className="text-xs" style={{ color: "#9E9E9E" }}>
                    Submitted At
                  </p>
                  <p
                    className="text-sm font-medium mt-0.5"
                    style={{ color: "#0F3A1A" }}
                  >
                    {new Date(booking.payment_confirmed_at).toLocaleString(
                      "en-PH",
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Screenshot */}
            {booking.payment_screenshot_url && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: "#E8F5E9" }}
              >
                <p className="text-xs mb-2" style={{ color: "#9E9E9E" }}>
                  Payment Screenshot
                </p>
                <button
                  onClick={() => setScreenshotOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
                  style={{ borderColor: "#C8E6C9", color: "#1A5C2A" }}
                >
                  <ImageIcon size={15} /> View Screenshot{" "}
                  <ExternalLink size={13} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3"
        >
          <Link href="/services" className="flex-1">
            <button
              className="w-full py-3 rounded-xl font-semibold border text-sm"
              style={{ borderColor: "#C8E6C9", color: "#1A5C2A" }}
            >
              Back to Services
            </button>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
            style={{ background: "linear-gradient(135deg, #1A5C2A, #2E7D40)" }}
          >
            Refresh Status
          </button>
        </motion.div>
      </div>

      {/* Screenshot lightbox */}
      {screenshotOpen && booking.payment_screenshot_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(15,58,26,0.75)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setScreenshotOpen(false)}
        >
          <div
            className="relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setScreenshotOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
              style={{ background: "#0F3A1A", color: "#fff" }}
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={booking.payment_screenshot_url}
              alt="Payment screenshot"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
