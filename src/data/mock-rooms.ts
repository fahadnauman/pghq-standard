import type {
  Floor,
  Room,
  Bed,
  Tenant,
  PaymentRecord,
} from "@/types";

/* ─── Helpers ────────────────────────────────────────────── */

let _id = 0;
const id = () => `mock-${++_id}`;

/* ─── Tenants ────────────────────────────────────────────── */

const tenants: Record<string, Tenant> = {};

/* ─── Bed builder ────────────────────────────────────────── */

function bed(
  roomId: string,
  bedNumber: number,
  status: Bed["status"],
  tenantKey?: string
): Bed {
  const tenantData = tenantKey ? tenants[tenantKey] : null;
  const b: Bed = {
    id: id(),
    roomId,
    bedNumber,
    status,
    tenant: tenantData ? { ...tenantData } : null,
  };
  if (b.tenant) b.tenant.bedId = b.id;
  return b;
}

/* ─── Rooms ──────────────────────────────────────────────── */

function room(
  floorId: string,
  roomNumber: string,
  roomType: Room["roomType"],
  beds: [number, Bed["status"], string?][]
): Room {
  const roomId = id();
  return {
    id: roomId,
    floorId,
    roomNumber,
    roomType,
    hasAC: roomType === "SINGLE" || roomType === "DOUBLE",
    baseRent: 6000,
    beds: beds.map(([bedNum, status, tenantKey]) =>
      bed(roomId, bedNum, status, tenantKey)
    ),
  };
}

/* ─── Floor Data ─────────────────────────────────────────── */

const PROPERTY_ID = "prop-sunrise-001";

export const mockFloors: Floor[] = [
  { id: "floor-g", propertyId: PROPERTY_ID, floorNumber: 0, name: "Ground Floor" },
  { id: "floor-1", propertyId: PROPERTY_ID, floorNumber: 1, name: "First Floor" },
  { id: "floor-2", propertyId: PROPERTY_ID, floorNumber: 2, name: "Second Floor" },
];

export const mockRoomsByFloor: Record<string, Room[]> = {
  "floor-g": [
    room("floor-g", "G01", "DOUBLE", [
      [1, "OCCUPIED", "t1"],
      [2, "AVAILABLE"],
    ]),
    room("floor-g", "G02", "TRIPLE", [
      [1, "OCCUPIED", "t2"],
      [2, "DUE", "t3"],
      [3, "AVAILABLE"],
    ]),
    room("floor-g", "G03", "DOUBLE", [
      [1, "ENDING_SOON", "t4"],
      [2, "OCCUPIED", "t5"],
    ]),
    room("floor-g", "G04", "SINGLE", [[1, "AVAILABLE"]]),
  ],
  "floor-1": [
    room("floor-1", "101", "TRIPLE", [
      [1, "OCCUPIED", "t6"],
      [2, "AVAILABLE"],
      [3, "DUE", "t7"],
    ]),
    room("floor-1", "102", "DOUBLE", [
      [1, "OCCUPIED", "t8"],
      [2, "ENDING_SOON", "t4"],
    ]),
    room("floor-1", "103", "QUAD", [
      [1, "AVAILABLE"],
      [2, "AVAILABLE"],
      [3, "OCCUPIED", "t1"],
      [4, "DUE", "t3"],
    ]),
    room("floor-1", "104", "DOUBLE", [
      [1, "AVAILABLE"],
      [2, "AVAILABLE"],
    ]),
    room("floor-1", "105", "SINGLE", [[1, "OCCUPIED", "t2"]]),
  ],
  "floor-2": [
    room("floor-2", "201", "DOUBLE", [
      [1, "OCCUPIED", "t6"],
      [2, "OCCUPIED", "t8"],
    ]),
    room("floor-2", "202", "TRIPLE", [
      [1, "AVAILABLE"],
      [2, "ENDING_SOON", "t5"],
      [3, "AVAILABLE"],
    ]),
    room("floor-2", "203", "DOUBLE", [
      [1, "DUE", "t7"],
      [2, "AVAILABLE"],
    ]),
  ],
};

/* ─── Payment History ────────────────────────────────────── */

export const mockPaymentHistory: PaymentRecord[] = [];

/* ─── Meal Logs ──────────────────────────────────────────── */

const todayStr = new Date().toISOString().split("T")[0];

export const mockMealRecords: import("@/types").MealRecord[] = [];
