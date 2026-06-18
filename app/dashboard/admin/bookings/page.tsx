"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Phone,
  Mail,
  Home,
  FileText,
  CreditCard,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled"
  | "rejected";
type PaymentStatus = "unpaid" | "pending_verification" | "paid" | "refunded";

interface Booking {
  id: number;
  reference_number: string;
  service_key: string;
  service_name: string;
  service_icon: string;
  full_name: string;
  email: string;
  phone: string;
  house_number: string;
  street: string;
  booking_details: Record<string, string>;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  payment_reference: string | null;
  amount_paid: number | null;
  payment_screenshot_url: string | null;
  requires_payment: boolean;
  amount: number;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  processing: {
    label: "Processing",
    bg: "bg-purple-100",
    text: "text-purple-700",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Completed",
    bg: "bg-green-100",
    text: "text-green-700",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-gray-100",
    text: "text-gray-500",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-700",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const PAYMENT_CONFIG: Record<
  PaymentStatus,
  { label: string; bg: string; text: string }
> = {
  unpaid: { label: "Unpaid", bg: "bg-gray-100", text: "text-gray-500" },
  pending_verification: {
    label: "Verifying",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  paid: { label: "Paid", bg: "bg-green-100", text: "text-green-700" },
  refunded: { label: "Refunded", bg: "bg-blue-100", text: "text-blue-700" },
};

const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "completed",
  "cancelled",
  "rejected",
];

// ─── Badge helpers ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${cfg.bg} ${cfg.text}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG.unpaid;
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Detail row helper ─────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus>("pending");

  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  useEffect(() => {
    if (!authLoading && user) fetchBookings();
  }, [authLoading, user]);

  useEffect(() => {
    if (!authLoading && user) fetchBookings();
  }, [pagination.current_page, statusFilter, paymentFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (paymentFilter !== "all")
        params.append("payment_status", paymentFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/bookings?${params}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setBookings(data.data.data || []);
          setPagination({
            current_page: data.data.current_page || 1,
            last_page: data.data.last_page || 1,
            per_page: data.data.per_page || 15,
            total: data.data.total || 0,
            from: data.data.from || 0,
            to: data.data.to || 0,
          });
        }
      } else {
        const err = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Failed to fetch bookings.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bookings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;
    try {
      setIsUpdating(true);
      const response = await fetch(
        `/api/bookings/${selectedBooking.reference_number}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Booking status updated." });
        closeModal();
        fetchBookings();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update status.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchBookings();
  };

  const handlePageChange = (page: number) =>
    setPagination((prev) => ({ ...prev, current_page: page }));

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                  <p className="text-sm text-gray-500">
                    Manage resident service requests
                  </p>
                </div>
              </div>
              <button
                onClick={fetchBookings}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ── Filters ── */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, reference, service…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination((p) => ({ ...p, current_page: 1 }));
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  {BOOKING_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Filter */}
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setPagination((p) => ({ ...p, current_page: 1 }));
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                >
                  <option value="all">All Payments</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="pending_verification">Verifying</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="mt-4 w-full sm:w-auto px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
            >
              Search
            </button>
          </div>

          {/* ── Mobile stats ── */}
          <div className="grid grid-cols-3 gap-4 sm:hidden">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Verifying</p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  bookings.filter(
                    (b) => b.payment_status === "pending_verification",
                  ).length
                }
              </p>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
                  <p className="mt-4 text-gray-600">Loading bookings...</p>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-500">
                  Bookings submitted by residents will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {[
                          "Reference",
                          "Resident",
                          "Service",
                          "Date",
                          "Status",
                          "Payment",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono font-medium text-green-700">
                              {booking.reference_number}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.full_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.house_number} {booking.street}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-lg leading-none">
                                {booking.service_icon}
                              </span>
                              <span className="text-sm text-gray-900 max-w-[140px] truncate">
                                {booking.service_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(booking.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.requires_payment ? (
                              <PaymentBadge status={booking.payment_status} />
                            ) : (
                              <span className="text-xs text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleView(booking)}
                              className="p-1.5 text-green-700 hover:bg-green-50 rounded transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {bookings.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Showing {pagination.from} to {pagination.to} of{" "}
                      {pagination.total} results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
                        disabled={pagination.current_page === 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, pagination.last_page) },
                          (_, i) => {
                            let pageNum: number;
                            if (pagination.last_page <= 5) pageNum = i + 1;
                            else if (pagination.current_page <= 3)
                              pageNum = i + 1;
                            else if (
                              pagination.current_page >=
                              pagination.last_page - 2
                            )
                              pageNum = pagination.last_page - 4 + i;
                            else pageNum = pagination.current_page - 2 + i;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                  pagination.current_page === pageNum
                                    ? "bg-green-700 text-white"
                                    : "border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}
                      </div>
                      <button
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                        disabled={
                          pagination.current_page === pagination.last_page
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Detail Modal ── */}
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div
                className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {selectedBooking.service_icon}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selectedBooking.service_name}
                    </h2>
                    <p
                      className="text-sm font-mono"
                      style={{ color: "#A5D6A7" }}
                    >
                      {selectedBooking.reference_number}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-white/60 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-4 sm:px-6 py-5 overflow-y-auto flex-1 space-y-6">
                {/* Status row */}
                <div className="flex flex-wrap gap-2 items-center">
                  <StatusBadge status={selectedBooking.status} />
                  {selectedBooking.requires_payment && (
                    <PaymentBadge status={selectedBooking.payment_status} />
                  )}
                  <span className="text-xs text-gray-400 ml-auto">
                    Submitted {formatDateTime(selectedBooking.created_at)}
                  </span>
                </div>

                {/* Resident info */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-3">
                    Resident
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailRow
                      icon={<User className="w-4 h-4" />}
                      label="Full Name"
                      value={selectedBooking.full_name}
                    />
                    <DetailRow
                      icon={<Mail className="w-4 h-4" />}
                      label="Email"
                      value={selectedBooking.email}
                    />
                    <DetailRow
                      icon={<Phone className="w-4 h-4" />}
                      label="Phone"
                      value={selectedBooking.phone}
                    />
                    <DetailRow
                      icon={<Home className="w-4 h-4" />}
                      label="Address"
                      value={`${selectedBooking.house_number} ${selectedBooking.street}`}
                    />
                  </div>
                </div>

                {/* Booking details */}
                {Object.keys(selectedBooking.booking_details || {}).length >
                  0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-3">
                      Service Details
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {Object.entries(selectedBooking.booking_details).map(
                        ([key, val]) => (
                          <div key={key} className="flex items-start gap-2">
                            <span className="text-xs text-gray-500 capitalize min-w-[120px]">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {val || "—"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Schedule */}
                {(selectedBooking.preferred_date ||
                  selectedBooking.preferred_time) && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-3">
                      Preferred Schedule
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {selectedBooking.preferred_date
                        ? formatDate(selectedBooking.preferred_date)
                        : ""}
                      {selectedBooking.preferred_time &&
                        ` at ${selectedBooking.preferred_time}`}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-2">
                      Notes
                    </p>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment info */}
                {selectedBooking.requires_payment && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-3">
                      Payment
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <DetailRow
                        icon={<CreditCard className="w-4 h-4" />}
                        label="Method"
                        value={selectedBooking.payment_method?.replace(
                          /_/g,
                          " ",
                        )}
                      />
                      <DetailRow
                        icon={<FileText className="w-4 h-4" />}
                        label="Reference"
                        value={selectedBooking.payment_reference}
                      />
                      <DetailRow
                        icon={<AlertCircle className="w-4 h-4" />}
                        label="Amount Paid"
                        value={
                          selectedBooking.amount_paid != null
                            ? `₱${Number(selectedBooking.amount_paid).toFixed(2)}`
                            : null
                        }
                      />
                      <DetailRow
                        icon={<AlertCircle className="w-4 h-4" />}
                        label="Required Amount"
                        value={`₱${Number(selectedBooking.amount).toFixed(2)}`}
                      />
                    </div>
                    {selectedBooking.payment_screenshot_url && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5" /> Payment
                          Screenshot
                        </p>
                        <a
                          href={selectedBooking.payment_screenshot_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedBooking.payment_screenshot_url}
                            alt="Payment screenshot"
                            className="max-h-48 rounded-lg border border-gray-200 object-cover hover:opacity-90 transition-opacity cursor-zoom-in"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Update Status */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-3">
                    Update Status
                  </p>
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as BookingStatus)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-4 sm:px-6 py-3 flex-shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || newStatus === selectedBooking.status}
                  className="w-full sm:w-auto px-6 py-2 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #0F3A1A, #1A5C2A)",
                  }}
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Status"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
