"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Layers,
  Users,
  Wrench,
  UtensilsCrossed,
  Settings,
  Lock,
  ShieldCheck,
  IndianRupee,
  X,
  PieChart,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Floor & Bed Grid", href: "/dashboard/rooms", icon: Layers },
  { name: "Finance & Ledger", href: "/dashboard/finance", icon: IndianRupee },
  { name: "Expense & P&L", href: "/dashboard/expenses", icon: PieChart },
  { name: "Tenants", href: "/dashboard/tenants", icon: Users },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Meal Logs", href: "/dashboard/meals", icon: UtensilsCrossed },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLock = () => {
    if (typeof document !== "undefined") {
      document.cookie = "pghq_owner_session=; path=/; max-age=0;";
      localStorage.removeItem("pghq_owner_authenticated");
    }
    router.push("/login");
  };

  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px]
          bg-white border-r border-slate-200
          flex flex-col
          transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ── Logo ─────────────────────────────────────── */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Naalukettu Hostel
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-default cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Owner Mode Callout ───────────────────────── */}
        <div className="mx-3 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800">Owner Direct Pass Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Zero password friction handoff enabled.
          </p>
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold
                  transition-default group min-h-[44px]
                  ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }
                `}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-900"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer ───────────────────────────────────── */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLock}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold
                       text-slate-700 hover:text-rose-700 hover:bg-rose-50
                       transition-default cursor-pointer min-h-[44px]"
          >
            <Lock className="w-4 h-4 shrink-0 text-slate-500" />
            Lock / Exit Bypass
          </button>
        </div>
      </aside>
    </>
  );
}

