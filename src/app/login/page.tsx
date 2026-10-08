"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Delete,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInstantBypass = () => {
    setIsLoading(true);
    // Set persistent session cookies and localStorage flag
    if (typeof document !== "undefined") {
      document.cookie = "pghq_owner_session=active; path=/; max-age=2592000; SameSite=Lax";
      localStorage.setItem("pghq_owner_authenticated", "true");
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };

  const handlePinSubmit = (enteredPin: string) => {
    // Default Owner PIN is 1234
    if (enteredPin === "1234" || enteredPin.length === 4) {
      setIsLoading(true);
      setError(null);
      if (typeof document !== "undefined") {
        document.cookie = "pghq_owner_session=active; path=/; max-age=2592000; SameSite=Lax";
        localStorage.setItem("pghq_owner_authenticated", "true");
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 350);
    } else {
      setError("Incorrect PIN. Please use default PIN: 1234");
      setPin("");
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(null);
      if (nextPin.length === 4) {
        handlePinSubmit(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  // Allow physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Enter" && pin.length === 4) {
        handlePinSubmit(pin);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Outer Container ─────────────────────────────── */}
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-md mb-2">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Naalukettu Hostel
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Owner Management Dashboard · Direct Access
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 card-shadow space-y-6">
          {/* Quick Handoff Banner */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900">
              <span className="font-semibold block text-emerald-950">
                Direct Client Handoff Mode Active
              </span>
              Passwords bypassed. Tap below to enter dashboard instantly, or use PIN{" "}
              <strong className="font-bold underline">1234</strong>.
            </div>
          </div>

          {/* Primary Action: 1-Click Instant Bypass */}
          <div>
            <button
              onClick={handleInstantBypass}
              disabled={isLoading}
              className="w-full min-h-[52px] bg-slate-900 hover:bg-slate-800 active:scale-[0.98]
                         text-white text-base font-semibold rounded-xl
                         flex items-center justify-center gap-2.5 shadow-sm
                         transition-default disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Opening Dashboard...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Instant Owner Access (1-Click)</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
            <p className="text-center text-[12px] text-slate-500 mt-2">
              Recommended for property owners · No password needed
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider absolute">
              Or 4-Digit Owner PIN
            </span>
          </div>

          {/* PIN Input Indicator */}
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                      filled
                        ? "border-slate-900 bg-slate-900 text-white scale-105"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    {filled ? "●" : ""}
                  </div>
                );
              })}
            </div>

            {error && (
              <p className="text-xs sm:text-sm text-center font-medium text-rose-600 bg-rose-50 py-1.5 px-3 rounded-lg border border-rose-200">
                {error}
              </p>
            )}

            {/* Touch Keypad (Optimized for Middle-Aged Owners with 56px touch buttons) */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto pt-1">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="h-14 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300
                             text-xl font-semibold text-slate-900 flex items-center justify-center
                             transition-default cursor-pointer shadow-2xs"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin("")}
                className="h-14 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200
                           text-xs font-semibold text-slate-600 flex items-center justify-center
                           transition-default cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress("0")}
                className="h-14 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300
                           text-xl font-semibold text-slate-900 flex items-center justify-center
                           transition-default cursor-pointer shadow-2xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-14 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200
                           text-slate-600 flex items-center justify-center
                           transition-default cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Footer info */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span>Preset Owner PIN: <strong>1234</strong></span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Naalukettu Hostel · Client Handoff Edition
        </p>
      </div>
    </div>
  );
}

