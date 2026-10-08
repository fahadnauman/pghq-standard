"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  Check,
  RefreshCw,
  Plus,
  QrCode,
  Droplets,
  Zap,
  Fan,
  Hammer,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Phone,
  User,
  Layers,
  ArrowRight,
  Eye,
  X,
  Building2,
  Calendar,
} from "lucide-react";
import type { MaintenanceTask, MaintenanceStatus, MaintenanceCategory } from "@/types";
import RoomQrModal from "@/components/rooms/room-qr-modal";
import { mockFloors, mockRoomsByFloor } from "@/data/mock-rooms";

/* ─── Category Visual Mappings ──────────────────────────────── */

const categoryMeta: Record<
  MaintenanceCategory,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  PLUMBING: {
    label: "Plumbing",
    icon: Droplets,
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
  },
  ELECTRICAL: {
    label: "Electrical",
    icon: Zap,
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  AC_VENTILATION: {
    label: "AC & Fan",
    icon: Fan,
    badgeClass: "bg-cyan-50 text-cyan-800 border-cyan-200",
  },
  CARPENTRY: {
    label: "Furniture / Lock",
    icon: Hammer,
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  CLEANING: {
    label: "Cleaning",
    icon: Sparkles,
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
  },
  OTHER: {
    label: "General / Other",
    icon: HelpCircle,
    badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
  },
};

const statusMeta: Record<
  MaintenanceStatus,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending Review",
    badgeClass: "bg-amber-50 text-amber-900 border-amber-300 font-extrabold",
    icon: AlertTriangle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-blue-900 border-blue-300 font-extrabold",
    icon: Clock,
  },
  RESOLVED: {
    label: "Resolved",
    badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-300 font-extrabold",
    icon: CheckCircle2,
  },
};

export default function OwnerMaintenancePage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"ALL" | MaintenanceStatus>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | MaintenanceCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);
  const [qrModalRoom, setQrModalRoom] = useState<{ id: string; roomNumber: string; floorId: string; roomType: "DOUBLE"; beds: [] } | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual create form state
  const [manualRoomNumber, setManualRoomNumber] = useState("101");
  const [manualCategory, setManualCategory] = useState<MaintenanceCategory>("PLUMBING");
  const [manualDescription, setManualDescription] = useState("");
  const [manualTenantName, setManualTenantName] = useState("");
  const [isCreatingManual, setIsCreatingManual] = useState(false);

  // Fetch tasks
  const fetchTasks = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const res = await fetch("/api/maintenance");
      const data = await res.json();
      if (data.success && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to load maintenance tasks:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Quick action: Update status
  const handleUpdateStatus = async (id: string, newStatus: MaintenanceStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
    );

    try {
      await fetch("/api/maintenance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchTasks();
    }
  };

  // Quick action: Delete task
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this maintenance task?")) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await fetch(`/api/maintenance?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete task:", err);
      fetchTasks();
    }
  };

  // Manual task submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRoomNumber || !manualDescription) return;

    setIsCreatingManual(true);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: manualRoomNumber,
          category: manualCategory,
          description: manualDescription,
          tenantName: manualTenantName || null,
        }),
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks((prev) => [data.task, ...prev]);
        setShowManualModal(false);
        setManualDescription("");
        setManualTenantName("");
      }
    } catch (err) {
      console.error("Failed to create manual task:", err);
    } finally {
      setIsCreatingManual(false);
    }
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
      if (categoryFilter !== "ALL" && task.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesRoom = task.roomNumber.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesId = task.id.toLowerCase().includes(query);
        const matchesTenant = (task.tenantName || "").toLowerCase().includes(query);
        return matchesRoom || matchesDesc || matchesId || matchesTenant;
      }
      return true;
    });
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "PENDING").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const resolved = tasks.filter((t) => t.status === "RESOLVED").length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;
    return { total, pending, inProgress, resolved, resolutionRate };
  }, [tasks]);

  const formatRelativeTime = (isoString: string) => {
    try {
      const diff = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diff / (1000 * 60));
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header Card ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Maintenance &amp; Repairs
                </h1>
                {stats.pending > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                    {stats.pending} Needs Attention
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                QR-enabled room tickets, technician dispatch, and resolution tracking.
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTasks(true)}
              disabled={isRefreshing}
              title="Refresh tickets"
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-default cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/dashboard/rooms"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-default"
            >
              <QrCode className="w-4 h-4 text-slate-500" />
              <span>Room QR Cards</span>
            </Link>

            <button
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-default shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Issue</span>
            </button>
          </div>
        </div>

        {/* ── KPI Stat Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2 border-t border-slate-100">
          {/* Total */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Issues
              </span>
              <Wrench className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tabular-nums">
              {stats.total}
            </p>
          </div>

          {/* Pending */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Pending
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-950 mt-1 tabular-nums">
              {stats.pending}
            </p>
          </div>

          {/* In Progress */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-blue-50/80 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                In Progress
              </span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-blue-950 mt-1 tabular-nums">
              {stats.inProgress}
            </p>
          </div>

          {/* Resolved */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Resolved
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-xl sm:text-2xl font-black text-emerald-950 tabular-nums">
                {stats.resolved}
              </p>
              <span className="text-xs font-bold text-emerald-700">
                ({stats.resolutionRate}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Row ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          {(
            [
              { id: "ALL", label: "All Tickets", count: stats.total },
              { id: "PENDING", label: "Pending", count: stats.pending },
              { id: "IN_PROGRESS", label: "In Progress", count: stats.inProgress },
              { id: "RESOLVED", label: "Resolved", count: stats.resolved },
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-default cursor-pointer min-h-[36px] ${
                  isActive
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-white text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Room # (e.g. 101), ID, issue keywords, or tenant..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-slate-900 outline-none transition-default"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 hidden sm:inline shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as "ALL" | MaintenanceCategory)
              }
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="PLUMBING">🚰 Plumbing</option>
              <option value="ELECTRICAL">⚡ Electrical</option>
              <option value="AC_VENTILATION">❄️ AC &amp; Fan</option>
              <option value="CARPENTRY">🪑 Furniture / Lock</option>
              <option value="CLEANING">🧹 Cleaning</option>
              <option value="OTHER">🔧 General / Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Task Cards List ──────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center card-shadow">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading Maintenance Feed...
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center card-shadow space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            No Maintenance Tasks Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL"
              ? "No tasks match your selected filters. Try resetting the search or category."
              : "All room maintenance tickets are resolved. Everything is in pristine order!"}
          </p>
          {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-blue-600 hover:underline pt-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const cat = categoryMeta[task.category] || categoryMeta.OTHER;
            const status = statusMeta[task.status] || statusMeta.PENDING;
            const CatIcon = cat.icon;
            const StatusIcon = status.icon;

            return (
              <div
                key={task.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 sm:p-5 card-shadow transition-default flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Room Badge, Category & Description */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  {/* Top Bar: Room + Category + Status + Timestamp */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Room Pill */}
                    <button
                      onClick={() =>
                        setQrModalRoom({
                          id: task.roomId,
                          roomNumber: task.roomNumber,
                          floorId: "floor-1",
                          roomType: "DOUBLE",
                          beds: [],
                        })
                      }
                      title="View / Print QR for this room"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-default cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Room {task.roomNumber}</span>
                      <QrCode className="w-3 h-3 text-slate-300" />
                    </button>

                    {/* Category */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${cat.badgeClass}`}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${status.badgeClass}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{status.label}</span>
                    </span>

                    {/* Relative Time */}
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-1 ml-auto sm:ml-0">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{formatRelativeTime(task.createdAt)}</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                      {task.id}
                    </span>
                  </div>

                  {/* Issue Description */}
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed break-words">
                    {task.description}
                  </p>

                  {/* Tenant & Attachment row */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                    {task.tenantName && (
                      <span className="inline-flex items-center gap-1 font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reported by: <strong className="text-slate-800">{task.tenantName}</strong></span>
                      </span>
                    )}

                    {task.tenantPhone && (
                      <a
                        href={`tel:${task.tenantPhone}`}
                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{task.tenantPhone}</span>
                      </a>
                    )}

                    {task.photoUrl && (
                      <button
                        onClick={() => setZoomedPhoto(task.photoUrl!)}
                        className="inline-flex items-center gap-1 font-bold text-slate-800 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-default cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Attached Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Quick Action Controls */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                  {task.status !== "RESOLVED" ? (
                    <button
                      onClick={() => handleUpdateStatus(task.id, "RESOLVED")}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-default cursor-pointer min-h-[40px] shadow-2xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(task.id, "PENDING")}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-default cursor-pointer min-h-[40px]"
                    >
                      <span>Reopen Task</span>
                    </button>
                  )}

                  {task.status === "PENDING" && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs transition-default cursor-pointer min-h-[40px]"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>In Progress</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-default cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Photo Zoom Modal ─────────────────────────────────── */}
      {zoomedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden p-3 card-shadow space-y-3">
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-sm font-bold text-slate-900">Maintenance Photo Evidence</span>
              <button
                onClick={() => setZoomedPhoto(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[75vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedPhoto}
                alt="Enlarged maintenance photo"
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Room QR Modal ─────────────────────────────────────── */}
      {qrModalRoom && (
        <RoomQrModal
          room={qrModalRoom as any}
          propertyTitle="Naalukettu Hostel"
          isOpen={!!qrModalRoom}
          onClose={() => setQrModalRoom(null)}
        />
      )}

      {/* ── Manual Issue Creation Modal ───────────────────────── */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-slate-900" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Log Maintenance Issue
                </h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Room Number *
                </label>
                <input
                  type="text"
                  required
                  value={manualRoomNumber}
                  onChange={(e) => setManualRoomNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. 101, G02, 203"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus-ring"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Category *
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) =>
                    setManualCategory(e.target.value as MaintenanceCategory)
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 cursor-pointer focus-ring"
                >
                  <option value="PLUMBING">🚰 Plumbing</option>
                  <option value="ELECTRICAL">⚡ Electrical</option>
                  <option value="AC_VENTILATION">❄️ AC &amp; Fan</option>
                  <option value="CARPENTRY">🪑 Furniture / Lock</option>
                  <option value="CLEANING">🧹 Cleaning</option>
                  <option value="OTHER">🔧 Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Issue Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder="Describe repair or issue needed..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus-ring resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Tenant Name (Optional)
                </label>
                <input
                  type="text"
                  value={manualTenantName}
                  onChange={(e) => setManualTenantName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus-ring"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingManual}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {isCreatingManual ? "Logging..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
