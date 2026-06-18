"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  ChevronRight,
} from "lucide-react";

// Replace TikTokIcon/XIcon with your own icon imports as needed
// import { TikTokIcon, XIcon } from "@/components/icons"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 50%, #0F3A1A 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle white vertical lines */}
        <div
          className="absolute top-0 left-10 w-px h-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.03), transparent)",
          }}
        />
        <div
          className="absolute top-0 left-20 w-px h-3/4"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.02), transparent)",
          }}
        />
        <div
          className="absolute top-0 right-10 w-px h-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.03), transparent)",
          }}
        />
        <div
          className="absolute top-0 right-20 w-px h-3/4"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.02), transparent)",
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Top accent bar — white, matching the VA logo's inner lines */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, transparent, #FFFFFF, #4CAF6B, #FFFFFF, transparent)",
        }}
      />

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/image.png"
                alt="Verdant Acres Villagers Association Seal"
                className="w-14 h-14"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Verdant Acres</h3>
                <p className="text-sm font-medium" style={{ color: "#4CAF6B" }}>
                  Villagers Association, Inc.
                </p>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "#A8D5B5" }}
            >
              Delivering quality community services and building a progressive
              neighborhood for all Verdant Acres residents.
            </p>

            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#A8D5B5",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#4CAF6B";
                    (e.currentTarget as HTMLElement).style.color = "#0F3A1A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "#A8D5B5";
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4
              className="font-bold mb-5 text-sm uppercase tracking-wider"
              style={{ color: "#4CAF6B" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm flex items-center gap-1 group transition-colors"
                    style={{ color: "#A8D5B5" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#A8D5B5")
                    }
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4
              className="font-bold mb-5 text-sm uppercase tracking-wider"
              style={{ color: "#4CAF6B" }}
            >
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm flex items-center gap-1 group transition-colors"
                    style={{ color: "#A8D5B5" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#A8D5B5")
                    }
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4
              className="font-bold mb-5 text-sm uppercase tracking-wider"
              style={{ color: "#4CAF6B" }}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(76,175,107,0.2)" }}
                >
                  <Phone className="w-4 h-4" style={{ color: "#4CAF6B" }} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Phone</p>
                  <a
                    href="tel:+6328874-5050"
                    className="text-sm transition-colors"
                    style={{ color: "#A8D5B5" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#4CAF6B")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#A8D5B5")
                    }
                  >
                    (02) 8874-5050
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(76,175,107,0.2)" }}
                >
                  <Mail className="w-4 h-4" style={{ color: "#4CAF6B" }} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Email</p>
                  <a
                    href="mailto:info@verdantacres.com"
                    className="text-sm transition-colors"
                    style={{ color: "#A8D5B5" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#4CAF6B")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#A8D5B5")
                    }
                  >
                    info@verdantacres.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(76,175,107,0.2)" }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "#4CAF6B" }} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Address</p>
                  <p className="text-sm" style={{ color: "#A8D5B5" }}>
                    Verdant Acres Subdivision,
                    <br />
                    Las Piñas City
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="relative border-t"
        style={{
          background: "rgba(0,0,0,0.3)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs md:text-sm" style={{ color: "#A8D5B5" }}>
              © {new Date().getFullYear()} Verdant Acres Villagers Association,
              Inc. All rights reserved.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-xs md:text-sm" style={{ color: "#7BBF92" }}>
                Powered by{" "}
                <a
                  href="https://infinitechphil.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold transition-colors"
                  style={{ color: "#4CAF6B" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#4CAF6B")
                  }
                >
                  INFINITECH ADVERTISING CORPORATION
                </a>
              </p>

              <span className="hidden md:inline" style={{ color: "#2E7D40" }}>
                |
              </span>

              <p
                className="text-xs md:text-sm font-medium"
                style={{ color: "#4CAF6B" }}
              >
                Proudly serving Verdant Acres residents
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
