"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Grid3x3,
  Newspaper,
  AlertTriangle,
  User,
  FileText,
  GraduationCap,
  Rocket,
  Building2,
  MapPin,
  Bell,
  LogOut,
  Leaf,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function CitizenSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoggingOut(true);
    try {
      await authClient.logout();
      toast({
        title: "✓ Logged Out Successfully",
        description: "You have been securely logged out.",
        className: "bg-green-50 border-green-200",
        duration: 2000,
      });
      setTimeout(() => router.push("/login"), 500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred. Please try again.",
      });
      setIsLoggingOut(false);
    }
  };

  const navigationItems = [
    { icon: Home, label: "Home", path: "/dashboard/citizen" },
    { icon: Grid3x3, label: "Services", path: "/dashboard/citizen/services" },
    { icon: Newspaper, label: "News", path: "/dashboard/citizen/news" },
    {
      icon: AlertTriangle,
      label: "Emergency",
      path: "/dashboard/citizen/emergency",
    },
    {
      icon: User,
      label: "Account",
      path: "/dashboard/citizen/account/applications",
    },
  ];

  const quickAccessItems = [
    {
      icon: FileText,
      label: "Resident guide",
      path: "/dashboard/citizen/citizen-guide",
    },
    {
      icon: GraduationCap,
      label: "Students",
      path: "/dashboard/citizen/students",
    },
    { icon: Rocket, label: "Startup", path: "/dashboard/citizen/startup" },
    { icon: Building2, label: "Business", path: "/dashboard/citizen/business" },
    { icon: MapPin, label: "Village map", path: "/dashboard/citizen/city-map" },
    { icon: Bell, label: "Alerts", path: "/dashboard/citizen/alerts" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className="hidden lg:flex fixed top-0 left-0 h-full w-64 flex-col z-50 overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #0F3A1A 0%, #1A5C2A 55%, #2E7D40 100%)",
      }}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Logo */}
        <div
          className="flex items-center gap-3 pb-4 mb-4 border-b"
          style={{ borderColor: "rgba(200,230,201,0.2)" }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#E8F5E9" }}
          >
            <Leaf size={22} style={{ color: "#1A5C2A" }} />
          </div>
          <div>
            <p className="font-semibold text-sm text-white leading-tight">
              Verdant Acres
            </p>
            <p className="text-xs font-medium" style={{ color: "#4CAF6B" }}>
              Homeowners Association
            </p>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="space-y-0.5 mb-2">
          {navigationItems.map((item, i) => {
            const active = isActive(item.path);
            return (
              <button
                key={i}
                onClick={() => router.push(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all"
                style={{
                  background: active ? "#4CAF6B" : "transparent",
                  color: active ? "#0F3A1A" : "rgba(255,255,255,0.85)",
                  fontWeight: active ? 500 : 400,
                  boxShadow: active ? "0 2px 8px rgba(76,175,107,0.3)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(76,175,107,0.18)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateX(2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.transform = "none";
                  }
                }}
              >
                <item.icon
                  size={20}
                  style={{
                    color: active ? "#0F3A1A" : "#A8D5B5",
                    flexShrink: 0,
                  }}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Access */}
        <div
          className="border-t pt-3 mt-1 flex-1"
          style={{ borderColor: "rgba(200,230,201,0.15)" }}
        >
          <p
            className="text-xs font-medium uppercase tracking-widest px-3 mb-2"
            style={{ color: "rgba(200,230,201,0.55)" }}
          >
            Quick access
          </p>
          <nav className="space-y-0.5">
            {quickAccessItems.map((item, i) => {
              const active = isActive(item.path);
              return (
                <button
                  key={i}
                  onClick={() => router.push(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition-all"
                  style={{
                    background: active
                      ? "rgba(76,175,107,0.15)"
                      : "transparent",
                    color: active ? "#4CAF6B" : "rgba(255,255,255,0.72)",
                    fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(76,175,107,0.15)";
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateX(2px)";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.transform = "none";
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.72)";
                    }
                  }}
                >
                  <item.icon
                    size={16}
                    style={{
                      color: active ? "#4CAF6B" : "#A8D5B5",
                      flexShrink: 0,
                    }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout */}
      <div
        className="px-5 pb-5 pt-3 border-t"
        style={{ borderColor: "rgba(200,230,201,0.15)" }}
      >
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all disabled:opacity-50"
          style={{
            color: "rgba(255,255,255,0.6)",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(220,38,38,0.2)";
            (e.currentTarget as HTMLElement).style.color = "#fca5a5";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(220,38,38,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.6)";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          }}
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={18} />
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
