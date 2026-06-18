"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const result = await authClient.login(email, password);

      if (!result.success) {
        if (result.errors) {
          setErrors(result.errors);
          toast({
            variant: "destructive",
            title: "Validation Errors",
            description: (
              <div className="mt-2 space-y-1">
                {Object.entries(result.errors).map(([field, messages]) => (
                  <div key={field} className="text-sm">
                    <span className="font-medium capitalize">{field}:</span>
                    <ul className="ml-4">
                      {(messages as string[]).map((msg, idx) => (
                        <li key={idx}>- {msg}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ),
          });
        } else if (result.status === 401) {
          toast({
            variant: "destructive",
            title: "Invalid Credentials",
            description: (
              <div>
                <p className="font-semibold mb-1">
                  {result.message || "Email or password is incorrect"}
                </p>
                <p className="text-sm mt-2">Please check:</p>
                <ul className="text-sm ml-4 mt-1 space-y-1">
                  <li>• Your email address is correct</li>
                  <li>• Your password is correct (case-sensitive)</li>
                  <li>• Caps Lock is not enabled</li>
                </ul>
              </div>
            ),
          });
        } else if (result.status === 403) {
          const statusMessage =
            result.message || "Your account is not yet approved";
          const isPending =
            statusMessage.toLowerCase().includes("pending") ||
            result.data?.status === "pending";
          const isRejected =
            statusMessage.toLowerCase().includes("rejected") ||
            result.data?.status === "rejected";

          if (isPending) {
            toast({
              title: "⏳ Account Pending Approval",
              description: (
                <div className="space-y-2">
                  <p className="font-medium">
                    Your account is waiting for VAVA administrator verification.
                  </p>
                  <div className="text-sm space-y-1 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    <p className="font-semibold text-yellow-800">
                      What's next?
                    </p>
                    <ul className="ml-4 space-y-1 text-yellow-700">
                      <li>• Your registration has been received</li>
                      <li>• A VAVA officer will review your documents</li>
                      <li>• You'll receive an email once approved</li>
                      {result.data?.registered_at && (
                        <li>• Registered: {result.data.registered_at}</li>
                      )}
                    </ul>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    This usually takes 1–3 business days
                  </p>
                </div>
              ),
              duration: 10000,
              className: "bg-yellow-50 border-yellow-300",
            });
          } else if (isRejected) {
            toast({
              variant: "destructive",
              title: "❌ Account Rejected",
              description: (
                <div>
                  <p className="font-semibold mb-2">
                    Your registration was not approved.
                  </p>
                  <p className="text-sm">This could be due to:</p>
                  <ul className="text-sm ml-4 mt-1 space-y-1">
                    <li>• Invalid or unclear proof of residency</li>
                    <li>• Incomplete information provided</li>
                    <li>• Document verification issues</li>
                  </ul>
                  <p className="text-sm mt-3 font-medium">
                    Please contact the VAVA office or register again with valid
                    documents.
                  </p>
                </div>
              ),
              duration: 10000,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: statusMessage,
              duration: 6000,
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: result.message || "An unexpected error occurred",
          });
        }
        return;
      }

      const userRole = result.user?.role || "citizen";

      toast({
        title: "✓ Login Successful!",
        description: (
          <div>
            <p className="font-semibold">
              Welcome back, {result.user?.name || "Resident"}!
            </p>
            <p className="text-sm">Redirecting to your dashboard...</p>
          </div>
        ),
        className: "bg-green-50 border-green-200",
        duration: 3000,
      });

      setTimeout(() => {
        if (userRole === "admin") {
          router.push("/dashboard/admin/news");
        } else {
          router.push("/dashboard/citizen");
        }
      }, 1500);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        toast({
          variant: "destructive",
          title: "Network Connection Error",
          description: (
            <div>
              <p className="font-semibold mb-2">
                Unable to connect to the server
              </p>
              <p className="text-sm">Please check:</p>
              <ul className="text-sm ml-4 mt-1 space-y-1">
                <li>• Your internet connection is active</li>
                <li>• The server is running</li>
                <li>• No firewall is blocking the connection</li>
              </ul>
            </div>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Unexpected Error",
          description: "An error occurred during login. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
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
        className="fixed top-20 left-[15%] w-40 h-40 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-20 right-[15%] w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(46,125,64,0.3)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div
          className="rounded-2xl shadow-2xl p-10 border"
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
              Welcome Back
            </h1>
            <p style={{ color: "#C8E6C9" }} className="text-sm">
              Sign in to your Verdant Acres community account
            </p>
          </motion.div>

          {/* Form */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#A8D5B5" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.email;
                      return n;
                    });
                }}
                className={`w-full px-4 py-3 rounded-xl border transition text-white placeholder-white/30 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:ring-red-400/30"
                    : "border-white/20 focus:border-green-400 focus:ring-green-400/20"
                }`}
                style={{ background: "rgba(255,255,255,0.08)" }}
                placeholder="your@email.com"
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              />
              {errors.email && (
                <div className="mt-1 flex items-start gap-1 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{errors.email.join(", ")}</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#A8D5B5" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.password;
                      return n;
                    });
                }}
                className={`w-full px-4 py-3 rounded-xl border transition text-white placeholder-white/30 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-400/30"
                    : "border-white/20 focus:border-green-400 focus:ring-green-400/20"
                }`}
                style={{ background: "rgba(255,255,255,0.08)" }}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              />
              {errors.password && (
                <div className="mt-1 flex items-start gap-1 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{errors.password.join(", ")}</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-end"
            >
              {/* <Link
                href="#"
                style={{ color: "#4CAF6B" }}
                className="text-sm font-semibold hover:opacity-80 transition"
              >
                Forgot password?
              </Link> */}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: "linear-gradient(135deg, #4CAF6B, #2E7D40)",
                boxShadow: "0 4px 20px rgba(76,175,107,0.35)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-8 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p style={{ color: "#A8D5B5" }} className="text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold hover:opacity-80 transition"
                style={{ color: "#4CAF6B" }}
              >
                Register here
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
