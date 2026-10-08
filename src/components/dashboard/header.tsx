"use client";

import { useState } from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const handleLock = () => {
    if (typeof document !== "undefined") {
      document.cookie = "pghq_owner_session=; path=/; max-age=0;";
      localStorage.removeItem("pghq_owner_authenticated");
    }
    router.push("/login");
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeProperty, setActiveProperty] = useState("Naalukettu Hostel - Main Branch");

  const properties = [
    "Naalukettu Hostel - Main Branch",
    "Greenwood Hostel - Branch 2",
    "Elite Residences - Branch 3"
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 card-shadow">
      <div className="h-full flex items-center justify-between px-3 sm:px-6">
        {/* ── Left: Menu & Property Switcher ──────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuClick}
            aria-label="Open Navigation Menu"
            className="lg:hidden min-w-[44px] min-h-[44px] -ml-1 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-default cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Property Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-default group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm font-bold text-slate-900 max-w-[140px] sm:max-w-[200px] truncate block">
                  {activeProperty}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-slate-900 transition-transform shrink-0 ml-0.5 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Your Portfolio
                  </div>
                  {properties.map((prop) => (
                    <button
                      key={prop}
                      onClick={() => {
                        setActiveProperty(prop);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2
                        ${activeProperty === prop ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                      `}
                    >
                      <Building2 className={`w-4 h-4 ${activeProperty === prop ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="truncate">{prop}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors">
                      + Add New Property
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Owner Mode Status Tag */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Owner Mode</span>
          </div>
        </div>

        {/* ── Right: Notifications & Profile / Lock ─────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Lock / Exit Bypass Button */}
          <button
            onClick={handleLock}
            title="Lock Dashboard / Switch Access"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-default cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Lock</span>
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative min-w-[44px] min-h-[44px] rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-default cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-default">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shadow-2xs">
              SR
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-900 leading-none">Shifa Rasheed</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Property Owner</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

