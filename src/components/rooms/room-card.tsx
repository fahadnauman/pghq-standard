"use client";

import type { Room, Bed } from "@/types";
import BedIndicator from "./bed-indicator";
import { DoorOpen, QrCode } from "lucide-react";

const roomTypeLabels: Record<Room["roomType"], string> = {
  SINGLE: "Single Sharing",
  DOUBLE: "Double Sharing",
  TRIPLE: "Triple Sharing",
  QUAD: "4-Bed Sharing",
  DORMITORY: "Dormitory",
};

interface RoomCardProps {
  room: Room;
  onBedClick: (bed: Bed) => void;
  onQrClick?: (room: Room) => void;
}

export default function RoomCard({ room, onBedClick, onQrClick }: RoomCardProps) {
  const occupiedCount = room.beds.filter(
    (b) => b.status !== "AVAILABLE"
  ).length;
  const occupancyPercent = Math.round((occupiedCount / room.beds.length) * 100);

  return (
    <div
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden
                 card-shadow hover:shadow-md hover:border-slate-300
                 transition-all duration-200 ease-in-out flex flex-col justify-between"
    >
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <DoorOpen className="w-4 h-4 text-slate-800" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-none flex items-center justify-between">
              <span>Room {room.roomNumber}</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
              <span>{roomTypeLabels[room.roomType]}</span>
              {room.hasAC ? (
                <span className="bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-[4px] text-[10px] leading-none uppercase tracking-wider">AC</span>
              ) : (
                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-[4px] text-[10px] leading-none uppercase tracking-wider">Non-AC</span>
              )}
              <span className="text-slate-800 font-bold ml-auto bg-slate-100/50 px-2 rounded-md">₹{room.baseRent}</span>
            </p>
          </div>
        </div>

        {/* Occupancy chip & QR Button */}
        <div className="flex items-center gap-2">
          <div className="text-right space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800">
              <span>{occupiedCount}/{room.beds.length}</span>
              <span className="text-slate-400">·</span>
              <span className={occupancyPercent === 100 ? "text-emerald-700" : "text-slate-600"}>
                {occupancyPercent}%
              </span>
            </div>
            <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden ml-auto">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  occupancyPercent === 100 ? "bg-emerald-600" : "bg-slate-900"
                }`}
                style={{
                  width: `${occupancyPercent}%`,
                }}
              />
            </div>
          </div>

          {onQrClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQrClick(room);
              }}
              title={`Print / Download QR for Room ${room.roomNumber}`}
              aria-label={`QR Code for Room ${room.roomNumber}`}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 transition-default cursor-pointer shrink-0"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Bed Grid (Responsive: 2-3 columns on mobile, 3-4 on desktop) ── */}
      <div className="p-3.5">
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns:
              room.beds.length === 1
                ? "1fr"
                : room.beds.length === 2
                ? "repeat(2, minmax(0, 1fr))"
                : "repeat(auto-fit, minmax(68px, 1fr))",
          }}
        >
          {room.beds.map((bed) => (
            <BedIndicator key={bed.id} bed={bed} onClick={onBedClick} />
          ))}
        </div>
      </div>

      {/* ── Quick Footer Action for QR Placard ───────────────── */}
      {onQrClick && (
        <div className="px-3.5 pb-3 pt-0">
          <button
            onClick={() => onQrClick(room)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-default cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Door QR Placard</span>
          </button>
        </div>
      )}
    </div>
  );
}

