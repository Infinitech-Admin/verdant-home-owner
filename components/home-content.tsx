"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Zap,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Copy,
  ExternalLink,
  X,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ─── Types (mirrored from ServicesSection) ────────────────────────────────────

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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.verdantacres.com.ph/api";

// ─── Home preview catalog (top 6 services) ───────────────────────────────────

const HOME_SERVICES: Service[] = [
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
      {
        key: "entry_date",
        label: "Entry Date",
        type: "date",
        required: true,
      },
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
    key: "health_wellness",
    name: "Health & Wellness",
    icon: "❤️",
    description: "Community health programs and first aid services",
    amount: 0,
    requires_payment: false,
    fields: [
      {
        key: "program_type",
        label: "Program / Service",
        type: "select",
        required: true,
        options: [
          "Free Medical Consultation",
          "Blood Pressure Monitoring",
          "First Aid Training",
          "Health Seminar",
          "Other",
        ],
      },
    ],
  },
  {
    key: "scholarship_aid",
    name: "Scholarship Aid",
    icon: "🎓",
    description: "Educational assistance for residents' children",
    amount: 0,
    requires_payment: false,
    fields: [
      {
        key: "student_name",
        label: "Student Full Name",
        type: "text",
        required: true,
      },
      {
        key: "school",
        label: "School / University",
        type: "text",
        required: true,
      },
      {
        key: "grade_level",
        label: "Grade Level / Year",
        type: "text",
        required: true,
      },
      {
        key: "aid_type",
        label: "Type of Aid Needed",
        type: "select",
        required: true,
        options: [
          "Tuition Assistance",
          "School Supplies",
          "Transportation",
          "Uniform",
          "Other",
        ],
      },
    ],
  },
];

// ─── Helper: dynamic field renderer ──────────────────────────────────────────

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

// ─── Booking Modal (identical to ServicesSection) ─────────────────────────────

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
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReference, setPaymentReference] = useState("");

  const setDynamic = (key: string, value: string) =>
    setDynamicValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
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

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod || !paymentReference.trim()) {
      setError(
        "Please select a payment method and enter your reference number.",
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/bookings/${referenceNumber}/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_method: paymentMethod,
            payment_reference: paymentReference,
          }),
        },
      );
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

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Form */}
            {step === "form" && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmitBooking}
                className="px-6 py-5 space-y-5"
              >
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

                {service.amount > 0 && (
                  <div
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{
                      background: "#F0F7F1",
                      border: "1px solid #C8E6C9",
                    }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#2E7D40" }}
                    >
                      Processing Fee
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#0F3A1A" }}
                    >
                      ₱
                      {service.amount.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

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

            {/* Step 2: Payment */}
            {step === "payment" && (
              <motion.form
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleConfirmPayment}
                className="px-6 py-5 space-y-5"
              >
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

                <div
                  className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ background: "#FFF8E1", border: "1px solid #FFE082" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#7B5800" }}
                  >
                    Amount Due
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "#5D4037" }}
                  >
                    ₱
                    {service.amount.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

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

                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: "#2E7D40" }}
                  >
                    Payment Reference / Transaction Number *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. GCash ref: 1234567890"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                  <p className="text-xs mt-1" style={{ color: "#9E9E9E" }}>
                    Screenshot your transaction and keep this for reference.
                  </p>
                </div>

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
                      "Confirm Payment"
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Success */}
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
                      ? "Your payment has been received and booking confirmed."
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

// ─── Main HomeContent ─────────────────────────────────────────────────────────

export default function HomeContent() {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <>
      {/* Services Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #F0F7F1, #ffffff)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: "#E8F5E9", color: "#1A5C2A" }}
            >
              <Zap className="w-4 h-4" />
              Quick Access
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#0F3A1A" }}
            >
              Association Services
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#2E7D40" }}
            >
              Access essential community services and documentation with ease
            </p>
          </motion.div>

          {/* Service cards — same style as ServicesSection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {HOME_SERVICES.map((service, i) => (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
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
                {/* Free / paid badge */}
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

                {/* Emoji icon */}
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
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 shadow-lg text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #1A5C2A, #2E7D40)",
                  boxShadow: "0 4px 16px rgba(26,92,42,0.3)",
                }}
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 text-white"
        style={{ background: "#0F3A1A" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{ background: "rgba(76,175,107,0.2)", color: "#A8D5B5" }}
              >
                About Verdant Acres
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Making Verdant Acres{" "}
                <span style={{ color: "#4CAF6B" }}>
                  More Livable, Greener &amp; Resilient
                </span>
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: "#C8E6C9" }}>
                Verdant Acres Villagers Association, Inc. (VAVA) is the
                homeowners' association serving the Verdant Acres Subdivision in
                Pamplona Tres, Las Piñas City. We are committed to fostering a
                safe, clean, and harmonious community for all residents.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: "#C8E6C9" }}>
                Through active governance, community programs, and collaborative
                initiatives, VAVA works to improve the quality of life for every
                household — promoting green spaces, security, and a strong
                neighborhood spirit.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors text-white"
                style={{
                  background: "linear-gradient(135deg, #4CAF6B, #2E7D40)",
                }}
              >
                Learn More About VAVA
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: "#FFFFFF" }}
              >
                <div className="w-full h-[400px] flex flex-col items-center justify-center gap-6 px-8">
                  <img
                    src="/verdant-acres-logo.png"
                    alt="Verdant Acres Villagers Association"
                    className="w-56 h-56 object-contain"
                  />
                  <div className="text-center">
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "#4CAF6B" }}
                    >
                      Pamplona Tres, Las Piñas City
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: "#0F3A1A" }}
                    >
                      Verdant Acres Subdivision
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl"
                style={{ background: "rgba(76,175,107,0.2)" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {selected && (
          <BookingModal service={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
