"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Camera,
  X,
  Send,
  Droplets,
  Zap,
  Fan,
  Hammer,
  Sparkles,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  User,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import type { MaintenanceCategory } from "@/types";

/* ─── Category Configuration ────────────────────────────────── */

interface CategoryConfig {
  id: MaintenanceCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  suggestions: string[];
}

const categories: CategoryConfig[] = [
  {
    id: "PLUMBING",
    label: "Plumbing",
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    suggestions: [
      "Washroom tap leaking / dripping",
      "Geyser not heating water",
      "Floor drain water clogged",
      "Flush tank not refilling",
      "Low water pressure in shower",
    ],
  },
  {
    id: "ELECTRICAL",
    label: "Electrical",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    suggestions: [
      "Switchboard sparking / loose socket",
      "Main ceiling tube light flickering",
      "Bedside charging point not working",
      "MCB trip / power cut in room",
      "Exhaust fan not spinning",
    ],
  },
  {
    id: "AC_VENTILATION",
    label: "AC & Fan",
    icon: Fan,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    suggestions: [
      "AC not cooling / blowing warm air",
      "AC leaking water inside room",
      "Ceiling fan making squeaking noise",
      "AC remote battery dead / unresponsive",
    ],
  },
  {
    id: "CARPENTRY",
    label: "Furniture & Lock",
    icon: Hammer,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    suggestions: [
      "Door latch / lock jammed",
      "Wardrobe hinge loose or door stuck",
      "Bed wooden plank creaking / broken",
      "Study table drawer stuck",
    ],
  },
  {
    id: "CLEANING",
    label: "Cleaning",
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    suggestions: [
      "Washroom deep cleaning requested",
      "Room floor mopping required",
      "Dustbin clearance needed",
      "Window sliding mesh dusty",
    ],
  },
  {
    id: "OTHER",
    label: "Other Issue",
    icon: HelpCircle,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    suggestions: [
      "Wi-Fi signal weak or disconnecting",
      "Pest control / mosquitoes in room",
      "Drinking water dispenser empty on floor",
      "General noise complaint",
    ],
  },
];

/* ─── Main Form Inner Component (handles search params) ──────── */

function MaintenanceReportForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialRoom =
    searchParams.get("roomNumber") ||
    searchParams.get("room") ||
    "101";

  const [roomNumber, setRoomNumber] = useState<string>(initialRoom);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [category, setCategory] = useState<MaintenanceCategory>("PLUMBING");
  const [description, setDescription] = useState<string>("");
  const [tenantName, setTenantName] = useState<string>("");
  const [tenantPhone, setTenantPhone] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    roomNumber: string;
    category: MaintenanceCategory;
    description: string;
    createdAt: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCategoryConfig =
    categories.find((c) => c.id === category) || categories[0];

  const handleSuggestionClick = (suggestion: string) => {
    setDescription((prev) => {
      if (!prev.trim()) return suggestion;
      return `${prev}. ${suggestion}`;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is larger than 5MB. Please choose a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!roomNumber.trim()) {
      setErrorMessage("Please specify your Room Number.");
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      setErrorMessage("Please provide a brief description of the issue (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: roomNumber.trim().toUpperCase(),
          category,
          description: description.trim(),
          photoUrl: photoPreview,
          tenantName: tenantName.trim() || null,
          tenantPhone: tenantPhone.trim() || null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmittedTicket({
          id: data.task.id,
          roomNumber: data.task.roomNumber,
          category: data.task.category,
          description: data.task.description,
          createdAt: data.task.createdAt,
        });
        // Scroll to top for confirmation view
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        setErrorMessage(data.error || "Failed to submit request. Please try again.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNew = () => {
    setSubmittedTicket(null);
    setDescription("");
    setPhotoPreview(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Success Confirmation Screen ─────────────────────────────
  if (submittedTicket) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 card-shadow space-y-6 animate-slide-up text-center">
        {/* Big Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Ticket Logged
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Maintenance Ticket Created!
          </h2>
          <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto">
            Our property maintenance team has received your ticket and will inspect Room{" "}
            <span className="font-extrabold text-slate-900">{submittedTicket.roomNumber}</span> shortly.
          </p>
        </div>

        {/* Ticket Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Ticket Reference ID
              </span>
              <span className="text-base font-black text-slate-950 font-mono">
                {submittedTicket.id}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              PENDING REVIEW
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">Room:</span>
              <span className="font-bold text-slate-900 text-sm">Room {submittedTicket.roomNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Category:</span>
              <span className="font-bold text-slate-900">{submittedTicket.category}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 text-xs font-semibold block">Issue Details:</span>
            <p className="text-xs font-medium text-slate-800 mt-0.5 line-clamp-3 bg-white p-2.5 rounded-lg border border-slate-200">
              {submittedTicket.description}
            </p>
          </div>
        </div>

        {/* Expected SLA Banner */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-left">
          <Clock className="w-5 h-5 text-blue-700 shrink-0" />
          <div className="text-xs text-blue-950">
            <span className="font-bold block">Typical Response Time: 1–4 Hours</span>
            A technician will contact or visit your room during daytime maintenance hours.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleResetForNew}
            className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-default cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <Wrench className="w-4 h-4" />
            <span>Report Another Issue</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full min-h-[44px] bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-default flex items-center justify-center gap-1.5"
          >
            <span>Return to Hostel Overview</span>
          </Link>
        </div>
      </div>
    );
  }

  // ── Reporting Form ──────────────────────────────────────────
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* ── Top Header Card ───────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 card-shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-slate-800" />
            <span>Sunrise PG Hostel</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Instant QR Portal
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Report Room Maintenance
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Direct 1-tap repair dispatch for hostel residents. No password or login required.
          </p>
        </div>

        {/* ── Room Badge & Switcher ────────────────────────── */}
        <div className="pt-2">
          {!isEditingRoom ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-2xs">
                  {roomNumber}
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Reporting for Room
                  </span>
                  <span className="text-base font-extrabold text-slate-950">
                    Room {roomNumber}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingRoom(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-default cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border-2 border-blue-400 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Enter your Room Number:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. 101, G02, 203"
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 uppercase focus-ring"
                />
                <button
                  type="button"
                  onClick={() => setIsEditingRoom(false)}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-default cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Form ─────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 card-shadow space-y-5"
      >
        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── 1. Category Selector ────────────────────────── */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center justify-between">
            <span>1. Select Issue Category *</span>
            <span className="text-[11px] font-semibold text-slate-400">Tap to select</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => {
              const isSelected = category === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-start p-3 rounded-2xl border-2 transition-all cursor-pointer text-left min-h-[76px] ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-xs scale-[1.01]"
                      : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : `${cat.bgColor} ${cat.color}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold leading-tight line-clamp-1">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. Quick Suggestions ────────────────────────── */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Common {activeCategoryConfig.label} Issues (Tap to add):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeCategoryConfig.suggestions.map((sugg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(sugg)}
                className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-default cursor-pointer text-left"
              >
                + {sugg}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. Issue Description ────────────────────────── */}
        <div className="space-y-1.5">
          <label
            htmlFor="description-input"
            className="text-xs sm:text-sm font-black text-slate-900 flex items-center justify-between"
          >
            <span>2. Describe the Issue *</span>
            <span className="text-[11px] font-semibold text-slate-400">
              {description.length} chars
            </span>
          </label>
          <textarea
            id="description-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Washroom tap is leaking heavily since morning, or bed 2 ceiling fan squeaks..."
            required
            className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:bg-white rounded-2xl p-3.5 text-sm font-medium text-slate-900 outline-none transition-default resize-none"
          />
        </div>

        {/* ── 4. Optional Photo Attachment ────────────────── */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>3. Attach Photo (Optional)</span>
            <span className="text-[11px] font-semibold text-slate-500">Helps handyman diagnose</span>
          </label>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload-input"
          />

          {!photoPreview ? (
            <label
              htmlFor="photo-upload-input"
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 transition-default cursor-pointer text-slate-600 min-h-[52px]"
            >
              <Camera className="w-5 h-5 text-slate-500" />
              <span className="text-xs sm:text-sm font-bold">
                Tap to Take Photo or Upload
              </span>
            </label>
          ) : (
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 p-1 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Maintenance photo preview"
                className="max-h-48 rounded-xl object-contain mx-auto"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-950 transition-default cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── 5. Optional Tenant Contact Info ─────────────── */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Contact Info (Optional)
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              In case technician needs to coordinate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus-ring"
              />
            </div>
            <div className="relative">
              <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                value={tenantPhone}
                onChange={(e) => setTenantPhone(e.target.value)}
                placeholder="Phone / WhatsApp (Optional)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus-ring"
              />
            </div>
          </div>
        </div>

        {/* ── Submit Action ─────────────────────────────────── */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[54px] bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition-default disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Logging Ticket...</span>
              </div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Maintenance Request</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 font-medium mt-2">
            Instant owner dispatch · Naalukettu Hostel
          </p>
        </div>
      </form>

      {/* ── Quick Footer ──────────────────────────────────── */}
      <div className="text-center space-y-1 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Naalukettu Hostel · Automated Hostel Maintenance</p>
        <p>Emergency? Contact the hostel warden or front desk directly.</p>
      </div>
    </div>
  );
}

/* ─── Page Wrapper with Suspense for Next.js prerendering ─────── */

export default function MaintenanceReportPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-3.5 sm:px-6">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
            <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider">Loading Portal...</p>
          </div>
        }
      >
        <MaintenanceReportForm />
      </Suspense>
    </div>
  );
}
