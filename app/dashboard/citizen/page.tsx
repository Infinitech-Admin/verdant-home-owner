"use client";
import React from "react";
import { useRouter } from "next/navigation";
import CitizenLayout from "@/components/citizenLayout";
import {
  Grid3x3,
  FileText,
  AlertTriangle,
  GraduationCap,
  Rocket,
  Building2,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

export default function CitizenDashboard() {
  const router = useRouter();

  const serviceCategories = [
    {
      icon: Grid3x3,
      label: "Services",
      path: "/dashboard/citizen/services",
      emergency: false,
    },
    {
      icon: FileText,
      label: "Resident guide",
      path: "/dashboard/citizen/citizen-guide",
      emergency: false,
    },
    {
      icon: AlertTriangle,
      label: "Emergency",
      path: "/dashboard/citizen/emergency",
      emergency: true,
    },
    {
      icon: GraduationCap,
      label: "Students",
      path: "/dashboard/citizen/students",
      emergency: false,
    },
    {
      icon: Rocket,
      label: "Startup",
      path: "/dashboard/citizen/startup",
      emergency: false,
    },
    {
      icon: Building2,
      label: "Business",
      path: "/dashboard/citizen/business",
      emergency: false,
    },
  ];

  const quickActions = [
    {
      icon: Phone,
      label: "Emergency call",
      description: "One-tap emergency hotline",
      iconBg: "#dc2626",
      path: "/dashboard/citizen/emergency",
    },
    {
      icon: MapPin,
      label: "Village map",
      description: "Find key locations nearby",
      iconBg: "#ea580c",
      path: "/dashboard/citizen/city-map",
    },
  ];

  return (
    <CitizenLayout>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "#0F3A1A" }}>
          Magandang umaga, Verdant Acres
        </h1>
        <p className="text-sm" style={{ color: "#2E7D40" }}>
          What would you like to do today?
        </p>
      </div>

      {/* Service Categories */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "#1A5C2A" }}
      >
        Services
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {serviceCategories.map((cat, i) => (
          <button
            key={i}
            onClick={() => router.push(cat.path)}
            className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all group"
            style={{
              background: "#FFFFFF",
              border: "1px solid #C8E6C9",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#E8F5E9";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 12px rgba(26,92,42,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
              (e.currentTarget as HTMLElement).style.transform = "none";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: cat.emergency ? "#FEE2E2" : "#E8F5E9" }}
            >
              <cat.icon
                size={22}
                style={{ color: cat.emergency ? "#dc2626" : "#1A5C2A" }}
              />
            </div>
            <span
              className="text-xs font-semibold text-center"
              style={{ color: "#0F3A1A" }}
            >
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Help Section */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background:
            "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 50%, #2E7D40 100%)",
          border: "1px solid #2E7D40",
        }}
      >
        <h2 className="text-base font-bold text-white mb-1">
          Help us improve our village
        </h2>
        <p className="text-xs mb-4" style={{ color: "#C8E6C9" }}>
          Spotted an issue in your area? Let us know so we can fix it together.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/citizen/view-reports")}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.12)")
            }
          >
            View reports
          </button>
          <button
            onClick={() => router.push("/dashboard/citizen/report-issue")}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "#4CAF6B", color: "#0F3A1A" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#5DC87A")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#4CAF6B")
            }
          >
            Report an issue
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "#1A5C2A" }}
      >
        Quick actions
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => router.push(action.path)}
            className="flex items-center gap-4 p-4 rounded-2xl transition-all"
            style={{ background: "#FFFFFF", border: "1px solid #C8E6C9" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#E8F5E9";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 12px rgba(26,92,42,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: action.iconBg }}
            >
              <action.icon size={20} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold" style={{ color: "#0F3A1A" }}>
                {action.label}
              </p>
              <p className="text-xs" style={{ color: "#2E7D40" }}>
                {action.description}
              </p>
            </div>
            <ChevronRight size={18} style={{ color: "#4CAF6B" }} />
          </button>
        ))}
      </div>
    </CitizenLayout>
  );
}
