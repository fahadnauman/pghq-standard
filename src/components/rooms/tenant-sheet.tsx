"use client";

import { useState, useEffect, useRef } from "react";
import type { Bed, PaymentRecord } from "@/types";
import { getStatusConfig } from "./status-legend";
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  CalendarClock,
  IndianRupee,
  Wallet,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MinusCircle,
  MessageCircle,
  Coffee,
  Sun,
  Moon,
} from "lucide-react";
import RecordPaymentModal from "@/components/finance/record-payment-modal";

interface TenantSheetProps {
  bed: Bed | null;
  paymentHistory: PaymentRecord[];
  onClose: () => void;
}

const paymentStatusConfig: Record<
  string,
  { label: string; icon: React.ElementType; class: string; bg: string }
> = {
  PAID: {
    label: "Paid",
    icon: CheckCircle2,
    class: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  UNPAID: {
    label: "Unpaid",
    icon: XCircle,
    class: "text-rose-700",
    bg: "bg-rose-50 border-rose-200",
  },
  PARTIAL: {
    label: "Partial",
    icon: MinusCircle,
    class: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  OVERDUE: {
    label: "Overdue",
    icon: AlertCircle,
    class: "text-rose-700 font-bold",
    bg: "bg-rose-50 border-rose-300",
  },
};

export default function TenantSheet({
  bed,
  paymentHistory,
  onClose,
}: TenantSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (bed) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [bed, onClose]);

  if (!bed) return null;

  const tenant = bed.tenant;
  const statusCfg = getStatusConfig(bed.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Sheet / Drawer Container */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 sm:bottom-auto sm:top-0 right-0 z-50
                   h-[90vh] sm:h-full w-full sm:max-w-lg
                   bg-white border-t sm:border-t-0 sm:border-l border-slate-200
                   shadow-2xl overflow-y-auto rounded-t-3xl sm:rounded-none
                   animate-slide-up sm:animate-none"
        style={{
          boxShadow: "0 -10px 40px -10px rgba(15, 23, 42, 0.15), 0 20px 25px -5px rgba(15, 23, 42, 0.1)",
        }}
      >
        {/* Mobile Swipe Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* ── Header ───────────────────────────────────── */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-slate-200">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl ${statusCfg.bgClass} ${statusCfg.borderClass} border-2 flex items-center justify-center`}
              >
                <span className="text-sm font-extrabold text-slate-900">
                  B{bed.bedNumber}
                </span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  Bed {bed.bedNumber}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${statusCfg.dotClass}`}
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close details"
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-default cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────── */}
        <div className="px-5 sm:px-6 py-5 space-y-6 pb-20 sm:pb-8">
          {tenant ? (
            <>
              {/* Tenant Profile Card */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Current Occupant
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border
                                ${paymentStatusConfig[tenant.paymentStatus].bg}
                                ${paymentStatusConfig[tenant.paymentStatus].class}
                                ${tenant.paymentStatus === 'OVERDUE' || tenant.paymentStatus === 'UNPAID' ? 'border-rose-300' : 'border-emerald-300'}`}
                  >
                    {paymentStatusConfig[tenant.paymentStatus].label}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {tenant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-extrabold text-slate-900 truncate">
                      {tenant.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                      {tenant.phone}
                    </p>
                  </div>
                </div>

                {/* Direct 1-Tap Quick Action Buttons for Owner */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-accent hover:bg-accent-hover active:scale-[0.98] text-accent-foreground font-bold text-xs transition-default shadow-xs cursor-pointer min-h-[56px]"
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>Payment</span>
                  </button>
                  <a
                    href={`tel:${tenant.phone.replace(/[^0-9+]/g, "")}`}
                    className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs transition-default shadow-xs cursor-pointer min-h-[56px]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(tenant.name)},%20this%20is%20from%20Naalukettu%20Hostel%20regarding%20your%20room%20rent.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs transition-default shadow-xs cursor-pointer min-h-[56px]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </section>

              {/* Lease & Rent Details */}
              <section className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lease &amp; Rental Terms
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <DetailCard
                    icon={IndianRupee}
                    label="Monthly Rent"
                    value={`₹${tenant.monthlyRent.toLocaleString("en-IN")}`}
                    highlight
                  />
                  <DetailCard
                    icon={Wallet}
                    label="Security Deposit"
                    value={`₹${tenant.advanceDeposit.toLocaleString("en-IN")}`}
                  />
                  <DetailCard
                    icon={Calendar}
                    label="Check-in Date"
                    value={formatDate(tenant.checkInDate)}
                  />
                  <DetailCard
                    icon={Clock}
                    label="Rent Due Date"
                    value={`${ordinal(tenant.rentDueDate)} of month`}
                  />
                  <DetailCard
                    icon={CalendarClock}
                    label="Lease Expiration"
                    value={
                      tenant.leaseEndDate
                        ? formatDate(tenant.leaseEndDate)
                        : "Open Agreement"
                    }
                    className="col-span-2"
                  />
                </div>
              </section>

              {/* Meal Preferences */}
              <section className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Today's Meal Preferences
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                  <MealToggle type="BREAKFAST" icon={Coffee} />
                  <MealToggle type="LUNCH" icon={Sun} />
                  <MealToggle type="DINNER" icon={Moon} />
                </div>
              </section>

              {/* Payment History */}
              <section className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Payment History Records
                </h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden card-shadow">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left border-b border-slate-200">
                        <th className="px-4 py-3 text-xs font-extrabold text-slate-700">
                          Month
                        </th>
                        <th className="px-4 py-3 text-xs font-extrabold text-slate-700">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-xs font-extrabold text-slate-700 text-right">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentHistory.map((record) => {
                        const psc = paymentStatusConfig[record.status];
                        const StatusIcon = psc.icon;
                        return (
                          <tr key={record.id} className="hover:bg-slate-50/80">
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              {record.month}
                            </td>
                            <td className="px-4 py-3 font-bold tabular-nums text-slate-900">
                              ₹{record.amount.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-bold ${psc.class}`}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                {psc.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : (
            /* Vacant Bed Actions */
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                <User className="w-8 h-8 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">Bed is Vacant</h3>
                <p className="text-sm font-medium text-slate-600 max-w-xs mx-auto">
                  Ready for instant tenant allocation. Assign a tenant or reserve for an upcoming check-in.
                </p>
              </div>
              <button
                type="button"
                className="w-full max-w-xs py-3 px-5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm
                           rounded-xl transition-default cursor-pointer min-h-[48px] shadow-sm"
              >
                + Assign New Tenant to Bed
              </button>
            </div>
          )}
        </div>
      </div>
      
      <RecordPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        tenantId={tenant?.id || ""}
        tenantName={tenant?.name || ""}
        amountDue={tenant?.monthlyRent || 0}
        onSuccess={() => {
          // Success callback logic can go here
        }}
      />
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground w-16 shrink-0">{label}</span>
      <span className="font-medium truncate">{value}</span>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  className = "",
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-xl border space-y-1.5 ${
        highlight
          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
          : "bg-slate-50 border-slate-200 text-slate-900"
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${highlight ? "text-slate-300" : "text-slate-500"}`} />
        <span
          className={`text-[11px] font-bold uppercase tracking-wider ${
            highlight ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {label}
        </span>
      </div>
      <p className={`text-base font-extrabold tabular-nums ${highlight ? "text-white" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

/* ─── Utilities ──────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function MealToggle({ type, icon: Icon }: { type: string, icon: React.ElementType }) {
  const [optedIn, setOptedIn] = useState(true);
  
  return (
    <button
      onClick={() => setOptedIn(!optedIn)}
      className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-bold transition-all shadow-xs min-h-[56px]
        ${optedIn 
          ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800" 
          : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
        }`}
    >
      <Icon className={`w-4 h-4 ${optedIn ? "text-white" : "text-slate-400"}`} />
      <span className="capitalize">{type.toLowerCase()}</span>
    </button>
  );
}
