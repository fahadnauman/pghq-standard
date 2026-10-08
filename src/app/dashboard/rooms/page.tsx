"use client";

import { useState, useCallback } from "react";
import type { Bed, Room } from "@/types";
import { mockFloors, mockRoomsByFloor, mockPaymentHistory } from "@/data/mock-rooms";
import FloorSelector from "@/components/rooms/floor-selector";
import RoomCard from "@/components/rooms/room-card";
import StatusLegend from "@/components/rooms/status-legend";
import TenantSheet from "@/components/rooms/tenant-sheet";
import BedIndicator from "@/components/rooms/bed-indicator";
import RoomQrModal from "@/components/rooms/room-qr-modal";
import { Layers, LayoutGrid, Grid2X2, QrCode } from "lucide-react";

export default function RoomsPage() {
  const [activeFloorId, setActiveFloorId] = useState(mockFloors[0].id);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedQrRoom, setSelectedQrRoom] = useState<Room | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "matrix">("cards");

  const rooms = mockRoomsByFloor[activeFloorId] ?? [];
  const activeFloor = mockFloors.find((f) => f.id === activeFloorId);

  const handleBedClick = useCallback((bed: Bed) => {
    setSelectedBed(bed);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedBed(null);
  }, []);

  /* Floor-level stats */
  const totalBeds = rooms.reduce((sum, r) => sum + r.beds.length, 0);
  const occupied = rooms.reduce(
    (sum, r) => sum + r.beds.filter((b) => b.status === "OCCUPIED" || b.status === "ENDING_SOON").length,
    0
  );
  const duesCount = rooms.reduce(
    (sum, r) => sum + r.beds.filter((b) => b.status === "DUE").length,
    0
  );
  const available = totalBeds - (occupied + duesCount);

  return (
    <div className="space-y-6">
      {/* ── Page Header & Stats ───────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                2D Floor &amp; Bed Grid
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                {activeFloor?.name || `Floor ${activeFloor?.floorNumber}`} · {rooms.length} Rooms · {totalBeds} Total Beds
              </p>
            </div>
          </div>

          {/* View Mode Switcher (Card View vs. 2D Matrix Map) */}
          <div className="flex items-center self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-default cursor-pointer ${
                viewMode === "cards"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Room Cards</span>
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-default cursor-pointer ${
                viewMode === "matrix"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>2D Matrix</span>
            </button>
          </div>
        </div>

        {/* Floor-level high contrast stat chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="w-3 h-3 rounded-full bg-slate-600 shrink-0" />
            <div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">{occupied}</p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Occupied</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
            <div>
              <p className="text-base sm:text-lg font-extrabold text-emerald-950 leading-none">{available}</p>
              <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mt-0.5">Vacant</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200">
            <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0" />
            <div>
              <p className="text-base sm:text-lg font-extrabold text-rose-950 leading-none">{duesCount}</p>
              <p className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider mt-0.5">Rent Due</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-50 border border-blue-200">
            <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
            <div>
              <p className="text-base sm:text-lg font-extrabold text-blue-950 leading-none">{totalBeds}</p>
              <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mt-0.5">Total Beds</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floor Selector + Legend ───────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <FloorSelector
          floors={mockFloors}
          activeFloorId={activeFloorId}
          onSelect={setActiveFloorId}
        />
        <StatusLegend />
      </div>

      {/* ── View Mode: Room Cards (Default) ─────────────── */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBedClick={handleBedClick}
              onQrClick={setSelectedQrRoom}
            />
          ))}
        </div>
      )}

      {/* ── View Mode: 2D Matrix Aerial Map ─────────────── */}
      {viewMode === "matrix" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 card-shadow space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {activeFloor?.name} · 2D Aerial Bed Map
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Tap any bed for tenant details
            </span>
          </div>

          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      Room {room.roomNumber} ({room.roomType})
                    </span>
                    <button
                      onClick={() => setSelectedQrRoom(room)}
                      title={`Generate QR for Room ${room.roomNumber}`}
                      className="p-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-default cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">QR Placard</span>
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {room.beds.length} beds
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {room.beds.map((bed) => (
                    <BedIndicator key={bed.id} bed={bed} onClick={handleBedClick} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────── */}
      {rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200 rounded-2xl card-shadow">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
            <Layers className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No rooms on this floor</h3>
          <p className="text-sm text-slate-500 mt-1">
            Add rooms to get started with bed management.
          </p>
        </div>
      )}

      {/* ── Tenant Slide-Over / Mobile Bottom Drawer ──── */}
      <TenantSheet
        bed={selectedBed}
        paymentHistory={mockPaymentHistory}
        onClose={handleCloseSheet}
      />

      {/* ── Room QR Code Placard Modal ─────────────────── */}
      <RoomQrModal
        room={selectedQrRoom}
        propertyTitle="Naalukettu Hostel"
        isOpen={!!selectedQrRoom}
        onClose={() => setSelectedQrRoom(null)}
      />
    </div>
  );
}

