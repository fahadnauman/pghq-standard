import Link from "next/link";
import {
  BedDouble,
  UserCheck,
  DoorOpen,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Layers,
  UserPlus,
  Receipt,
  Wrench,
  ShieldCheck,
  ChevronRight,
  QrCode,
} from "lucide-react";

/* ─── Metric Card Data ──────────────────────────────────── */

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  href: string;
}

const metrics: Metric[] = [
  {
    label: "Total Beds",
    value: "120",
    change: "+4 this month",
    trend: "up",
    icon: BedDouble,
    iconBg: "bg-blue-50 border border-blue-200",
    iconColor: "text-blue-700",
    href: "/dashboard/rooms",
  },
  {
    label: "Occupied Beds",
    value: "98",
    change: "81.6% occupancy",
    trend: "up",
    icon: UserCheck,
    iconBg: "bg-emerald-50 border border-emerald-200",
    iconColor: "text-emerald-700",
    href: "/dashboard/rooms",
  },
  {
    label: "Vacant Beds",
    value: "22",
    change: "3 reserved",
    trend: "down",
    icon: DoorOpen,
    iconBg: "bg-amber-50 border border-amber-200",
    iconColor: "text-amber-700",
    href: "/dashboard/rooms",
  },
  {
    label: "Pending Dues",
    value: "₹47,200",
    change: "12 tenants",
    trend: "down",
    icon: IndianRupee,
    iconBg: "bg-rose-50 border border-rose-200",
    iconColor: "text-rose-700",
    href: "/dashboard/rooms",
  },
];

/* ─── Page ──────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Welcome / Client Handoff Banner ─────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Owner Handoff Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Naalukettu Hostel
          </h1>
          <p className="text-sm text-slate-600">
            Live occupancy, room grid, dues collection, and property overview.
          </p>
        </div>

        {/* Primary Action Button */}
        <Link
          href="/dashboard/rooms"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold text-sm transition-default shadow-xs cursor-pointer shrink-0 min-h-[48px]"
        >
          <Layers className="w-4 h-4" />
          <span>Open 2D Bed Grid</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Metric Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="group relative bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5
                       card-shadow card-shadow-hover transition-all duration-200 ease-in-out block"
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div
                className={`w-11 h-11 rounded-xl ${metric.iconBg} flex items-center justify-center`}
              >
                <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
              <span className="p-1 rounded-md text-slate-400 group-hover:text-slate-900 transition-default">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>

            {/* Value */}
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                {metric.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                {metric.label}
              </p>
            </div>

            {/* Change */}
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span className="text-xs font-medium text-slate-600 truncate">
                  {metric.change}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── QR Maintenance Live Ticketing Banner ──────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                QR Code Maintenance Ticketing Active
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Live Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Each room has a unique QR door placard. Tenants scan to log issues with zero friction.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/rooms"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-default"
          >
            <QrCode className="w-4 h-4 text-slate-500" />
            <span>Generate Room QRs</span>
          </Link>
          <Link
            href="/dashboard/maintenance"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2ad68f] hover:bg-[#23b276] text-[#0f2e29] font-bold text-xs transition-default shadow-xs"
          >
            <Wrench className="w-4 h-4" />
            <span>Open Maintenance Hub</span>
          </Link>
        </div>
      </div>

      {/* ── Quick Info & Actions Row ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Owner Quick Actions</h2>
            <span className="text-xs font-semibold text-slate-500">1-Touch Shortcuts</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "2D Bed Grid",
                desc: "Real-time room occupancy",
                icon: Layers,
                href: "/dashboard/rooms",
                bg: "bg-blue-50 text-blue-700 border-blue-200",
              },
              {
                label: "Add Tenant",
                desc: "Assign bed & collect deposit",
                icon: UserPlus,
                href: "/dashboard/rooms",
                bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
              },
              {
                label: "Collect Rent",
                desc: "Record pending dues",
                icon: Receipt,
                href: "/dashboard/rooms",
                bg: "bg-amber-50 text-amber-700 border-amber-200",
              },
              {
                label: "Maintenance",
                desc: "Room repairs & complaints",
                icon: Wrench,
                href: "/dashboard/maintenance",
                bg: "bg-slate-100 text-slate-800 border-slate-200",
              },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col p-3.5 sm:p-4 rounded-xl border border-slate-200
                           hover:bg-slate-50 hover:border-slate-300
                           transition-default cursor-pointer text-left min-h-[80px]"
              >
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-2.5 ${action.bg}`}
                >
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  {action.label}
                </span>
                <span className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {action.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <span className="text-xs font-semibold text-slate-500">Live Updates</span>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                text: "Ravi Kumar checked in (Room G01, Bed 1)",
                time: "2 hours ago",
                badge: "Check-in",
                badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
              },
              {
                text: "Rent collected ₹6,500 from Sneha Reddy",
                time: "5 hours ago",
                badge: "Payment",
                badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
              },
              {
                text: "Plumbing repair resolved in Room 101",
                time: "Yesterday",
                badge: "Resolved",
                badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
              },
              {
                text: "Rent reminder sent to Amit Sharma (₹5,500 due)",
                time: "2 days ago",
                badge: "Due Alert",
                badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                    <span className="text-xs text-slate-400 sm:hidden">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800">
                    {item.text}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-400 whitespace-nowrap hidden sm:inline-block">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

