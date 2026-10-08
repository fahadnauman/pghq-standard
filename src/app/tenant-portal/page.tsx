"use client";

import { Building2, CreditCard, Wrench, UtensilsCrossed, FileText, ChevronRight, Bell, Calendar, Coffee, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TenantPortal() {
  const [bfastOpt, setBfastOpt] = useState(true);
  const [lunchOpt, setLunchOpt] = useState(true);
  const [dinnerOpt, setDinnerOpt] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* ── Context Sidebar for Owner (Desktop only) ── */}
      <div className="hidden lg:flex flex-col max-w-sm mr-12 space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Tenant Self-Service Portal</h1>
          <p className="text-slate-600 leading-relaxed">
            This is a live preview of the mobile experience your tenants see when they log into the Naalukettu Hostel platform.
          </p>
        </div>
        <div className="space-y-4 pt-4 border-t border-slate-300">
          <FeatureCard icon={CreditCard} title="Automated Dues" desc="Tenants see rent due dates and can upload UPI receipts directly." />
          <FeatureCard icon={Wrench} title="Maintenance Tracker" desc="Lodge tickets and track resolution status in real-time." />
          <FeatureCard icon={UtensilsCrossed} title="Meal Preferences" desc="Opt-out of daily meals to help you cut food waste costs." />
        </div>
        <div className="pt-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Owner Dashboard
          </Link>
        </div>
      </div>

      {/* ── Mobile Phone Simulator Container ── */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-900 flex flex-col shrink-0">
        
        {/* Dynamic Island fake */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-slate-900 rounded-b-3xl z-50"></div>

        {/* ── App Header ── */}
        <div className="pt-14 pb-4 px-6 bg-slate-900 text-white flex items-center justify-between z-40">
          <div>
            <p className="text-xs font-semibold text-slate-400">Welcome back,</p>
            <h2 className="text-lg font-bold">Ravi Kumar</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-slate-300" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto bg-slate-50 px-5 pt-6 pb-24 space-y-6">
          
          {/* Rent Status Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                Due in 3 Days
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500">September Rent</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tabular-nums">₹6,500</h3>
            
            <button className="w-full mt-5 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
              Pay Now
            </button>
          </div>

          {/* Room Info */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Your Room</p>
              <p className="text-lg font-bold text-slate-900">Room G01 <span className="text-slate-300 mx-1">|</span> Bed 1</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          {/* Meal Tracker */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-5 h-5 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">Today's Meals</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <MealToggleButton active={bfastOpt} onClick={() => setBfastOpt(!bfastOpt)} icon={Coffee} label="Breakfast" />
              <MealToggleButton active={lunchOpt} onClick={() => setLunchOpt(!lunchOpt)} icon={Sun} label="Lunch" />
              <MealToggleButton active={dinnerOpt} onClick={() => setDinnerOpt(!dinnerOpt)} icon={Moon} label="Dinner" />
            </div>
          </div>

          {/* Active Tickets */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900">Maintenance</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">View All</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">AC not cooling</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Reported yesterday</p>
              </div>
              <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">IN PROGRESS</span>
            </div>
            
            <button className="w-full mt-4 py-3 bg-slate-50 text-slate-700 border border-slate-200 text-sm font-bold rounded-xl active:scale-95 transition-transform">
              Raise New Ticket
            </button>
          </div>

        </div>

        {/* ── Bottom Nav ── */}
        <div className="absolute bottom-0 w-full h-20 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40 pb-4">
          <NavItem icon={Building2} label="Home" active />
          <NavItem icon={CreditCard} label="Payments" />
          <NavItem icon={UtensilsCrossed} label="Mess" />
          <NavItem icon={Wrench} label="Tickets" />
        </div>
      </div>

    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-1">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function MealToggleButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-all
        ${active ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}
      `}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 ${active ? 'text-slate-900' : 'text-slate-400'}`}>
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
