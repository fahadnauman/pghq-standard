"use client";

import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import {
  CreditCard,
  UtensilsCrossed,
  Wrench,
  Building2,
  Smartphone,
  Copy,
  Check,
  Upload,
  Camera,
  X,
  Send,
  Coffee,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Phone,
  Droplets,
  Zap,
  Fan,
  Hammer,
  Sparkles,
  HelpCircle,
  RefreshCw,
  SmartphoneNfc,
  Star,
} from "lucide-react";
import type { OwnerSettings, MaintenanceCategory, MaintenanceTask } from "@/types";

/* ─── Celebratory Success Modal ─────────────────────────────── */

interface SuccessModalProps {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
}

function SuccessModal({ open, title, body, onClose }: SuccessModalProps) {
  // Auto-close after 4 seconds
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl animate-bounce-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mb-4 shadow-inner">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>

        {/* Stars decoration */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-amber-400 fill-amber-400"
            />
          ))}
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-2">{title}</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{body}</p>

        {/* Auto-dismiss notice */}
        <p className="text-[11px] text-slate-400 mt-4 font-medium">
          This message will close automatically…
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold rounded-xl transition-colors cursor-pointer"
        >
          Got it, thanks! 🙌
        </button>
      </div>
    </div>
  );
}

/* ─── Maintenance Categories ────────────────────────────────── */

const maintenanceCategories: {
  id: MaintenanceCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  suggestions: string[];
}[] = [
  {
    id: "PLUMBING",
    label: "Plumbing",
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    suggestions: ["Tap leaking / dripping", "Geyser not heating", "Floor drain clogged", "Flush tank issue"],
  },
  {
    id: "ELECTRICAL",
    label: "Electrical",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    suggestions: ["Socket loose / sparking", "Tube light flickering", "Bedside charging point dead", "MCB tripped"],
  },
  {
    id: "AC_VENTILATION",
    label: "AC & Fan",
    icon: Fan,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    suggestions: ["AC not cooling / warm air", "AC leaking water", "Ceiling fan making noise", "Remote unresponsive"],
  },
  {
    id: "CARPENTRY",
    label: "Lock & Wood",
    icon: Hammer,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    suggestions: ["Door lock jammed", "Wardrobe hinge loose", "Bed wooden plank creaking", "Drawer stuck"],
  },
  {
    id: "CLEANING",
    label: "Cleaning",
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    suggestions: ["Deep washroom cleaning", "Floor mopping requested", "Dustbin clearance", "Window mesh dusty"],
  },
  {
    id: "OTHER",
    label: "Other",
    icon: HelpCircle,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    suggestions: ["Wi-Fi connectivity issue", "Water dispenser empty on floor", "Pest control needed"],
  },
];

/* ─── Main Hub Content Component ────────────────────────────── */

function TenantPortalContent({ roomId }: { roomId: string }) {
  const searchParams = useSearchParams();
  const roomParam = roomId || searchParams.get("room") || searchParams.get("roomNumber") || "R01";

  const [activeTab, setActiveTab] = useState<"PAY" | "MESS" | "MAINTENANCE">("PAY");
  const [currentRoom, setCurrentRoom] = useState<string>(roomParam.toUpperCase());

  // Owner Settings
  const [settings, setSettings] = useState<OwnerSettings>({
    propertyName: "Ideal Hostel",
    ownerName: "Fahad Nauman",
    ownerPhone: "+91 98765 00000",
    upiId: "idealhostel@okhdfcbank",
    merchantName: "Ideal Enterprises",
    qrImageUrl: null,
    paymentInstructions:
      "Please mention your Room Number & Month in UPI remarks. Upload screenshot or enter your 12-digit UTR number below for immediate receipt clearance.",
    breakfastWindow: "07:30 AM - 09:30 AM",
    lunchWindow: "01:00 PM - 03:00 PM",
    dinnerWindow: "08:00 PM - 10:00 PM",
    updatedAt: new Date().toISOString(),
  });

  // Room Tenant Info
  const [tenantInfo, setTenantInfo] = useState<{
    name: string;
    monthlyRent: number;
    paymentStatus: string;
  }>({
    name: "Room Resident",
    monthlyRent: 4500,
    paymentStatus: "UNPAID",
  });

  // Pay Rent State
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(4500);
  const [transactionId, setTransactionId] = useState("");
  const [tenantNameInput, setTenantNameInput] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState<string | null>(null);
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const proofFileRef = useRef<HTMLInputElement>(null);

  // Mess Headcount State
  const [bfastOpt, setBfastOpt] = useState(true);
  const [lunchOpt, setLunchOpt] = useState(true);
  const [dinnerOpt, setDinnerOpt] = useState(true);
  const [mealToast, setMealToast] = useState<string | null>(null);

  // Maintenance State
  const [maintCategory, setMaintCategory] = useState<MaintenanceCategory>("PLUMBING");
  const [maintDesc, setMaintDesc] = useState("");
  const [maintPhoto, setMaintPhoto] = useState<string | null>(null);
  const [maintName, setMaintName] = useState("");
  const [maintPhone, setMaintPhone] = useState("");
  const [isSubmittingMaint, setIsSubmittingMaint] = useState(false);
  const [maintSubmittedTicket, setMaintSubmittedTicket] = useState<{
    id: string;
    category: string;
    createdAt: string;
  } | null>(null);
  const [existingRoomTickets, setExistingRoomTickets] = useState<MaintenanceTask[]>([]);
  const maintPhotoRef = useRef<HTMLInputElement>(null);

  // Celebratory Success Modal State
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    title: string;
    body: string;
  }>({ open: false, title: "", body: "" });

  const showSuccess = useCallback((title: string, body: string) => {
    setSuccessModal({ open: true, title, body });
  }, []);

  const closeSuccess = useCallback(() => {
    setSuccessModal((prev) => ({ ...prev, open: false }));
  }, []);

  // Fetch Settings, Tenant info, & existing room tickets
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Settings
        const sRes = await fetch("/api/settings");
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.settings) setSettings(sData.settings);
        }

        // Fetch Room Tenant
        const tRes = await fetch(`/api/tenants?room=${encodeURIComponent(currentRoom)}`);
        if (tRes.ok) {
          const tData = await tRes.json();
          if (tData.tenants && tData.tenants.length > 0) {
            const firstT = tData.tenants[0];
            setTenantInfo({
              name: firstT.name,
              monthlyRent: firstT.monthlyRent || 4500,
              paymentStatus: firstT.paymentStatus || "UNPAID",
            });
            setPayAmount(firstT.monthlyRent || 4500);
            setTenantNameInput(firstT.name);
            setMaintName(firstT.name);
            setMaintPhone(firstT.phone);
          }
        }

        // Fetch Existing Room Tickets
        const mRes = await fetch(`/api/maintenance?room=${encodeURIComponent(currentRoom)}`);
        if (mRes.ok) {
          const mData = await mRes.json();
          if (mData.tasks) {
            setExistingRoomTickets(mData.tasks.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error loading hub context:", err);
      }
    }
    loadData();
  }, [currentRoom]);

  // Copy UPI ID helper
  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(settings.upiId || "");
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch (err) {
      console.error("Failed to copy UPI ID:", err);
    }
  };

  // Proof screenshot upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Screenshot is larger than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentScreenshot(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Payment Proof
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim() || transactionId.trim().length !== 12) {
      alert("Please provide your 12-digit UPI Transaction Reference ID (UTR).");
      return;
    }

    setIsSubmittingProof(true);
    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: currentRoom,
          tenantName: tenantNameInput || tenantInfo.name,
          amount: payAmount,
          transactionId: transactionId.trim(),
          screenshotUrl: paymentScreenshot,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProofSubmitted(data.submission?.id || "SUB-CONFIRMED");
        setShowVerificationForm(false);
        showSuccess(
          "Applied Successfully! 🎉",
          "Your rent payment reference has been sent to the property owner. They will verify and update your ledger shortly."
        );
      } else {
        const errorData = await res.json().catch(() => null);
        alert(`Failed to record payment submission: ${errorData?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error submitting payment proof:", err);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmittingProof(false);
    }
  };

  // Toggle Meal Status
  const handleMealToggle = async (type: "BREAKFAST" | "LUNCH" | "DINNER", currentVal: boolean) => {
    const newVal = !currentVal;
    if (type === "BREAKFAST") setBfastOpt(newVal);
    if (type === "LUNCH") setLunchOpt(newVal);
    if (type === "DINNER") setDinnerOpt(newVal);

    try {
      await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: currentRoom,
          tenantName: tenantInfo.name,
          mealType: type,
          status: newVal ? "OPTED_IN" : "SKIPPED",
        }),
      });

      const label = type.charAt(0) + type.slice(1).toLowerCase();
      const newStatus = newVal ? "Opted In ✓" : "Skipping today";
      setMealToast(
        newVal
          ? `${label} headcount updated: You're OPTED IN.`
          : `${label} headcount updated: Marked as SKIPPING.`
      );
      showSuccess(
        "Applied Successfully! 🍽️",
        `Your ${label.toLowerCase()} preference (${newStatus}) has been sent to the property owner's kitchen team.`
      );
      setTimeout(() => setMealToast(null), 3000);
    } catch (err) {
      console.error("Failed to update meal status:", err);
    }
  };

  // Submit Maintenance Request
  const handleSubmitMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintDesc.trim() || maintDesc.trim().length < 5) {
      alert("Please provide a description of the issue (at least 5 characters).");
      return;
    }

    setIsSubmittingMaint(true);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: currentRoom,
          category: maintCategory,
          description: maintDesc.trim(),
          photoUrl: maintPhoto,
          tenantName: maintName.trim() || tenantInfo.name,
          tenantPhone: maintPhone.trim() || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMaintSubmittedTicket({
          id: data.task.id,
          category: data.task.category,
          createdAt: data.task.createdAt,
        });
        // Refresh active room tickets
        setExistingRoomTickets((prev) => [data.task, ...prev]);
        setMaintDesc("");
        setMaintPhoto(null);
        showSuccess(
          "Applied Successfully! 🔧",
          "Your repair request has been sent to the property owner. The maintenance team will attend to it as soon as possible."
        );
      } else {
        const errorData = await res.json().catch(() => null);
        const errMsg = errorData?.error || "Failed to submit maintenance request.";
        console.error("API Error Response:", errorData);
        alert(`Server Error: ${errMsg}`);
      }
    } catch (err) {
      console.error("Error creating maintenance ticket:", err);
      alert("Network error submitting repair ticket.");
    } finally {
      setIsSubmittingMaint(false);
    }
  };

  // Direct UPI Intent deep link for mobile devices
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(
    settings.upiId || ""
  )}&pn=${encodeURIComponent(
    settings.merchantName || settings.propertyName || ""
  )}&am=${payAmount}&tn=Room%20${encodeURIComponent(
    currentRoom
  )}%20Rent&cu=INR`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 lg:p-8 font-sans">
      {/* ── Desktop Context Header (Hidden on Mobile) ── */}
      <div className="w-full max-w-md mb-4 hidden sm:flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-slate-800 hover:text-blue-600 transition-colors"
        >
          <Building2 className="w-4 h-4" />
          <span>PGHQ Owner Dashboard</span>
        </Link>
        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
          Live Mobile-First QR Hub
        </span>
      </div>

      {/* ── Mobile Container ── */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[820px]">
        {/* ── Top Brand & Room Header ── */}
        <div className="bg-slate-900 text-white p-5 pt-6 pb-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-xs text-emerald-400">
                HQ
              </div>
              <div>
                <h1 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {settings.propertyName}
                </h1>
                <p className="text-lg font-black tracking-tight leading-tight">
                  Room {currentRoom} Hub
                </p>
              </div>
            </div>

            {/* Room Switcher for testing/demo */}
            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700 rounded-xl px-2 py-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase">Room:</span>
              <select
                value={currentRoom}
                onChange={(e) => setCurrentRoom(e.target.value)}
                className="bg-transparent text-white font-black text-xs outline-none cursor-pointer"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(num => {
                  const r = `R${num.toString().padStart(2, '0')}`;
                  return <option key={r} value={r} className="text-slate-900">{r}</option>;
                })}
              </select>
            </div>
          </div>

          {/* Resident Greeting Banner */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400">
              Welcome, <strong className="text-white">{tenantInfo.name}</strong>
            </span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
              Door QR Verified
            </span>
          </div>
        </div>

        {/* ── 3 Primary Action Tabs (Thumb Friendly) ── */}
        <div className="grid grid-cols-3 bg-slate-100 p-1.5 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("PAY")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === "PAY"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black"
                : "text-slate-600 hover:text-slate-900 font-bold"
            }`}
          >
            <CreditCard
              className={`w-4 h-4 mb-1 ${activeTab === "PAY" ? "text-slate-900" : "text-slate-500"}`}
            />
            <span className="text-xs">1. Pay Rent</span>
          </button>

          <button
            onClick={() => setActiveTab("MESS")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === "MESS"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black"
                : "text-slate-600 hover:text-slate-900 font-bold"
            }`}
          >
            <UtensilsCrossed
              className={`w-4 h-4 mb-1 ${activeTab === "MESS" ? "text-orange-600" : "text-slate-500"}`}
            />
            <span className="text-xs">2. Mess Meals</span>
          </button>

          <button
            onClick={() => setActiveTab("MAINTENANCE")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === "MAINTENANCE"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black"
                : "text-slate-600 hover:text-slate-900 font-bold"
            }`}
          >
            <Wrench
              className={`w-4 h-4 mb-1 ${activeTab === "MAINTENANCE" ? "text-blue-600" : "text-slate-500"}`}
            />
            <span className="text-xs">3. Repairs</span>
          </button>
        </div>

        {/* ── Body Content by Tab ── */}
        <div className="flex-1 bg-slate-50 p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* ═══════════════════════════════════════════════════ */}
          {/* TAB 1: PAY RENT (GPAY / UPI INTEGRATION)            */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === "PAY" && (
            <div className="space-y-4 animate-slide-up">
              {/* Rent Amount Card */}
              <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-xs text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold uppercase tracking-wider">
                  <SmartphoneNfc className="w-3.5 h-3.5 text-blue-600" />
                  <span>Instant UPI / GPay Transfer</span>
                </div>

                <div className="pt-1">
                  <span className="text-xs font-semibold text-slate-500 block">
                    Monthly Rent for Room {currentRoom}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-3xl font-black text-slate-950 tabular-nums">
                    <span>₹</span>
                    <span>{payAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* ── Owner Custom QR Image or Dynamic QR Code ── */}
                <div className="pt-2">
                  <div className="inline-block p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-inner mx-auto">
                    {settings.qrImageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={settings.qrImageUrl}
                        alt="Owner GPay QR Standee"
                        className="w-48 h-48 object-contain mx-auto rounded-lg"
                      />
                    ) : (
                      <QRCodeSVG
                        value={upiIntentUri}
                        size={190}
                        level="H"
                        marginSize={1}
                        className="rounded-lg"
                      />
                    )}
                  </div>

                  <p className="text-xs font-extrabold text-slate-900 mt-2">
                    {settings.merchantName || settings.propertyName}
                  </p>
                </div>

                {/* UPI VPA Copy Bar */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left mt-2">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Owner UPI ID / VPA:
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900 truncate block select-all">
                      {settings.upiId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition-default shrink-0 flex items-center gap-1"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy VPA</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 1-Tap Mobile UPI Intent Button (Opens GPay / PhonePe directly) */}
                <a
                  href={upiIntentUri}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setTimeout(() => setShowPaymentConfirmModal(true), 1500)}
                  className="w-full min-h-[50px] bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-default cursor-pointer mt-3"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Open in Google Pay / UPI App</span>
                </a>
                
                <button
                  onClick={() => setShowPaymentConfirmModal(true)}
                  className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl transition-default cursor-pointer"
                >
                  I have completed the payment
                </button>
              </div>

              {/* Owner Payment Instructions */}
              {settings.paymentInstructions && (
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Payment Verification Instructions</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-blue-900">
                    {settings.paymentInstructions}
                  </p>
                </div>
              )}

              {/* Payment Proof Submission Form */}
              {showVerificationForm && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 animate-slide-up">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Step 2: Submit Payment Confirmation
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Zero-Friction
                    </span>
                  </div>

                  {proofSubmitted ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-emerald-950">
                        Payment Submitted for Verification!
                      </h4>
                      <p className="text-xs text-emerald-800">
                        Reference <span className="font-mono font-bold">{proofSubmitted}</span>. The hostel manager has received your submission and will verify your ledger shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setProofSubmitted(null);
                          setTransactionId("");
                          setPaymentScreenshot(null);
                        }}
                        className="text-xs font-bold text-emerald-800 underline mt-2"
                      >
                        Submit another reference
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitProof} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={tenantNameInput}
                          onChange={(e) => setTenantNameInput(e.target.value)}
                          placeholder="e.g. Ravi Kumar"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          12-Digit UPI Transaction ID / UTR *
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g. 428910023419 or UPI ref"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus-ring"
                        />
                      </div>

                      {/* Screenshot Upload Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                          <span>Upload Screenshot (Recommended)</span>
                          <span className="text-[10px] text-slate-400">GPay receipt</span>
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          ref={proofFileRef}
                          onChange={handleScreenshotUpload}
                          className="hidden"
                          id="proof-screenshot-upload"
                        />

                        {!paymentScreenshot ? (
                          <label
                            htmlFor="proof-screenshot-upload"
                            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-default cursor-pointer text-slate-600 text-xs font-bold min-h-[44px]"
                          >
                            <Camera className="w-4 h-4 text-slate-500" />
                            <span>Attach Screenshot</span>
                          </label>
                        ) : (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={paymentScreenshot}
                                alt="Proof preview"
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="text-xs font-bold text-slate-800">
                                Screenshot attached
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentScreenshot(null);
                                if (proofFileRef.current) proofFileRef.current.value = "";
                              }}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50 text-xs font-bold"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingProof}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-extrabold rounded-xl transition-default shadow-xs cursor-pointer flex items-center justify-center gap-1.5 min-h-[46px]"
                      >
                        {isSubmittingProof ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Submit Payment Reference</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* TAB 2: MESS / MEAL TOGGLE                          */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === "MESS" && (
            <div className="space-y-4 animate-slide-up">
              {/* Header Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                        Today&apos;s Meal Preferences
                      </h2>
                      <p className="text-xs text-slate-500">
                        Help prevent food waste &amp; update kitchen headcount
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                    Live Headcount
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>
                    Tap any meal below to toggle whether you are eating or skipping today.
                  </span>
                </div>
              </div>

              {/* Notification Toast */}
              {mealToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2 animate-slide-up">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{mealToast}</span>
                </div>
              )}

              {/* 3 Meal Toggle Cards */}
              <div className="space-y-3">
                {/* Breakfast */}
                <div
                  onClick={() => handleMealToggle("BREAKFAST", bfastOpt)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    bfastOpt
                      ? "bg-white border-slate-900 shadow-xs"
                      : "bg-slate-100 border-slate-300 text-slate-400 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        bfastOpt
                          ? "bg-slate-900 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-extrabold ${
                          bfastOpt ? "text-slate-900" : "text-slate-500"
                        }`}
                      >
                        Breakfast
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {settings.breakfastWindow}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        bfastOpt
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {bfastOpt ? "Opted In (Eating)" : "Skipping (Away)"}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Tap to change</p>
                  </div>
                </div>

                {/* Lunch */}
                <div
                  onClick={() => handleMealToggle("LUNCH", lunchOpt)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    lunchOpt
                      ? "bg-white border-slate-900 shadow-xs"
                      : "bg-slate-100 border-slate-300 text-slate-400 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        lunchOpt
                          ? "bg-orange-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-extrabold ${
                          lunchOpt ? "text-slate-900" : "text-slate-500"
                        }`}
                      >
                        Lunch
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {settings.lunchWindow}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        lunchOpt
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {lunchOpt ? "Opted In (Eating)" : "Skipping (Away)"}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Tap to change</p>
                  </div>
                </div>

                {/* Dinner */}
                <div
                  onClick={() => handleMealToggle("DINNER", dinnerOpt)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    dinnerOpt
                      ? "bg-white border-slate-900 shadow-xs"
                      : "bg-slate-100 border-slate-300 text-slate-400 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        dinnerOpt
                          ? "bg-indigo-950 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-extrabold ${
                          dinnerOpt ? "text-slate-900" : "text-slate-500"
                        }`}
                      >
                        Dinner
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {settings.dinnerWindow}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        dinnerOpt
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {dinnerOpt ? "Opted In (Eating)" : "Skipping (Away)"}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Tap to change</p>
                  </div>
                </div>
              </div>

              {/* Kitchen sync notice */}
              <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Hostel Kitchen Policy:
                </span>
                Preferences automatically update the manager&apos;s kitchen roster. Please update your status at least 1 hour prior to serving.
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* TAB 3: REPORT MAINTENANCE TICKET                   */}
          {/* ═══════════════════════════════════════════════════ */}
          {activeTab === "MAINTENANCE" && (
            <div className="space-y-4 animate-slide-up">
              {/* Submission Confirmation */}
              {maintSubmittedTicket && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-emerald-950">
                    Repair Ticket {maintSubmittedTicket.id} Logged!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Technician notified for Room {currentRoom}. Expected resolution window: 1–4 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMaintSubmittedTicket(null)}
                    className="text-xs font-bold text-emerald-900 underline mt-1"
                  >
                    Report another issue
                  </button>
                </div>
              )}

              {/* Active Room Tickets if any */}
              {existingRoomTickets.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Active Tickets for Room {currentRoom}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {existingRoomTickets.length} logged
                    </span>
                  </div>

                  <div className="space-y-2">
                    {existingRoomTickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{t.description}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {t.category} · {t.id}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            t.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : t.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maintenance Request Form */}
              <form
                onSubmit={handleSubmitMaintenance}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Direct Repair Ticket
                  </h3>
                  <span className="text-xs font-bold text-blue-600">Room {currentRoom}</span>
                </div>

                {/* 1. Category Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    1. Select Issue Category *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {maintenanceCategories.map((c) => {
                      const isSel = maintCategory === c.id;
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setMaintCategory(c.id)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSel
                              ? "bg-slate-900 text-white border-slate-900 font-bold shadow-2xs"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-semibold"
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1 ${isSel ? "text-white" : c.color}`} />
                          <span className="text-[11px] leading-tight line-clamp-1">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Quick Suggestion:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {maintenanceCategories
                      .find((c) => c.id === maintCategory)
                      ?.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setMaintDesc((prev) => (prev ? `${prev}. ${sug}` : sug));
                          }}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md border border-slate-200 transition-colors"
                        >
                          + {sug}
                        </button>
                      ))}
                  </div>
                </div>

                {/* 2. Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    2. Describe What Needs Fixing *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={maintDesc}
                    onChange={(e) => setMaintDesc(e.target.value)}
                    placeholder="e.g. Washroom tap is leaking steadily or bed 1 study lamp socket sparks..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus-ring resize-none"
                  />
                </div>

                {/* 3. Photo Attachment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>3. Attach Photo (Optional)</span>
                    <span className="text-[10px] text-slate-400">Helps handyman</span>
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    ref={maintPhotoRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => setMaintPhoto(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                    id="maint-photo-upload"
                  />

                  {!maintPhoto ? (
                    <label
                      htmlFor="maint-photo-upload"
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-default cursor-pointer text-slate-600 text-xs font-bold min-h-[44px]"
                    >
                      <Camera className="w-4 h-4 text-slate-500" />
                      <span>Take Photo or Upload</span>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={maintPhoto}
                          alt="Issue preview"
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="text-xs font-bold text-slate-800">Photo attached</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMaintPhoto(null);
                          if (maintPhotoRef.current) maintPhotoRef.current.value = "";
                        }}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50 text-xs font-bold"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Contact phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Phone / WhatsApp (For technician visit)
                  </label>
                  <input
                    type="tel"
                    value={maintPhone}
                    onChange={(e) => setMaintPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingMaint}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-extrabold rounded-xl transition-default shadow-xs cursor-pointer flex items-center justify-center gap-1.5 min-h-[48px]"
                >
                  {isSubmittingMaint ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Repair Request</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="p-3 bg-white border-t border-slate-200 text-center text-[10px] text-slate-400 font-medium">
          PGHQ Standard · Ideal Hostel Door Portal · 24/7 Desk: {settings.ownerPhone}
        </div>
      </div>

      {/* ── Celebratory Success Modal ── */}
      <SuccessModal
        open={successModal.open}
        title={successModal.title}
        body={successModal.body}
        onClose={closeSuccess}
      />

      {/* Confirmation Modal */}
      {showPaymentConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowPaymentConfirmModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl animate-bounce-in">
            <h2 className="text-xl font-black text-slate-900 mb-2">Did you complete your rent payment?</h2>
            <p className="text-sm text-slate-600 mb-6">If yes, please provide your payment details.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-extrabold rounded-xl transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowPaymentConfirmModal(false);
                  setShowVerificationForm(true);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-xl transition-colors cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Export with Suspense wrapper ─────────────────────────── */

export default function TenantPortalPage({ params }: { params: { roomId: string } }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
        </div>
      }
    >
      <TenantPortalContent roomId={params.roomId} />
    </Suspense>
  );
}
