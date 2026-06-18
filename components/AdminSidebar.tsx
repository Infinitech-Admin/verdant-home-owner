"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Ambulance,
  LayoutDashboard,
  Newspaper,
  Mail,
  User,
  LogOut,
  Leaf,
  FileText,
  Building,
  ScrollText,
  Heart,
  UserCheck,
  MapPin,
  Bell,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSidebar() {
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

  const isActive = (path: string) => {
    if (path === "/dashboard/admin") return pathname === path;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/admin" },
    { icon: Newspaper, label: "News", path: "/dashboard/admin/news" },
    {
      icon: Bell,
      label: "Announcements",
      path: "/dashboard/admin/announcements",
    },
    { icon: Mail, label: "Contact messages", path: "/dashboard/admin/contact" },
  ];

  const governmentServices = [
    {
      icon: FileText,
      label: "Business permit",
      path: "/dashboard/admin/business-permit",
    },
    {
      icon: FileText,
      label: "Booking",
      path: "/dashboard/admin/bookings",
    },
    {
      icon: Building,
      label: "Building permit",
      path: "/dashboard/admin/building-permit",
    },
    { icon: ScrollText, label: "Cedula", path: "/dashboard/admin/cedula" },
    {
      icon: Heart,
      label: "Marriage license",
      path: "/dashboard/admin/marriage-license",
    },
  ];

  const healthServices = [
    {
      icon: UserCheck,
      label: "Health certificate",
      path: "/dashboard/admin/health-certificate",
    },
    {
      icon: Heart,
      label: "Medical assistance",
      path: "/dashboard/admin/medical-assistance",
    },
    {
      icon: Ambulance,
      label: "Ambulance request",
      path: "/dashboard/admin/ambulance-request",
    },
  ];

  const publicSafety = [
    {
      icon: MapPin,
      label: "Barangay clearance",
      path: "/dashboard/admin/barangay-clearance",
    },
  ];

  const NavButton = ({ icon: Icon, label, path, iconSize = 18 }: any) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => router.push(path)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all"
        style={{
          background: active ? "rgba(76,175,107,0.28)" : "transparent",
          color: active ? "#fff" : "rgba(255,255,255,0.82)",
          fontWeight: active ? 500 : 400,
        }}
        onMouseEnter={(e) => {
          if (!active)
            (e.currentTarget as HTMLElement).style.background =
              "rgba(76,175,107,0.18)";
        }}
        onMouseLeave={(e) => {
          if (!active)
            (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <Icon
          size={iconSize}
          style={{ color: active ? "#4CAF6B" : "#A8D5B5", flexShrink: 0 }}
        />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside
      className="hidden lg:flex fixed top-0 left-0 h-full w-64 flex-col z-50 overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #0F3A1A 0%, #1A5C2A 60%, #2E7D40 100%)",
      }}
    >
      {/* Logo */}
      <div
        className="p-6 pb-4 flex items-center gap-3 border-b"
        style={{ borderColor: "rgba(200,230,201,0.2)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#E8F5E9" }}
        >
          <Leaf size={20} style={{ color: "#1A5C2A" }} />
        </div>
        <div>
          <p className="font-semibold text-sm text-white leading-tight">
            Verdant Acres
          </p>
          <p className="text-xs" style={{ color: "#A8D5B5" }}>
            Villagers Association
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-0.5">
        {navigationItems.map((item, i) => (
          <NavButton key={i} {...item} />
        ))}

        <div
          className="pt-3 mt-1 border-t"
          style={{ borderColor: "rgba(200,230,201,0.15)" }}
        >
          <p
            className="text-xs px-3 mb-1 font-medium uppercase tracking-widest"
            style={{ color: "rgba(200,230,201,0.55)" }}
          >
            Government services
          </p>
          {governmentServices.map((item, i) => (
            <NavButton key={i} {...item} iconSize={16} />
          ))}
        </div>

        <div
          className="pt-3 mt-1 border-t"
          style={{ borderColor: "rgba(200,230,201,0.15)" }}
        >
          <p
            className="text-xs px-3 mb-1 font-medium uppercase tracking-widest"
            style={{ color: "rgba(200,230,201,0.55)" }}
          >
            Health services
          </p>
          {healthServices.map((item, i) => (
            <NavButton key={i} {...item} iconSize={16} />
          ))}
        </div>

        <div
          className="pt-3 mt-1 border-t"
          style={{ borderColor: "rgba(200,230,201,0.15)" }}
        >
          <p
            className="text-xs px-3 mb-1 font-medium uppercase tracking-widest"
            style={{ color: "rgba(200,230,201,0.55)" }}
          >
            Public safety
          </p>
          {publicSafety.map((item, i) => (
            <NavButton key={i} {...item} iconSize={16} />
          ))}
        </div>

        <div
          className="pt-3 mt-1 border-t"
          style={{ borderColor: "rgba(200,230,201,0.15)" }}
        >
          <NavButton icon={User} label="Users" path="/dashboard/admin/users" />
        </div>
      </nav>

      {/* Logout */}
      <div
        className="px-4 pb-6 pt-3 border-t"
        style={{ borderColor: "rgba(200,230,201,0.15)" }}
      >
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors group disabled:opacity-50"
          style={{ color: "rgba(255,255,255,0.65)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(220,38,38,0.2)";
            (e.currentTarget as HTMLElement).style.color = "#fca5a5";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.65)";
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
