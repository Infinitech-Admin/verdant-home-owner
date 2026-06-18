"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Check, Smartphone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/announcements", label: "Announcements" },
  { href: "/news", label: "News" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkIOS = () => {
      const ua = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(ua);
      setIsIOS(isIOSDevice);
      return isIOSDevice;
    };

    const iosDetected = checkIOS();

    const checkInstalled = () => {
      const isStandaloneDisplay = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const isIOSStandalone = window.navigator.standalone === true;
      const isAndroidApp = document.referrer.includes("android-app://");
      const installed = isStandaloneDisplay || isIOSStandalone || isAndroidApp;
      if (installed) {
        setIsInstalled(true);
        setShowInstallButton(false);
        return true;
      }
      return false;
    };

    if (checkInstalled()) return;

    if (iosDetected) {
      setShowInstallButton(true);
      return;
    }

    setShowInstallButton(true);

    if (globalDeferredPrompt) {
      setDeferredPrompt(globalDeferredPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    const prompt = deferredPrompt || globalDeferredPrompt;

    if (!prompt) {
      alert(
        "⚠️ Install Prompt Not Available\n\n" +
          "The browser hasn't triggered the install prompt yet.\n\n" +
          "Please try refreshing the page or use a supported browser (Chrome, Edge, Samsung Internet).",
      );
      return;
    }

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
    } catch (error) {
      alert("Installation failed. Please try again.");
    }
  };

  const dismissIOSInstructions = () => setShowIOSInstructions(false);

  return (
    <>
      {/* ─── HEADER ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b shadow-sm"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderColor: "#C8E6C9",
        }}
      >
        {/* Top accent strip — VA green */}
        <div
          className="h-0.5 w-full"
          style={{
            background: "linear-gradient(90deg, #1A5C2A, #4CAF6B, #1A5C2A)",
          }}
        />

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="/verdant-acres-logo.png"
                  alt="Verdant Acres Villagers Association Seal"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold"
                  style={{ color: "#1A5C2A" }}
                >
                  Verdant Acres
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "#2E7D40" }}
                >
                  Villagers Association, Inc.
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 text-sm font-semibold rounded-full transition-all"
                    style={{
                      background: isActive ? "#E8F5E9" : "transparent",
                      color: isActive ? "#1A5C2A" : "#2E7D40",
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "#4CAF6B" }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <motion.div
            className="hidden lg:flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AnimatePresence mode="wait">
              {showInstallButton && !isInstalled && (
                <motion.button
                  key="install-button"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={handleInstallClick}
                  className="px-4 py-2.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #4CAF6B, #2E7D40)",
                    color: "#FFFFFF",
                  }}
                >
                  <Download size={18} />
                  <span>Install App</span>
                </motion.button>
              )}

              {isInstalled && (
                <motion.div
                  key="installed-badge"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="px-4 py-2.5 rounded-full font-semibold flex items-center gap-2 border"
                  style={{
                    background: "#E8F5E9",
                    color: "#1A5C2A",
                    borderColor: "#C8E6C9",
                  }}
                >
                  <Check size={18} />
                  <span>Installed</span>
                </motion.div>
              )}
            </AnimatePresence>

            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 text-white"
              style={{
                background: "linear-gradient(135deg, #1A5C2A, #2E7D40)",
              }}
            >
              Login
            </Link>
          </motion.div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: "#1A5C2A" }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t px-4 py-4 space-y-2 overflow-hidden absolute top-full left-0 w-full z-40 shadow-lg bg-white"
                style={{ borderColor: "#C8E6C9" }}
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm font-medium py-3 px-4 rounded-lg transition-colors"
                      style={{
                        background: isActive ? "#E8F5E9" : "transparent",
                        color: isActive ? "#1A5C2A" : "#2E7D40",
                        borderLeft: isActive
                          ? "4px solid #4CAF6B"
                          : "4px solid transparent",
                        fontWeight: isActive ? 700 : 500,
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {showInstallButton && !isInstalled && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => {
                      handleInstallClick();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 text-white transition-all active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #4CAF6B, #2E7D40)",
                    }}
                  >
                    <Download size={18} />
                    <span>Install App</span>
                  </motion.button>
                )}

                {isInstalled && (
                  <div
                    className="w-full px-4 py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 border"
                    style={{
                      background: "#E8F5E9",
                      color: "#1A5C2A",
                      borderColor: "#C8E6C9",
                    }}
                  >
                    <Check size={18} />
                    <span>App Installed</span>
                  </div>
                )}

                <Link
                  href="/login"
                  className="block w-full px-4 py-3 rounded-lg font-medium text-center text-white transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #1A5C2A, #2E7D40)",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* ─── iOS Install Instructions Modal ─── */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
            onClick={dismissIOSInstructions}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={dismissIOSInstructions}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                style={{ color: "#1A5C2A" }}
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-3 rounded-full"
                  style={{ background: "#E8F5E9" }}
                >
                  <Smartphone style={{ color: "#1A5C2A" }} size={24} />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#1A5C2A" }}
                  >
                    Install App
                  </h3>
                  <p className="text-sm" style={{ color: "#2E7D40" }}>
                    Add to Home Screen
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {[
                  <>
                    Tap the <strong>Share</strong> button{" "}
                    <span className="text-2xl">⬆️</span> at the bottom of Safari
                  </>,
                  <>
                    Scroll down and tap <strong>"Add to Home Screen"</strong>{" "}
                    <span className="text-xl">➕</span>
                  </>,
                  <>
                    Tap <strong>"Add"</strong> in the top right to confirm
                  </>,
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ background: "#E8F5E9", color: "#1A5C2A" }}
                    >
                      {i + 1}
                    </div>
                    <p style={{ color: "#1A5C2A" }}>{step}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={dismissIOSInstructions}
                className="w-full mt-6 px-4 py-3 font-semibold rounded-lg text-white transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #1A5C2A, #2E7D40)",
                }}
              >
                Got it!
              </button>

              <button
                onClick={dismissIOSInstructions}
                className="w-full mt-2 px-4 py-2 text-sm transition-colors"
                style={{ color: "#2E7D40" }}
              >
                Don't show again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
