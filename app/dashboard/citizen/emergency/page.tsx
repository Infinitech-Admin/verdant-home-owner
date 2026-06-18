"use client";

import { useState } from "react";
import {
  Phone,
  Ambulance,
  FireExtinguisher,
  Shield,
  ChevronLeft,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import CitizenLayout from "@/components/citizenLayout";

export default function EmergencyPage() {
  const [calling, setCalling] = useState(false);

  const emergencyContacts = [
    {
      icon: Phone,
      label: "Emergency Hotline",
      number: "911",
      iconBg: "#dc2626",
    },
    {
      icon: Ambulance,
      label: "Ambulance",
      number: "(043) 288-8888",
      iconBg: "#1A5C2A",
    },
    {
      icon: FireExtinguisher,
      label: "Fire Department",
      number: "(043) 288-7777",
      iconBg: "#ea580c",
    },
    {
      icon: Shield,
      label: "Police Station",
      number: "(043) 288-6666",
      iconBg: "#0F3A1A",
    },
  ];

  const handleEmergencyCall = async (number: string) => {
    setCalling(true);
    setTimeout(() => {
      window.location.href = `tel:${number}`;
      setCalling(false);
    }, 500);
  };

  return (
    <CitizenLayout>
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(to bottom, #F0F7F1, #ffffff)" }}
      >
        {/* Header */}
        <header
          className="text-white px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-md"
          style={{
            background:
              "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 50%, #2E7D40 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/citizen"
                className="p-1.5 rounded-lg transition-colors"
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
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "#4CAF6B" }}
                >
                  Emergency Services
                </h1>
                <p
                  className="text-xs sm:text-sm mt-0.5"
                  style={{ color: "#C8E6C9" }}
                >
                  Quick access to emergency contacts
                </p>
              </div>
            </div>
            <div
              className="hidden sm:flex items-center gap-2 text-sm"
              style={{ color: "#C8E6C9" }}
            >
              <Clock className="w-4 h-4" />
              <span className="font-medium">24/7 Available</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Emergency Alert */}
            <div
              className="p-4 rounded-xl border-l-4"
              style={{ background: "#FEE2E2", borderColor: "#dc2626" }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#dc2626" }}
                />
                <div>
                  <p
                    className="font-semibold text-sm sm:text-base"
                    style={{ color: "#7f1d1d" }}
                  >
                    For life-threatening emergencies, call{" "}
                    <span
                      className="font-extrabold text-lg"
                      style={{ color: "#dc2626" }}
                    >
                      911
                    </span>{" "}
                    immediately
                  </p>
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{ color: "#991b1b" }}
                  >
                    Available 24/7 for medical, fire, and police emergencies
                  </p>
                </div>
              </div>
            </div>

            {/* One-Tap Emergency Call */}
            <div
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: "#FFFFFF", border: "1px solid #C8E6C9" }}
            >
              <h2
                className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: "#0F3A1A" }}
              >
                <Phone className="w-5 h-5" style={{ color: "#dc2626" }} />
                One-tap emergency call
              </h2>
              <button
                onClick={() => handleEmergencyCall("911")}
                disabled={calling}
                className="w-full rounded-2xl p-6 sm:p-8 transition-all disabled:opacity-50 group"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = "0.92")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = "1")
                }
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Phone
                      className="w-10 h-10 sm:w-12 sm:h-12"
                      style={{ color: "#dc2626" }}
                    />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      Call <span style={{ color: "#fde68a" }}>911</span>
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Emergency Hotline
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Emergency Contacts */}
            <div
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: "#FFFFFF", border: "1px solid #C8E6C9" }}
            >
              <h2
                className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: "#0F3A1A" }}
              >
                <Shield className="w-5 h-5" style={{ color: "#1A5C2A" }} />
                Emergency contacts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {emergencyContacts.map((contact, i) => (
                  <button
                    key={i}
                    onClick={() => handleEmergencyCall(contact.number)}
                    className="flex items-center gap-4 p-4 sm:p-5 rounded-xl transition-all group w-full"
                    style={{
                      background: "#F0F7F1",
                      border: "1px solid #C8E6C9",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "#E8F5E9";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#4CAF6B";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "#F0F7F1";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#C8E6C9";
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: contact.iconBg }}
                    >
                      <contact.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h3
                        className="font-bold text-sm sm:text-base truncate"
                        style={{ color: "#0F3A1A" }}
                      >
                        {contact.label}
                      </h3>
                      <p
                        className="text-sm mt-0.5 font-semibold"
                        style={{
                          color:
                            contact.number === "911" ? "#dc2626" : "#2E7D40",
                        }}
                      >
                        {contact.number}
                      </p>
                    </div>
                    <Phone
                      className="w-4 h-4 flex-shrink-0 transition-colors"
                      style={{ color: "#4CAF6B" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Request Assistance */}
            <div
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: "#FFFFFF", border: "1px solid #C8E6C9" }}
            >
              <h2
                className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: "#0F3A1A" }}
              >
                <Ambulance className="w-5 h-5" style={{ color: "#ea580c" }} />
                Request assistance
              </h2>
              <Link
                href="/dashboard/citizen/emergency/ambulance"
                className="flex items-center gap-4 p-5 sm:p-6 rounded-2xl text-white transition-all group w-full"
                style={{
                  background:
                    "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 50%, #2E7D40 100%)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = "1")
                }
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <Ambulance className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl">
                    Request Ambulance
                  </h3>
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{ color: "#C8E6C9" }}
                  >
                    Share your location for quick response
                  </p>
                </div>
                <MapPin
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "#4CAF6B" }}
                />
              </Link>
            </div>

            {/* Safety Tips */}
            <div
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: "#FFFFFF", border: "1px solid #C8E6C9" }}
            >
              <h3
                className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2"
                style={{ color: "#0F3A1A" }}
              >
                <AlertCircle className="w-5 h-5" style={{ color: "#1A5C2A" }} />
                Safety tips
              </h3>
              <div className="space-y-3">
                {[
                  {
                    num: "1",
                    text: "Stay calm and speak clearly when calling emergency services",
                    accent: false,
                  },
                  {
                    num: "2",
                    text: "Provide your exact location and describe the emergency",
                    accent: false,
                  },
                  {
                    num: "3",
                    text: "Follow the dispatcher's instructions carefully",
                    accent: true,
                  },
                  {
                    num: "4",
                    text: "Don't hang up until told to do so by the operator",
                    accent: false,
                  },
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{
                      background: tip.accent ? "#FFF7ED" : "#F0F7F1",
                      border: `1px solid ${tip.accent ? "#fed7aa" : "#C8E6C9"}`,
                    }}
                  >
                    <span
                      className="font-bold text-lg flex-shrink-0 w-6 text-center"
                      style={{ color: tip.accent ? "#ea580c" : "#1A5C2A" }}
                    >
                      {tip.num}
                    </span>
                    <span
                      className="text-sm sm:text-base"
                      style={{ color: "#0F3A1A" }}
                    >
                      {tip.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </CitizenLayout>
  );
}
