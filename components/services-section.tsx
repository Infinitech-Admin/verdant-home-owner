"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Copy,
  ExternalLink,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldDef = {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
};

type Service = {
  key: string;
  name: string;
  icon: string;
  description: string;
  amount: number;
  requires_payment: boolean;
  fields: FieldDef[];
};

type Step = "form" | "payment" | "success";

// ─── Constants ────────────────────────────────────────────────────────────────

const STREETS = [
  "Villa Cristina Ave",
  "Sampaguita St",
  "Camia St",
  "Rosal St",
  "Cadena de Amor St",
  "Ilang-Ilang St",
  "Kalachuchi St",
];

const PAYMENT_METHODS = [
  {
    value: "gcash",
    label: "GCash",
    icon: "💙",
    detail: "Send to 0917-XXX-XXXX (VAVA Treasurer)",
  },
  {
    value: "maya",
    label: "Maya",
    icon: "💚",
    detail: "Send to 0917-XXX-XXXX (VAVA Treasurer)",
  },
  {
    value: "bank_transfer",
    label: "BDO Transfer",
    icon: "🏦",
    detail: "BDO Acct 1234-5678-9012 – Verdant Acres HOA",
  },
  {
    value: "cash_on_site",
    label: "Cash on Site",
    icon: "💵",
    detail: "Pay at the VAVA office during processing",
  },
];

const stats = [
  { label: "Active Services", value: "12", icon: "✓" },
  { label: "Households Served", value: "500+", icon: "🏘️" },
  { label: "Requests Processed", value: "2K+", icon: "📊" },
];

// ─── Dynamic field renderer ───────────────────────────────────────────────────

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const base =
    "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition";
  const style = {
    borderColor: "#C8E6C9",
    color: "#0F3A1A",
  } as React.CSSProperties;

  if (field.type === "select") {
    return (
      <select
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={base}
        style={style}
      >
        <option value="">Select {field.label}</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={field.label}
        className={base}
        style={style}
      />
    );
  }
  return (
    <input
      type={field.type}
      required={field.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={field.min}
      max={field.max}
      placeholder={
        field.type === "text" || field.type === "number"
          ? field.label
          : undefined
      }
      className={base}
      style={style}
    />
  );
}

// ─── Screenshot Upload Component ─────────────────────────────────────────────

function ScreenshotUpload({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    onChange(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const clear = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label
        className="block text-xs font-medium mb-1"
        style={{ color: "#2E7D40" }}
      >
        Payment Screenshot <span className="text-red-500">*</span>
      </label>

      {preview ? (
        <div
          className="relative rounded-xl overflow-hidden border"
          style={{ borderColor: "#C8E6C9" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Payment screenshot"
            className="w-full object-cover max-h-48"
          />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow"
            style={{ background: "#0F3A1A", color: "#fff" }}
          >
            <X size={14} />
          </button>
          <div
            className="px-3 py-2 flex items-center gap-2"
            style={{ background: "#F0F7F1" }}
          >
            <CheckCircle2 size={14} style={{ color: "#1A5C2A" }} />
            <span className="text-xs font-medium" style={{ color: "#1A5C2A" }}>
              {file?.name}
            </span>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 py-8 transition-colors"
          style={{ borderColor: "#C8E6C9" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4CAF6B")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#C8E6C9")}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#E8F5E9" }}
          >
            <ImageIcon size={20} style={{ color: "#1A5C2A" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "#0F3A1A" }}>
            Drop screenshot here or{" "}
            <span style={{ color: "#1A5C2A" }}>browse</span>
          </p>
          <p className="text-xs" style={{ color: "#9E9E9E" }}>
            PNG, JPG, WEBP up to 5MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────

function BookingModal({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [copied, setCopied] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>(
    {},
  );

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const setDynamic = (key: string, value: string) =>
    setDynamicValues((prev) => ({ ...prev, [key]: value }));

  // ── Step 1: Submit booking ─────────────────────────────────────────────────
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_key: service.key,
          full_name: fullName,
          email,
          phone,
          house_number: houseNumber,
          street,
          booking_details: dynamicValues,
          preferred_date: preferredDate || undefined,
          preferred_time: preferredTime || undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Submission failed.");

      setReferenceNumber(data.reference_number);
      setStep(service.requires_payment ? "payment" : "success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Confirm payment with screenshot upload ─────────────────────────
  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (!paymentRef.trim()) {
      setError("Please enter your transaction reference number.");
      return;
    }
    if (
      !amountPaid ||
      isNaN(parseFloat(amountPaid)) ||
      parseFloat(amountPaid) <= 0
    ) {
      setError("Please enter a valid amount paid.");
      return;
    }
    if (!screenshot) {
      setError("Please upload a screenshot of your payment.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use FormData so we can attach the screenshot file
      const formData = new FormData();
      formData.append("payment_method", paymentMethod);
      formData.append("payment_reference", paymentRef);
      formData.append("amount_paid", amountPaid);
      formData.append("payment_screenshot", screenshot);

      const res = await fetch(`/api/bookings/${referenceNumber}`, {
        method: "POST",
        body: formData, // No Content-Type header – browser sets multipart boundary
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message ?? "Payment confirmation failed.");
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyRef = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition";
  const inputStyle = {
    borderColor: "#C8E6C9",
    color: "#0F3A1A",
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{
          background: "rgba(15,58,26,0.55)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 100%)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            {service.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg leading-tight">
              {service.name}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#A5D6A7" }}>
              {step === "form"
                ? "Fill in your details"
                : step === "payment"
                  ? "Complete payment"
                  : "Booking confirmed!"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition rounded-lg p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        {service.requires_payment && step !== "success" && (
          <div className="flex items-center px-6 pt-4 gap-2">
            {(["form", "payment"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors"
                  style={{
                    background:
                      step === s || (s === "form" && step === "payment")
                        ? "#1A5C2A"
                        : "#E8F5E9",
                    color:
                      step === s || (s === "form" && step === "payment")
                        ? "#fff"
                        : "#4CAF6B",
                  }}
                >
                  {s === "form" && step === "payment" ? "✓" : i + 1}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: step === s ? "#0F3A1A" : "#9E9E9E" }}
                >
                  {s === "form" ? "Details" : "Payment"}
                </span>
                {i === 0 && (
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#C8E6C9" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          <AnimatePresence mode="wait">
            {/* ── Step 1: Form ── */}
            {step === "form" && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmitBooking}
                className="px-6 py-5 space-y-5"
              >
                {/* Resident info */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "#4CAF6B" }}
                  >
                    Resident Information
                  </p>
                  <div className="space-y-3">
                    <input
                      required
                      type="text"
                      placeholder="Full Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="email"
                        placeholder="Email Address *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Phone (09XX) *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        placeholder="House No. *"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                      <select
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      >
                        <option value="">Street *</option>
                        {STREETS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dynamic service fields */}
                {service.fields.length > 0 && (
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-3"
                      style={{ color: "#4CAF6B" }}
                    >
                      Service Details
                    </p>
                    <div className="space-y-3">
                      {service.fields.map((field) => (
                        <div key={field.key}>
                          <label
                            className="block text-xs mb-1 font-medium"
                            style={{ color: "#2E7D40" }}
                          >
                            {field.label}{" "}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <DynamicField
                            field={field}
                            value={dynamicValues[field.key] ?? ""}
                            onChange={(v) => setDynamic(field.key, v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schedule */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "#4CAF6B" }}
                  >
                    Preferred Schedule (Optional)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className={inputClass}
                      style={inputStyle}
                    />
                    <input
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Additional notes or special instructions (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
                  style={{
                    background: loading
                      ? "#9E9E9E"
                      : "linear-gradient(135deg, #1A5C2A, #2E7D40)",
                  }}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {service.requires_payment
                        ? "Continue to Payment"
                        : "Submit Request"}
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* ── Step 2: Payment ── */}
            {step === "payment" && (
              <motion.form
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleConfirmPayment}
                className="px-6 py-5 space-y-5"
              >
                {/* Reference number */}
                <div
                  className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ background: "#F0F7F1", border: "1px solid #C8E6C9" }}
                >
                  <div>
                    <p className="text-xs" style={{ color: "#4CAF6B" }}>
                      Booking Reference
                    </p>
                    <p
                      className="font-bold text-lg tracking-wider"
                      style={{ color: "#0F3A1A" }}
                    >
                      {referenceNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyRef}
                    className="p-2 rounded-lg transition"
                    style={{ color: "#4CAF6B" }}
                  >
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                {/* Payment method */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "#4CAF6B" }}
                  >
                    Select Payment Method
                  </p>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.value}
                        className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                        style={{
                          borderColor:
                            paymentMethod === method.value
                              ? "#1A5C2A"
                              : "#C8E6C9",
                          background:
                            paymentMethod === method.value ? "#F0F7F1" : "#fff",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={() => setPaymentMethod(method.value)}
                          className="mt-0.5 accent-green-700"
                        />
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#0F3A1A" }}
                          >
                            {method.icon} {method.label}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "#4CAF6B" }}
                          >
                            {method.detail}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amount paid — user enters this */}
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: "#2E7D40" }}
                  >
                    Amount Paid (₱) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                      style={{ color: "#0F3A1A" }}
                    >
                      ₱
                    </span>
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className={inputClass}
                      style={{ ...inputStyle, paddingLeft: "2rem" }}
                    />
                  </div>
                </div>

                {/* Transaction reference */}
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: "#2E7D40" }}
                  >
                    Transaction Reference Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. GCash ref: 1234567890"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                {/* Screenshot upload */}
                <ScreenshotUpload file={screenshot} onChange={setScreenshot} />

                <p className="text-xs -mt-2" style={{ color: "#9E9E9E" }}>
                  Your screenshot will be reviewed by the VAVA office for
                  verification.
                </p>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setError("");
                    }}
                    className="flex-1 py-3 rounded-xl font-semibold border text-sm transition"
                    style={{ borderColor: "#C8E6C9", color: "#1A5C2A" }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
                    style={{
                      background: loading
                        ? "#9E9E9E"
                        : "linear-gradient(135deg, #1A5C2A, #2E7D40)",
                    }}
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Upload size={15} /> Submit Payment
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* ── Step 3: Success ── */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-6 py-10 text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "#E8F5E9" }}
                >
                  <CheckCircle2 size={40} style={{ color: "#1A5C2A" }} />
                </motion.div>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#0F3A1A" }}
                  >
                    Booking Submitted!
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "#4CAF6B" }}>
                    {service.requires_payment
                      ? "Your payment is being reviewed. We'll confirm once verified."
                      : "Your request has been received and is pending review."}
                  </p>
                </div>
                <div
                  className="rounded-xl px-4 py-3 mx-auto max-w-xs"
                  style={{ background: "#F0F7F1", border: "1px solid #C8E6C9" }}
                >
                  <p className="text-xs mb-1" style={{ color: "#4CAF6B" }}>
                    Reference Number
                  </p>
                  <p
                    className="font-bold text-xl tracking-widest"
                    style={{ color: "#0F3A1A" }}
                  >
                    {referenceNumber}
                  </p>
                </div>
                <p className="text-xs" style={{ color: "#9E9E9E" }}>
                  A confirmation email has been sent to <strong>{email}</strong>
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-semibold border text-sm"
                    style={{ borderColor: "#C8E6C9", color: "#1A5C2A" }}
                  >
                    Close
                  </button>
                  <a
                    href={`/track/${referenceNumber}`}
                    className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-1 text-sm"
                    style={{
                      background: "linear-gradient(135deg, #1A5C2A, #2E7D40)",
                    }}
                  >
                    Track Booking <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Service | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => {
        // Handle both single and double-wrapped responses
        const items = Array.isArray(d.data)
          ? d.data
          : Array.isArray(d.data?.data)
            ? d.data.data
            : [];

        if (items.length > 0) {
          const normalized = items.map((s: Service) => ({
            ...s,
            fields: Array.isArray(s.fields) ? s.fields : [],
          }));
          setServices(normalized);
        } else {
          setServices(FALLBACK_CATALOG);
        }
      })
      .catch(() => setServices(FALLBACK_CATALOG))
      .finally(() => setLoadingCatalog(false));
  }, []);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {/* Search */}
      <div className="max-w-6xl mx-auto px-4 pt-10 -mt-8 relative z-10">
        <div
          className="bg-white rounded-xl shadow-xl p-2 border"
          style={{ borderColor: "#C8E6C9" }}
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "#4CAF6B" }}
              size={18}
            />
            <input
              type="text"
              placeholder="Search services…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 bg-transparent text-sm"
              style={{ color: "#0F3A1A" }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {loadingCatalog ? (
          <div className="flex justify-center py-20">
            <Loader2
              size={32}
              className="animate-spin"
              style={{ color: "#4CAF6B" }}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service, i) => (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(service)}
                className="bg-white rounded-xl shadow-md p-6 border transition-all cursor-pointer group relative overflow-hidden"
                style={{ borderColor: "#C8E6C9" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#4CAF6B";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 24px rgba(26,92,42,.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#C8E6C9";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <span
                  className="absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={
                    service.amount > 0
                      ? { background: "#FFF8E1", color: "#7B5800" }
                      : { background: "#E8F5E9", color: "#1A5C2A" }
                  }
                >
                  {service.amount > 0 ? `₱${service.amount}` : "Free"}
                </span>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl"
                  style={{
                    background: "#fff",
                    border: "1.5px solid #C8E6C9",
                    boxShadow: "0 2px 8px rgba(26,92,42,.10)",
                  }}
                >
                  {service.icon}
                </div>
                <h3
                  className="text-lg font-semibold mb-1 pr-12"
                  style={{ color: "#0F3A1A" }}
                >
                  {service.name}
                </h3>
                <p className="text-sm" style={{ color: "#2E7D40" }}>
                  {service.description}
                </p>
                <div
                  className="mt-4 flex items-center gap-1 text-xs font-semibold"
                  style={{ color: "#4CAF6B" }}
                >
                  Book Now <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && !loadingCatalog && (
              <div
                className="col-span-full text-center py-12"
                style={{ color: "#4CAF6B" }}
              >
                No services found for &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="py-16 px-4" style={{ background: "#F0F7F1" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 bg-white rounded-2xl shadow-md border"
              style={{ borderColor: "#C8E6C9" }}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: "#1A5C2A" }}
              >
                {stat.value}
              </div>
              <div className="font-medium" style={{ color: "#2E7D40" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {/* <div
        className="py-16 px-4 text-white"
        style={{
          background:
            "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 50%, #2E7D40 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="w-16 h-1 rounded-full mx-auto mb-6"
            style={{ background: "#4CAF6B" }}
          />
          <h2 className="text-3xl font-bold mb-4">Need Assistance?</h2>
          <p className="text-xl mb-8" style={{ color: "#C8E6C9" }}>
            Our VAVA team is ready to help you with any questions about our
            community services
          </p>
          <a href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-semibold shadow-lg transition-colors"
              style={{ background: "#4CAF6B", color: "#0F3A1A" }}
            >
              Contact VAVA Support
            </motion.button>
          </a>
        </div>
      </div> */}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <BookingModal service={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Fallback catalog ─────────────────────────────────────────────────────────

const FALLBACK_CATALOG: Service[] = [
  {
    key: "hoa_dues",
    name: "HOA Dues Payment",
    icon: "🏠",
    description: "Pay your monthly association dues online",
    amount: 300,
    requires_payment: true,
    fields: [
      {
        key: "billing_month",
        label: "Billing Month",
        type: "month",
        required: true,
      },
      {
        key: "months_to_pay",
        label: "Number of Months",
        type: "number",
        required: true,
        min: 1,
        max: 12,
      },
    ],
  },
  {
    key: "gate_pass",
    name: "Gate Pass / Entry",
    icon: "🔑",
    description: "Request gate passes for visitors and deliveries",
    amount: 0,
    requires_payment: false,
    fields: [
      {
        key: "visitor_name",
        label: "Visitor / Company Name",
        type: "text",
        required: true,
      },
      {
        key: "visitor_purpose",
        label: "Purpose of Visit",
        type: "text",
        required: true,
      },
      {
        key: "vehicle_plate",
        label: "Vehicle Plate Number",
        type: "text",
        required: false,
      },
      { key: "entry_date", label: "Entry Date", type: "date", required: true },
    ],
  },
  {
    key: "renovation_permit",
    name: "Renovation Permit",
    icon: "🔨",
    description: "Submit home renovation and construction requests",
    amount: 500,
    requires_payment: true,
    fields: [
      {
        key: "work_type",
        label: "Type of Work",
        type: "select",
        required: true,
        options: [
          "Minor Repair",
          "Interior Renovation",
          "Exterior Renovation",
          "Extension / Addition",
          "Full Construction",
        ],
      },
      {
        key: "work_description",
        label: "Work Description",
        type: "textarea",
        required: true,
      },
      {
        key: "work_start_date",
        label: "Planned Start Date",
        type: "date",
        required: true,
      },
      {
        key: "work_end_date",
        label: "Planned End Date",
        type: "date",
        required: true,
      },
    ],
  },
  {
    key: "incident_report",
    name: "Incident Report",
    icon: "📋",
    description: "File complaints and incident reports to VAVA",
    amount: 0,
    requires_payment: false,
    fields: [
      {
        key: "incident_type",
        label: "Incident Type",
        type: "select",
        required: true,
        options: [
          "Noise Complaint",
          "Vandalism",
          "Trespassing",
          "Property Damage",
          "Neighbor Dispute",
          "Other",
        ],
      },
      {
        key: "incident_date",
        label: "Date of Incident",
        type: "date",
        required: true,
      },
      {
        key: "incident_location",
        label: "Location / Address",
        type: "text",
        required: true,
      },
      {
        key: "incident_description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    key: "event_permit",
    name: "Event Permit",
    icon: "📣",
    description: "Request permits for community events and gatherings",
    amount: 200,
    requires_payment: true,
    fields: [
      { key: "event_name", label: "Event Name", type: "text", required: true },
      {
        key: "event_type",
        label: "Event Type",
        type: "select",
        required: true,
        options: [
          "Birthday Party",
          "Debut / Wedding",
          "Business Gathering",
          "Community Event",
          "Religious Activity",
          "Other",
        ],
      },
      { key: "event_date", label: "Event Date", type: "date", required: true },
      { key: "event_time", label: "Event Time", type: "time", required: true },
      {
        key: "expected_guests",
        label: "Expected Guests",
        type: "number",
        required: true,
        min: 1,
      },
    ],
  },
  {
    key: "vehicle_sticker",
    name: "Vehicle Sticker",
    icon: "🚗",
    description: "Register your vehicle for subdivision access",
    amount: 150,
    requires_payment: true,
    fields: [
      {
        key: "vehicle_make",
        label: "Vehicle Make / Model",
        type: "text",
        required: true,
      },
      { key: "vehicle_color", label: "Color", type: "text", required: true },
      {
        key: "plate_number",
        label: "Plate Number",
        type: "text",
        required: true,
      },
      {
        key: "vehicle_type",
        label: "Vehicle Type",
        type: "select",
        required: true,
        options: ["Car", "SUV", "Van", "Motorcycle", "Truck"],
      },
      {
        key: "or_cr_number",
        label: "OR/CR Number",
        type: "text",
        required: true,
      },
    ],
  },
];
