"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Mail,
  User,
  FileText,
  Building,
  ScrollText,
  Heart,
  UserCheck,
  Ambulance,
  MapPin,
  ChevronUp,
  X,
} from "lucide-react";

export default function AdminBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeDropup, setActiveDropup] = useState<string | null>(null);

  const governmentServices = [
    {
      icon: FileText,
      label: "Business Permit",
      path: "/dashboard/admin/business-permit",
    },
    {
      icon: Building,
      label: "Building Permit",
      path: "/dashboard/admin/building-permit",
    },
    { icon: ScrollText, label: "Cedula", path: "/dashboard/admin/cedula" },
    {
      icon: Heart,
      label: "Marriage License",
      path: "/dashboard/admin/marriage-license",
    },
  ];

  const healthAndSafety = [
    {
      icon: UserCheck,
      label: "Health Certificate",
      path: "/dashboard/admin/health-certificate",
    },
    {
      icon: Heart,
      label: "Medical Assistance",
      path: "/dashboard/admin/medical-assistance",
    },
    {
      icon: Ambulance,
      label: "Ambulance Request",
      path: "/dashboard/admin/ambulance-request",
    },
    {
      icon: MapPin,
      label: "Barangay Clearance",
      path: "/dashboard/admin/services/barangay-clearance",
    },
  ];

  const newsAndUpdates = [
    { icon: ScrollText, label: "Booking", path: "/dashboard/admin/booking" },
    { icon: Newspaper, label: "News", path: "/dashboard/admin/news" },
    {
      icon: ScrollText,
      label: "Announcements",
      path: "/dashboard/admin/announcements",
    },
  ];

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard/admin",
      type: "link",
    },
    {
      icon: FileText,
      label: "Gov Services",
      type: "dropup",
      items: governmentServices,
    },
    { icon: Heart, label: "Health", type: "dropup", items: healthAndSafety },
    {
      icon: Newspaper,
      label: "Updates",
      type: "dropup",
      items: newsAndUpdates,
    },
    {
      icon: Mail,
      label: "Messages",
      path: "/dashboard/admin/contact",
      type: "link",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/admin") {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  const isGroupActive = (items: any[]) => {
    return items.some((item) => isActive(item.path));
  };

  const handleNavClick = (item: any) => {
    if (item.type === "link") {
      router.push(item.path);
      setActiveDropup(null);
    } else if (item.type === "dropup") {
      setActiveDropup(activeDropup === item.label ? null : item.label);
    }
  };

  const handleSubItemClick = (path: string) => {
    router.push(path);
    setActiveDropup(null);
  };

  const getDropupItems = () => {
    if (activeDropup === "Gov Services") return governmentServices;
    if (activeDropup === "Health") return healthAndSafety;
    if (activeDropup === "Updates") return newsAndUpdates;
    return [];
  };

  return (
    <>
      {/* Backdrop */}
      {activeDropup && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={() => setActiveDropup(null)}
        />
      )}

      {/* Dropup Menu */}
      {activeDropup && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-orange-500 text-white">
              <h3 className="font-semibold text-sm">{activeDropup}</h3>
              <button
                onClick={() => setActiveDropup(null)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-2">
              {getDropupItems().map((item, index) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={index}
                    onClick={() => handleSubItemClick(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      active
                        ? "bg-gradient-to-r from-emerald-50 to-orange-50 text-emerald-700 font-semibold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={active ? "text-emerald-600" : "text-gray-500"}
                    />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => {
            const active =
              item.type === "link"
                ? isActive(item.path!)
                : isGroupActive(item.items!);
            const isDropupOpen = activeDropup === item.label;

            return (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className={`flex-1 flex flex-col items-center py-3 transition-colors relative ${
                  active || isDropupOpen ? "text-emerald-600" : "text-gray-500"
                }`}
              >
                <div className="relative">
                  <item.icon
                    size={22}
                    className={active || isDropupOpen ? "text-emerald-600" : ""}
                  />
                  {item.type === "dropup" && (
                    <ChevronUp
                      size={12}
                      className={`absolute -top-1 -right-1 transition-transform ${
                        isDropupOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium">
                  {item.label}
                </span>
                {(active || isDropupOpen) && (
                  <div className="absolute bottom-0 w-10 h-1 bg-gradient-to-r from-emerald-600 to-orange-500 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
