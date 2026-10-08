/* ─── Enums (mirroring Prisma) ───────────────────────────── */

export type BedStatus = "AVAILABLE" | "OCCUPIED" | "DUE" | "ENDING_SOON";

export type PaymentStatus = "PAID" | "UNPAID" | "PARTIAL" | "OVERDUE";

export type RoomType = "SINGLE" | "DOUBLE" | "TRIPLE" | "QUAD" | "DORMITORY";

export type MaintenanceStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export type MaintenanceCategory =
  | "PLUMBING"
  | "ELECTRICAL"
  | "AC_VENTILATION"
  | "CARPENTRY"
  | "CLEANING"
  | "OTHER";

/* ─── Maintenance ────────────────────────────────────────── */

export interface MaintenanceTask {
  id: string;
  roomId: string;
  roomNumber: string;
  category: MaintenanceCategory;
  description: string;
  photoUrl?: string | null;
  status: MaintenanceStatus;
  tenantName?: string | null;
  tenantPhone?: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ─── Models ─────────────────────────────────────────────── */

export interface Floor {
  id: string;
  propertyId: string;
  floorNumber: number;
  name: string | null;
}

export interface Room {
  id: string;
  floorId: string;
  roomNumber: string;
  roomType: RoomType;
  hasAC: boolean;
  baseRent: number;
  beds: Bed[];
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: number;
  status: BedStatus;
  tenant: Tenant | null;
}

export interface Tenant {
  id: string;
  bedId: string;
  name: string;
  phone: string;
  email: string | null;
  checkInDate: string;
  leaseEndDate: string | null;
  advanceDeposit: number;
  monthlyRent: number;
  rentDueDate: number;
  paymentStatus: PaymentStatus;
}

export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | null;

export interface PaymentRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  bedNumber: number;
  month: string;
  amount: number;
  status: PaymentStatus;
  paidOn: string | null;
  paymentMode: PaymentMode;
}

/* ─── Meals ──────────────────────────────────────────────── */

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";
export type MealStatus = "OPTED_IN" | "SKIPPED";

export interface MealRecord {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  mealType: MealType;
  status: MealStatus;
}

/* ─── Settings ───────────────────────────────────────────── */

export interface OwnerSettings {
  id?: string;
  upiId?: string;
  gpayNumber?: string;
  name?: string;
  [key: string]: any;
}
