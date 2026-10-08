"use client";

import { useState } from "react";
import { mockPaymentHistory, mockRoomsByFloor } from "@/data/mock-rooms";
import type { PaymentRecord, PaymentStatus } from "@/types";
import { 
  IndianRupee, 
  Wallet, 
  AlertCircle, 
  TrendingUp, 
  Search, 
  Filter,
  MessageCircle,
  Banknote,
  Smartphone,
  Landmark,
  CheckCircle2,
  MinusCircle,
  XCircle,
  CreditCard
} from "lucide-react";
import RecordPaymentModal from "@/components/finance/record-payment-modal";

export default function FinanceDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [selectedTenantForPayment, setSelectedTenantForPayment] = useState<{ id: string, name: string, amount: number } | null>(null);

  // Derive some fake KPIs from the mock data
  const totalRevenue = mockPaymentHistory.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
  const pendingDues = mockPaymentHistory.filter(p => p.status === "UNPAID" || p.status === "OVERDUE" || p.status === "PARTIAL").reduce((sum, p) => sum + p.amount, 0);
  // Advance deposits from all tenants
  let totalAdvance = 0;
  Object.values(mockRoomsByFloor).forEach(rooms => {
    rooms.forEach(room => {
      room.beds.forEach(bed => {
        if (bed.tenant) totalAdvance += bed.tenant.advanceDeposit;
      });
    });
  });
  
  const totalBilled = totalRevenue + pendingDues;
  const collectionRate = totalBilled > 0 ? Math.round((totalRevenue / totalBilled) * 100) : 0;

  // Filter logs
  const filteredLogs = mockPaymentHistory.filter(record => {
    const matchesSearch = record.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          record.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleWhatsAppReminder = (record: PaymentRecord) => {
    // Construct message
    const message = `Hello ${record.tenantName},\n\nThis is a polite reminder that your rent for ${record.month} amounting to ₹${record.amount} is currently ${record.status === "OVERDUE" ? "overdue" : "pending"}. Please arrange for the payment at your earliest convenience.\n\nThank you!\nNaalukettu Hostel`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent/5 flex items-center justify-center">
            <IndianRupee className="w-[18px] h-[18px] text-muted" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Financial Ledger</h1>
            <p className="text-[13px] text-muted mt-0.5">Track revenue, pending dues, and tenant payments</p>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Monthly Revenue" 
          amount={totalRevenue} 
          icon={TrendingUp} 
          color="emerald" 
          subtitle="Collected this month"
        />
        <KpiCard 
          title="Pending Dues" 
          amount={pendingDues} 
          icon={AlertCircle} 
          color="rose" 
          subtitle="Awaiting payment"
        />
        <KpiCard 
          title="Advance Deposits" 
          amount={totalAdvance} 
          icon={Wallet} 
          color="info" 
          subtitle="Total held in trust"
        />
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-medium text-muted-foreground">Collection Rate</h3>
            <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">{collectionRate}%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Of total billed amount</p>
          </div>
        </div>
      </div>

      {/* ── Ledger Table ──────────────────────────────── */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-light flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-hover/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tenant or room..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 text-sm bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent/10 focus:border-border-focus transition-default"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg bg-surface text-sm">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "ALL")}
                className="bg-transparent border-none outline-none text-sm font-medium text-foreground cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partial</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Tenant / Room</th>
                <th className="px-6 py-3 font-semibold">Month</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Mode</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredLogs.map(record => (
                <tr key={record.id} className="hover:bg-surface-hover/30 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="font-medium text-foreground">{record.tenantName}</div>
                    <div className="text-[11px] text-muted-foreground">Room {record.roomNumber} · Bed {record.bedNumber}</div>
                  </td>
                  <td className="px-6 py-3 font-medium text-muted-foreground">{record.month}</td>
                  <td className="px-6 py-3 font-semibold text-right tabular-nums">₹{record.amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-6 py-3">
                    <ModeBadge mode={record.paymentMode} />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(record.status === "UNPAID" || record.status === "OVERDUE" || record.status === "PARTIAL") && (
                        <>
                          <button 
                            onClick={() => handleWhatsAppReminder(record)}
                            title="Send WhatsApp Reminder"
                            className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedTenantForPayment({ id: record.tenantId, name: record.tenantName, amount: record.amount })}
                            className="px-2.5 py-1.5 rounded-md bg-accent text-accent-foreground text-[11px] font-semibold hover:bg-accent-hover transition-colors"
                          >
                            Record
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No payment records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal 
        isOpen={!!selectedTenantForPayment} 
        onClose={() => setSelectedTenantForPayment(null)}
        tenantId={selectedTenantForPayment?.id || ""}
        tenantName={selectedTenantForPayment?.name || ""}
        amountDue={selectedTenantForPayment?.amount || 0}
      />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function KpiCard({ title, amount, icon: Icon, color, subtitle }: { title: string, amount: number, icon: React.ElementType, color: string, subtitle: string }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-500/10",
    rose: "text-rose-600 bg-rose-500/10",
    info: "text-blue-600 bg-blue-500/10",
  };
  
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-medium text-muted-foreground">{title}</h3>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">₹{amount.toLocaleString("en-IN")}</div>
        <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const config = {
    PAID: { label: "Paid", icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
    UNPAID: { label: "Unpaid", icon: XCircle, cls: "text-rose-700 bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
    PARTIAL: { label: "Partial", icon: MinusCircle, cls: "text-amber-700 bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
    OVERDUE: { label: "Overdue", icon: AlertCircle, cls: "text-rose-700 bg-rose-500/10 border-rose-200 dark:border-rose-500/20 font-bold" },
  }[status];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.cls}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function ModeBadge({ mode }: { mode: any }) {
  if (!mode) return <span className="text-muted-foreground text-xs">—</span>;
  
  const config = {
    CASH: { label: "Cash", icon: Banknote },
    UPI: { label: "UPI", icon: Smartphone },
    BANK_TRANSFER: { label: "Bank", icon: Landmark },
  }[mode as string] || { label: mode, icon: CreditCard };

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
