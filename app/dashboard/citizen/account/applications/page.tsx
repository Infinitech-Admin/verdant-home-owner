"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
  Calendar,
  User,
  Hash,
  RefreshCw,
  Heart,
  Shield,
  Building,
  Users,
  Home,
  FileHeart,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CitizenLayout from "@/components/citizenLayout";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface Application {
  id: number;
  reference_number: string;
  status: string;
  created_at: string;
  type: string;
  document_path?: string;
  photo_path?: string;
  image_url?: string;
  [key: string]: unknown;
}

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:8000";
const imageCache = new Map<string, string>();

const fetchImageAsBase64 = async (
  imagePath: string,
): Promise<string | null> => {
  if (!imagePath) return null;
  if (imageCache.has(imagePath)) return imageCache.get(imagePath)!;
  try {
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    const response = await fetch(`${IMAGE_BASE_URL}${cleanPath}`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    });
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        imageCache.set(imagePath, base64);
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const categories = [
  {
    id: "health-certificate",
    name: "Health Certificate",
    icon: Heart,
    iconBg: "#dc2626",
    badgeBg: "#FEE2E2",
    badgeText: "#991b1b",
    accentColor: "#dc2626",
    types: ["Health Certificate"],
  },
  {
    id: "barangay-clearance",
    name: "Barangay Clearance",
    icon: Shield,
    iconBg: "#1A5C2A",
    badgeBg: "#E8F5E9",
    badgeText: "#0F3A1A",
    accentColor: "#1A5C2A",
    types: ["Barangay Clearance"],
  },
  {
    id: "business-permit",
    name: "Business Permit",
    icon: Building,
    iconBg: "#6d28d9",
    badgeBg: "#ede9fe",
    badgeText: "#4c1d95",
    accentColor: "#6d28d9",
    types: ["Business Permit", "Business Permit Renewal"],
  },
  {
    id: "cedula",
    name: "Cedula",
    icon: Users,
    iconBg: "#0f766e",
    badgeBg: "#ccfbf1",
    badgeText: "#134e4a",
    accentColor: "#0f766e",
    types: ["Cedula", "Community Tax Certificate"],
  },
  {
    id: "medical-assistance",
    name: "Medical Assistance",
    icon: FileHeart,
    iconBg: "#ea580c",
    badgeBg: "#ffedd5",
    badgeText: "#7c2d12",
    accentColor: "#ea580c",
    types: ["Medical Assistance"],
  },
  {
    id: "building-permit",
    name: "Building Permit",
    icon: Home,
    iconBg: "#1d4ed8",
    badgeBg: "#dbeafe",
    badgeText: "#1e3a8a",
    accentColor: "#1d4ed8",
    types: ["Building Permit"],
  },
  {
    id: "other",
    name: "Other Services",
    icon: FileText,
    iconBg: "#4b5563",
    badgeBg: "#f3f4f6",
    badgeText: "#1f2937",
    accentColor: "#4b5563",
    types: [],
  },
];

function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [imageData, setImageData] = useState<Map<string, string>>(new Map());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const user = await authClient.getCurrentUser();
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to view your applications.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }
        setIsAuthenticated(true);
        const success = searchParams.get("success");
        if (success)
          toast({
            title: "Success!",
            description: `Your ${success} application has been submitted.`,
          });
        await fetchApplications();
      } catch (error) {
        console.error("Error verifying authentication:", error);
        toast({
          title: "Authentication Error",
          description: "Failed to verify your session. Please log in again.",
          variant: "destructive",
        });
        router.push("/login");
      }
    };
    verifyAuth();
  }, [router, searchParams, toast]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/applications", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }
      if (!response.ok)
        throw new Error(`Failed to fetch applications: ${response.statusText}`);
      const data = await response.json();
      let apps: Application[] = [];
      if (Array.isArray(data)) apps = data;
      else if (data.data && Array.isArray(data.data)) apps = data.data;
      else if (data.applications && Array.isArray(data.applications))
        apps = data.applications;
      const sortedApps = apps.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setApplications(sortedApps);
      await fetchAllImages(sortedApps);
      if (sortedApps.length > 0) {
        toast({
          title: "Applications Loaded",
          description: `Found ${sortedApps.length} application${sortedApps.length !== 1 ? "s" : ""}.`,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load applications";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllImages = async (apps: Application[]) => {
    const newImageData = new Map<string, string>();
    const imagePaths = new Set<string>();
    apps.forEach((app) => {
      const path = app.photo_path || app.image_url || app.document_path;
      if (path && typeof path === "string") imagePaths.add(path);
      if (
        app.supporting_documents &&
        typeof app.supporting_documents === "string"
      )
        imagePaths.add(app.supporting_documents);
      Object.entries(app).forEach(([key, value]) => {
        if (
          (key.includes("photo") ||
            key.includes("image") ||
            key.includes("document") ||
            key.includes("supporting")) &&
          (key.includes("path") || key.includes("documents")) &&
          value &&
          typeof value === "string"
        ) {
          imagePaths.add(value as string);
        }
      });
    });
    await Promise.all(
      Array.from(imagePaths).map(async (imgPath) => {
        setLoadingImages((prev) => new Set(prev).add(imgPath));
        const base64 = await fetchImageAsBase64(imgPath);
        setLoadingImages((prev) => {
          const s = new Set(prev);
          s.delete(imgPath);
          return s;
        });
        if (base64) newImageData.set(imgPath, base64);
      }),
    );
    setImageData(newImageData);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge
            style={{ background: "#dcfce7", color: "#14532d" }}
            className="shadow-sm border-0"
          >
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge
            style={{ background: "#fef9c3", color: "#713f12" }}
            className="shadow-sm border-0"
          >
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            style={{ background: "#fee2e2", color: "#7f1d1d" }}
            className="shadow-sm border-0"
          >
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-0">
            {status}
          </Badge>
        );
    }
  };

  const getStatusBorderBg = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return { borderColor: "#4CAF6B", background: "#f0fdf4" };
      case "pending":
        return { borderColor: "#f59e0b", background: "#fffbeb" };
      case "rejected":
        return { borderColor: "#ef4444", background: "#fef2f2" };
      default:
        return { borderColor: "#94a3b8", background: "#f8fafc" };
    }
  };

  const getCategoryForType = (type: string) => {
    return (
      categories.find((cat) =>
        cat.types.some((t) => type.toLowerCase().includes(t.toLowerCase())),
      ) || categories.find((cat) => cat.id === "other")!
    );
  };

  const getCategoryApps = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return [];
    if (category.id === "other")
      return applications.filter(
        (app) => getCategoryForType(app.type)?.id === "other",
      );
    return applications.filter((app) =>
      category.types.some((t) =>
        app.type.toLowerCase().includes(t.toLowerCase()),
      ),
    );
  };

  const filterAndSortApplications = (apps: Application[]) => {
    let filtered = apps.filter((app) => {
      if (statusFilter !== "all" && app.status.toLowerCase() !== statusFilter)
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          app.reference_number.toLowerCase().includes(q) ||
          app.type.toLowerCase().includes(q) ||
          String(app.full_name || app.fullName || app.owner_name || "")
            .toLowerCase()
            .includes(q)
        );
      }
      return true;
    });
    if (sortBy === "newest")
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    else if (sortBy === "oldest")
      filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    else if (sortBy === "type")
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    return filtered;
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status.toLowerCase() === "pending")
      .length,
    approved: applications.filter((a) => a.status.toLowerCase() === "approved")
      .length,
    rejected: applications.filter((a) => a.status.toLowerCase() === "rejected")
      .length,
  };

  if (!isAuthenticated || loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(to bottom, #F0F7F1, #ffffff)" }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#4CAF6B", borderTopColor: "transparent" }}
          />
          <p className="font-medium" style={{ color: "#1A5C2A" }}>
            {!isAuthenticated
              ? "Verifying authentication..."
              : "Loading applications..."}
          </p>
        </div>
      </div>
    );
  }

  const currentCategoryApps = selectedCategory
    ? filterAndSortApplications(getCategoryApps(selectedCategory))
    : [];

  return (
    <div
      className="min-h-screen pb-20 lg:pb-0"
      style={{ background: "linear-gradient(to bottom, #F0F7F1, #ffffff)" }}
    >
      {/* Header */}
      <div
        className="border-b"
        style={{ background: "#ffffff", borderColor: "#C8E6C9" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-green-50"
            >
              <ArrowLeft className="h-5 w-5" style={{ color: "#1A5C2A" }} />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#1A5C2A" }}
              >
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "#0F3A1A" }}>
                  My Applications
                </h1>
                <p className="text-xs" style={{ color: "#2E7D40" }}>
                  Browse by category
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchApplications}
              className="hidden sm:flex gap-2 border"
              style={{ borderColor: "#C8E6C9", color: "#1A5C2A" }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                label: "Total",
                value: stats.total,
                bg: "#1A5C2A",
                muted: "#A8D5B5",
              },
              {
                label: "Pending",
                value: stats.pending,
                bg: "#d97706",
                muted: "#fde68a",
              },
              {
                label: "Approved",
                value: stats.approved,
                bg: "#059669",
                muted: "#a7f3d0",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                bg: "#dc2626",
                muted: "#fecaca",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-2.5 text-center"
                style={{ background: s.bg }}
              >
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p
                  className="text-[10px] font-medium"
                  style={{ color: s.muted }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Error */}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl border-l-4"
            style={{ background: "#FEE2E2", borderColor: "#dc2626" }}
          >
            <div className="flex items-start gap-3">
              <XCircle
                className="h-5 w-5 mt-0.5"
                style={{ color: "#dc2626" }}
              />
              <div className="flex-1">
                <p className="font-medium" style={{ color: "#7f1d1d" }}>
                  Error loading applications
                </p>
                <p className="text-sm mt-1" style={{ color: "#991b1b" }}>
                  {error}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchApplications}
                style={{ color: "#dc2626" }}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Category Grid */}
        {!selectedCategory ? (
          <div>
            <div className="mb-6">
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: "#0F3A1A" }}
              >
                Select a service category
              </h2>
              <p className="text-sm" style={{ color: "#2E7D40" }}>
                Choose a category to view your applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((category) => {
                const categoryApps = getCategoryApps(category.id);
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #C8E6C9",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#4CAF6B";
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#C8E6C9";
                      (e.currentTarget as HTMLElement).style.transform = "none";
                    }}
                  >
                    <div
                      className="h-1.5"
                      style={{ background: category.iconBg }}
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ background: category.iconBg }}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div
                          className="px-3 py-1 rounded-full font-bold text-lg"
                          style={{
                            background: category.badgeBg,
                            color: category.badgeText,
                          }}
                        >
                          {categoryApps.length}
                        </div>
                      </div>
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: "#0F3A1A" }}
                      >
                        {category.name}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: "#2E7D40" }}>
                        {categoryApps.length} application
                        {categoryApps.length !== 1 ? "s" : ""}
                      </p>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {(["pending", "approved", "rejected"] as const).map(
                          (status) => {
                            const count = categoryApps.filter(
                              (a) => a.status.toLowerCase() === status,
                            ).length;
                            if (count === 0) return null;
                            const colors = {
                              approved: {
                                background: "#dcfce7",
                                color: "#14532d",
                              },
                              pending: {
                                background: "#fef9c3",
                                color: "#713f12",
                              },
                              rejected: {
                                background: "#fee2e2",
                                color: "#7f1d1d",
                              },
                            };
                            return (
                              <span
                                key={status}
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={colors[status as keyof typeof colors]}
                              >
                                {count} {status}
                              </span>
                            );
                          },
                        )}
                      </div>
                      <button
                        className="w-full py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "#E8F5E9", color: "#1A5C2A" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            category.iconBg;
                          (e.currentTarget as HTMLElement).style.color =
                            "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            "#E8F5E9";
                          (e.currentTarget as HTMLElement).style.color =
                            "#1A5C2A";
                        }}
                      >
                        View applications →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Back + Category Header */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-sm font-medium mb-5 px-3 py-2 rounded-lg transition-colors"
              style={{ color: "#1A5C2A" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#E8F5E9")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "transparent")
              }
            >
              <ArrowLeft className="h-4 w-4" /> Back to categories
            </button>

            {(() => {
              const category = categories.find(
                (c) => c.id === selectedCategory,
              );
              const Icon = category?.icon || FileText;
              return (
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ background: category?.iconBg }}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "#0F3A1A" }}
                    >
                      {category?.name}
                    </h2>
                    <p className="text-sm" style={{ color: "#2E7D40" }}>
                      {currentCategoryApps.length} application
                      {currentCategoryApps.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: "#4CAF6B" }}
                />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border focus:ring-0"
                  style={{ borderColor: "#C8E6C9" }}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-full sm:w-[160px] border"
                  style={{ borderColor: "#C8E6C9" }}
                >
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className="w-full sm:w-[160px] border"
                  style={{ borderColor: "#C8E6C9" }}
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="type">By type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Empty */}
            {currentCategoryApps.length === 0 ? (
              <div
                className="rounded-2xl p-16 text-center"
                style={{ background: "#ffffff", border: "1px solid #C8E6C9" }}
              >
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: "#E8F5E9" }}
                >
                  <FileText
                    className="h-10 w-10"
                    style={{ color: "#1A5C2A" }}
                  />
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#0F3A1A" }}
                >
                  {searchQuery
                    ? "No matching applications"
                    : "No applications found"}
                </h3>
                <p
                  className="text-sm max-w-md mx-auto"
                  style={{ color: "#2E7D40" }}
                >
                  {searchQuery
                    ? "Try adjusting your search criteria or filters."
                    : statusFilter !== "all"
                      ? `You don't have any ${statusFilter} applications in this category.`
                      : "You haven't submitted any applications in this category yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentCategoryApps.map((app) => {
                  const statusStyle = getStatusBorderBg(app.status);
                  return (
                    <div
                      key={`${app.type}-${app.id}`}
                      onClick={() => setSelectedApp(app)}
                      className="rounded-2xl p-5 cursor-pointer border-l-4 transition-all group hover:shadow-md"
                      style={{
                        background: statusStyle.background,
                        borderLeftColor: statusStyle.borderColor,
                        border: `1px solid #C8E6C9`,
                        borderLeft: `4px solid ${statusStyle.borderColor}`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                          style={{ background: "#1A5C2A" }}
                        >
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-bold text-lg truncate mb-1"
                                style={{ color: "#0F3A1A" }}
                              >
                                {app.type}
                              </h3>
                              <div
                                className="flex items-center gap-3 text-sm flex-wrap"
                                style={{ color: "#2E7D40" }}
                              >
                                <span className="flex items-center gap-1">
                                  <Hash className="h-3.5 w-3.5" />
                                  {app.reference_number}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(app.created_at)}
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                  <User className="h-3.5 w-3.5" />
                                  {String(
                                    app.full_name ||
                                      app.fullName ||
                                      app.owner_name ||
                                      app.groom_name ||
                                      "N/A",
                                  )}
                                </span>
                              </div>
                            </div>
                            {getStatusBadge(app.status)}
                          </div>
                          <button
                            className="mt-2 flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: "#E8F5E9", color: "#1A5C2A" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "#1A5C2A";
                              (e.currentTarget as HTMLElement).style.color =
                                "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "#E8F5E9";
                              (e.currentTarget as HTMLElement).style.color =
                                "#1A5C2A";
                            }}
                          >
                            <Eye className="h-4 w-4" /> View full details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader
            className="border-b pb-4"
            style={{ borderColor: "#C8E6C9" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#1A5C2A" }}
              >
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#0F3A1A" }}
                >
                  {selectedApp?.type}
                </DialogTitle>
                <DialogDescription
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "#2E7D40" }}
                >
                  <Hash className="h-4 w-4" />
                  {selectedApp?.reference_number}
                </DialogDescription>
              </div>
              {selectedApp && getStatusBadge(selectedApp.status)}
            </div>
          </DialogHeader>

          {selectedApp && (
            <div className="overflow-y-auto flex-1 px-1">
              <div className="space-y-6 py-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Status",
                      content: getStatusBadge(selectedApp.status),
                      accent: "#1A5C2A",
                      bg: "#E8F5E9",
                    },
                    {
                      label: "Submitted date",
                      content: (
                        <p
                          className="font-semibold mt-2"
                          style={{ color: "#0F3A1A" }}
                        >
                          {formatDate(selectedApp.created_at)}
                        </p>
                      ),
                      accent: "#6d28d9",
                      bg: "#ede9fe",
                    },
                    {
                      label: "Application ID",
                      content: (
                        <p
                          className="font-semibold mt-2"
                          style={{ color: "#0F3A1A" }}
                        >
                          #{selectedApp.id}
                        </p>
                      ),
                      accent: "#0f766e",
                      bg: "#ccfbf1",
                    },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-xl p-4 border-l-4"
                      style={{
                        background: card.bg,
                        borderLeftColor: card.accent,
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: card.accent }}
                      >
                        {card.label}
                      </p>
                      <div className="mt-1">{card.content}</div>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "#1A5C2A" }}
                    >
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <h3
                      className="font-bold text-lg"
                      style={{ color: "#0F3A1A" }}
                    >
                      Application details
                    </h3>
                  </div>

                  <div
                    className="rounded-xl overflow-hidden border divide-y"
                    style={{ borderColor: "#C8E6C9" }}
                  >
                    {Object.entries(selectedApp).map(([key, value]) => {
                      if (
                        [
                          "id",
                          "type",
                          "created_at",
                          "status",
                          "reference_number",
                          "user_id",
                          "user",
                          "updated_at",
                          "deleted_at",
                        ].includes(key)
                      )
                        return null;
                      if (
                        key.toLowerCase().includes("_url") &&
                        ["building", "land", "title", "plan"].some((k) =>
                          key.toLowerCase().includes(k),
                        )
                      )
                        return null;

                      const isImagePath =
                        value &&
                        typeof value === "string" &&
                        (value.includes("uploads/") ||
                          value.includes("medical-assistance-documents/") ||
                          [
                            ".jpg",
                            ".jpeg",
                            ".png",
                            ".gif",
                            ".webp",
                            ".pdf",
                          ].some((ext) => value.includes(ext)) ||
                          ["photo", "image", "picture", "supporting"].some(
                            (k) => key.includes(k),
                          ) ||
                          (key.includes("document") &&
                            value.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/i)));
                      const isPdfFile =
                        value &&
                        typeof value === "string" &&
                        value.match(/\.pdf$/i);

                      if (isImagePath) {
                        return (
                          <div
                            key={key}
                            className="flex flex-col py-3 px-4 hover:bg-green-50 transition-colors"
                          >
                            <dt
                              className="text-sm font-semibold capitalize mb-2"
                              style={{ color: "#1A5C2A" }}
                            >
                              {key.replace(/_/g, " ")}
                            </dt>
                            <dd>
                              {isPdfFile ? (
                                <div className="flex flex-col gap-2">
                                  <div
                                    className="flex items-center gap-2 p-3 rounded-lg"
                                    style={{
                                      background: "#E8F5E9",
                                      border: "1px solid #C8E6C9",
                                    }}
                                  >
                                    <FileText
                                      className="h-5 w-5"
                                      style={{ color: "#1A5C2A" }}
                                    />
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: "#0F3A1A" }}
                                    >
                                      PDF Document
                                    </span>
                                  </div>

                                  <a
                                    href={`${IMAGE_BASE_URL}/${value}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white w-fit text-sm"
                                    style={{ background: "#1A5C2A" }}
                                  >
                                    <Eye className="h-4 w-4" /> View PDF
                                    document
                                  </a>
                                </div>
                              ) : (
                                <div
                                  className="relative w-full max-w-md h-64 rounded-lg overflow-hidden border bg-gray-50"
                                  style={{ borderColor: "#C8E6C9" }}
                                >
                                  <img
                                    src={`${IMAGE_BASE_URL}/${value}`}
                                    alt={key}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder.png";
                                    }}
                                  />
                                </div>
                              )}
                            </dd>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={key}
                          className="flex py-3 px-4 hover:bg-green-50 transition-colors"
                        >
                          <dt
                            className="text-sm font-semibold capitalize w-1/3 flex-shrink-0"
                            style={{ color: "#1A5C2A" }}
                          >
                            {key.replace(/_/g, " ")}
                          </dt>
                          <dd
                            className="text-sm flex-1 break-words"
                            style={{ color: "#0F3A1A" }}
                          >
                            {(() => {
                              if (value && typeof value === "string") {
                                const datePattern =
                                  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}.*)?$/;
                                if (datePattern.test(value)) {
                                  const d = new Date(value);
                                  if (!isNaN(d.getTime()))
                                    return formatDate(value);
                                }
                              }
                              return String(value || "N/A");
                            })()}
                          </dd>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <CitizenLayout>
      <Suspense
        fallback={
          <div
            className="min-h-screen flex items-center justify-center"
            style={{
              background: "linear-gradient(to bottom, #F0F7F1, #ffffff)",
            }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                style={{
                  borderColor: "#4CAF6B",
                  borderTopColor: "transparent",
                }}
              />
              <p className="font-medium" style={{ color: "#1A5C2A" }}>
                Loading...
              </p>
            </div>
          </div>
        }
      >
        <ApplicationsContent />
      </Suspense>
    </CitizenLayout>
  );
}
