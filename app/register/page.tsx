"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Upload, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    proofOfResidency: null as File | null,
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, proofOfResidency: file || null }));
      setError("");
      if (file) {
        toast({
          title: "File Attached",
          description: `${file.name} has been attached successfully.`,
          duration: 3000,
        });
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast({
        variant: "destructive",
        title: "Validation Error",
        description:
          "The passwords you entered do not match. Please try again.",
        duration: 5000,
      });
      return;
    }

    if (!formData.proofOfResidency) {
      setError("Please upload your proof of residency");
      toast({
        variant: "destructive",
        title: "Missing Required Document",
        description:
          "Please upload a proof of residency (e.g. utility bill, lease contract) to continue.",
        duration: 5000,
      });
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      toast({
        variant: "destructive",
        title: "Weak Password",
        description:
          "Your password must be at least 8 characters long for security.",
        duration: 5000,
      });
      return;
    }

    setLoading(true);
    setError("");

    toast({
      title: "Creating Account...",
      description: "Please wait while we process your registration.",
      duration: 3000,
    });

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("address", formData.address);
      data.append("proofOfResidency", formData.proofOfResidency);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          setError(errorMessages);
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: errorMessages,
            duration: 6000,
          });
        } else {
          setError(result.message || "Registration failed");
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description:
              result.message ||
              "Unable to create your account. Please try again.",
            duration: 6000,
          });
        }
        return;
      }

      if (result.data?.token) {
        localStorage.setItem("auth_token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
      }

      toast({
        title: "Account Created! 🎉",
        description:
          "Your account is now pending VAVA officer verification. You'll be notified via email once approved.",
        duration: 6000,
        className: "bg-green-50 border-green-200",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        "An unexpected error occurred. Please check your connection and try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: errorMessage,
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 45%, #0F3A1A 100%)",
      }}
    >
      {/* Ambient glows */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="fixed top-20 left-[10%] w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(76,175,107,0.25)" }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
        className="fixed bottom-20 right-[10%] w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(46,125,64,0.3)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div
          className="rounded-2xl shadow-2xl p-10 md:p-12 border"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255,255,255,0.15)",
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-10"
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 overflow-hidden"
              style={{
                background: "#ffffff",
                border: "2px solid rgba(76,175,107,0.4)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src="/verdant-acres-logo.png"
                alt="Verdant Acres Logo"
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `<span style="font-size:1.5rem;font-weight:700;color:#4CAF6B">VA</span>`;
                }}
              />
            </div>
            <h1
              className="text-3xl font-bold mb-1 bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #A8D5B5, #4CAF6B, #A8D5B5)",
              }}
            >
              Create Account
            </h1>
            <p className="text-sm" style={{ color: "#C8E6C9" }}>
              Join the Verdant Acres community portal as a resident
            </p>
          </motion.div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl flex items-start gap-3"
            >
              <XCircle
                className="text-red-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Full Name */}
              <motion.div variants={fieldVariants}>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A8D5B5" }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border text-white placeholder-white/30 focus:outline-none focus:ring-2 transition"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                  placeholder="Juan Dela Cruz"
                  required
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={fieldVariants}>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A8D5B5" }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border text-white placeholder-white/30 focus:outline-none focus:ring-2 transition"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                  placeholder="juan@email.com"
                  required
                />
              </motion.div>

              {/* Phone */}
              <motion.div variants={fieldVariants}>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A8D5B5" }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border text-white placeholder-white/30 focus:outline-none focus:ring-2 transition"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                  placeholder="+63 912 345 6789"
                  required
                />
              </motion.div>

              {/* Proof of Residency Upload */}
              <motion.div variants={fieldVariants}>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A8D5B5" }}
                >
                  Proof of Residency *
                </label>
                <label
                  className="w-full px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center gap-2 transition"
                  style={{
                    borderColor: formData.proofOfResidency
                      ? "rgba(76,175,107,0.6)"
                      : "rgba(255,255,255,0.2)",
                    background: formData.proofOfResidency
                      ? "rgba(76,175,107,0.1)"
                      : "rgba(255,255,255,0.05)",
                  }}
                >
                  <Upload
                    size={18}
                    style={{
                      color: formData.proofOfResidency ? "#4CAF6B" : "#A8D5B5",
                    }}
                  />
                  <span
                    className="text-sm font-medium truncate max-w-[160px]"
                    style={{
                      color: formData.proofOfResidency ? "#4CAF6B" : "#A8D5B5",
                    }}
                  >
                    {formData.proofOfResidency
                      ? formData.proofOfResidency.name
                      : "Upload Document"}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                    required
                  />
                </label>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(168,213,181,0.5)" }}
                >
                  e.g. utility bill, lease contract, or barangay certificate
                </p>
              </motion.div>

              {/* Password */}
              <motion.div variants={fieldVariants}>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A8D5B5" }}
                >
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border text-white placeholder-white/30 focus:outline-none focus:ring-2 transition"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={fieldVariants}>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A8D5B5" }}
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border text-white placeholder-white/30 focus:outline-none focus:ring-2 transition"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </motion.div>

              {/* Address */}
              <motion.div variants={fieldVariants} className="md:col-span-2">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A8D5B5" }}
                >
                  House / Lot Address in Verdant Acres *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border text-white placeholder-white/30 focus:outline-none focus:ring-2 transition"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                  placeholder="e.g. Blk 3 Lot 12, Kaimito Street, Verdant Acres"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Submit */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{
                background: "linear-gradient(135deg, #4CAF6B, #2E7D40)",
                boxShadow: "0 4px 20px rgba(76,175,107,0.35)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-8 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="text-sm" style={{ color: "#A8D5B5" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold hover:opacity-80 transition"
                style={{ color: "#4CAF6B" }}
              >
                Sign in here
              </Link>
            </p>
            <p
              className="text-xs mt-3"
              style={{ color: "rgba(168,213,181,0.5)" }}
            >
              Verdant Acres Villagers Association · Pamplona Tres, Las Piñas
              City
            </p>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
