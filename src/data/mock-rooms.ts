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

const tenants: Record<string, Tenant> = {
  t1: {
    id: id(),
    bedId: "",
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    email: "ravi.kumar@gmail.com",
    checkInDate: "2025-03-15",
    leaseEndDate: "2026-03-14",
    advanceDeposit: 8000,
    monthlyRent: 6500,
    rentDueDate: 1,
    paymentStatus: "PAID",
  },
  t2: {
    id: id(),
    bedId: "",
    name: "Sneha Reddy",
    phone: "+91 87654 32109",
    email: "sneha.r@outlook.com",
    checkInDate: "2025-06-01",
    leaseEndDate: "2026-05-31",
    advanceDeposit: 10000,
    monthlyRent: 7000,
    rentDueDate: 5,
    paymentStatus: "PAID",
  },
  t3: {
    id: id(),
    bedId: "",
    name: "Amit Sharma",
    phone: "+91 76543 21098",
    email: null,
    checkInDate: "2025-01-10",
    leaseEndDate: "2026-01-09",
    advanceDeposit: 5000,
    monthlyRent: 5500,
    rentDueDate: 10,
    paymentStatus: "OVERDUE",
  },
  t4: {
    id: id(),
    bedId: "",
    name: "Priya Nair",
    phone: "+91 65432 10987",
    email: "priya.nair@yahoo.com",
    checkInDate: "2025-08-20",
    leaseEndDate: "2026-02-19",
    advanceDeposit: 7000,
    monthlyRent: 6000,
    rentDueDate: 1,
    paymentStatus: "PAID",
  },
  t5: {
    id: id(),
    bedId: "",
    name: "Karan Mehta",
    phone: "+91 54321 09876",
    email: "karan.m@gmail.com",
    checkInDate: "2025-04-01",
    leaseEndDate: "2026-09-30",
    advanceDeposit: 12000,
    monthlyRent: 7500,
    rentDueDate: 1,
    paymentStatus: "UNPAID",
  },
  t6: {
    id: id(),
    bedId: "",
    name: "Divya Joshi",
    phone: "+91 43210 98765",
    email: "divya.j@gmail.com",
    checkInDate: "2026-01-01",
    leaseEndDate: "2026-12-31",
    advanceDeposit: 9000,
    monthlyRent: 6800,
    rentDueDate: 1,
    paymentStatus: "PAID",
  },
  t7: {
    id: id(),
    bedId: "",
    name: "Rohit Verma",
    phone: "+91 32109 87654",
    email: null,
    checkInDate: "2025-11-15",
    leaseEndDate: "2026-11-14",
    advanceDeposit: 6000,
    monthlyRent: 5800,
    rentDueDate: 15,
    paymentStatus: "PARTIAL",
  },
  t8: {
    id: id(),
    bedId: "",
    name: "Ananya Das",
    phone: "+91 21098 76543",
    email: "ananya.das@icloud.com",
    checkInDate: "2025-07-01",
    leaseEndDate: "2026-06-30",
    advanceDeposit: 10000,
    monthlyRent: 7200,
    rentDueDate: 1,
    paymentStatus: "PAID",
  },
};

/* ─── Bed builder ────────────────────────────────────────── */

function bed(
  roomId: string,
  bedNumber: number,
  status: Bed["status"],
  tenantKey?: string
): Bed {
  const b: Bed = {
    id: id(),
    roomId,
    bedNumber,
    status,
    tenant: tenantKey ? { ...tenants[tenantKey] } : null,
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

export const mockPaymentHistory: PaymentRecord[] = [
  { id: id(), tenantId: "mock-1", tenantName: "Ravi Kumar", roomNumber: "G01", bedNumber: 1, month: "Sep 2026", amount: 6500, status: "UNPAID", paidOn: null, paymentMode: null },
  { id: id(), tenantId: "mock-1", tenantName: "Ravi Kumar", roomNumber: "G01", bedNumber: 1, month: "Aug 2026", amount: 6500, status: "PAID", paidOn: "2026-08-02", paymentMode: "UPI" },
  { id: id(), tenantId: "mock-1", tenantName: "Ravi Kumar", roomNumber: "G01", bedNumber: 1, month: "Jul 2026", amount: 6500, status: "PAID", paidOn: "2026-07-01", paymentMode: "BANK_TRANSFER" },
  { id: id(), tenantId: "mock-2", tenantName: "Sneha Reddy", roomNumber: "G02", bedNumber: 1, month: "Sep 2026", amount: 7000, status: "PAID", paidOn: "2026-09-04", paymentMode: "CASH" },
  { id: id(), tenantId: "mock-3", tenantName: "Amit Sharma", roomNumber: "G02", bedNumber: 2, month: "Sep 2026", amount: 5500, status: "OVERDUE", paidOn: null, paymentMode: null },
  { id: id(), tenantId: "mock-3", tenantName: "Amit Sharma", roomNumber: "G02", bedNumber: 2, month: "Aug 2026", amount: 5500, status: "PARTIAL", paidOn: "2026-08-10", paymentMode: "UPI" },
];

/* ─── Meal Logs ──────────────────────────────────────────── */

const todayStr = new Date().toISOString().split("T")[0];

export const mockMealRecords: import("@/types").MealRecord[] = [
  { id: id(), date: todayStr, tenantId: "mock-1", tenantName: "Ravi Kumar", roomNumber: "G01", mealType: "BREAKFAST", status: "OPTED_IN" },
  { id: id(), date: todayStr, tenantId: "mock-1", tenantName: "Ravi Kumar", roomNumber: "G01", mealType: "LUNCH", status: "SKIPPED" },
  { id: id(), date: todayStr, tenantId: "mock-1", tenantName: "Ravi Kumar", roomNumber: "G01", mealType: "DINNER", status: "OPTED_IN" },
  { id: id(), date: todayStr, tenantId: "mock-2", tenantName: "Sneha Reddy", roomNumber: "G02", mealType: "BREAKFAST", status: "OPTED_IN" },
  { id: id(), date: todayStr, tenantId: "mock-2", tenantName: "Sneha Reddy", roomNumber: "G02", mealType: "LUNCH", status: "OPTED_IN" },
  { id: id(), date: todayStr, tenantId: "mock-2", tenantName: "Sneha Reddy", roomNumber: "G02", mealType: "DINNER", status: "OPTED_IN" },
  { id: id(), date: todayStr, tenantId: "mock-3", tenantName: "Amit Sharma", roomNumber: "G02", mealType: "BREAKFAST", status: "SKIPPED" },
  { id: id(), date: todayStr, tenantId: "mock-3", tenantName: "Amit Sharma", roomNumber: "G02", mealType: "LUNCH", status: "OPTED_IN" },
  { id: id(), date: todayStr, tenantId: "mock-3", tenantName: "Amit Sharma", roomNumber: "G02", mealType: "DINNER", status: "SKIPPED" },
  { id: id(), date: todayStr, tenantId: "mock-4", tenantName: "Priya Nair", roomNumber: "G03", mealType: "BREAKFAST", status: "OPTED_IN" },
  { id: id(), date: todayStr, tenantId: "mock-4", tenantName: "Priya Nair", roomNumber: "G03", mealType: "LUNCH", status: "OPTED_IN" },
  { id: id(), date: todayStr, tenantId: "mock-4", tenantName: "Priya Nair", roomNumber: "G03", mealType: "DINNER", status: "OPTED_IN" },
];
