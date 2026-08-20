/** Shared domain types — mirror the backend DTOs. */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  user: User;
}

export type BillingCycle = "monthly" | "annual";

export interface MembershipPlan {
  /** Slug used in URLs and checkout, e.g. "boxing". */
  id: string;
  name: string;
  /** Price in minor units (cents) to avoid float rounding. */
  priceCents: number;
  currency: string; // e.g. "USD"
  cycle: BillingCycle;
  tagline: string;
  features: string[];
  featured?: boolean;
  /** Square catalog plan variation id this maps to (set on the backend). */
  squarePlanVariationId?: string;
}

export type MembershipStatus =
  | "none"
  | "active"
  | "pending"
  | "past_due"
  | "canceled"
  | "paused";

export interface Membership {
  status: MembershipStatus;
  planId: string | null;
  planName: string | null;
  cardBrand: string | null;
  cardLast4: string | null;
  currentPeriodEndUtc: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface CheckoutResult {
  status: MembershipStatus;
  membership: Membership;
}

/* ---- Day passes (one-time) ---- */

export interface DayPassProduct {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  description: string;
  /** How many days ahead a pass may be reserved. */
  maxDaysAhead: number;
}

export type DayPassStatus = "paid" | "redeemed" | "refunded";

export interface DayPass {
  id: number;
  productId: string;
  productName: string;
  /** ISO date "yyyy-MM-dd" the pass is reserved for. */
  visitDate: string;
  priceCents: number;
  currency: string;
  status: DayPassStatus;
  cardBrand: string | null;
  cardLast4: string | null;
  createdAtUtc: string;
  redeemedAtUtc: string | null;
}

/** The card a member has on file, for one-tap repeat purchases. */
export interface SavedCard {
  hasCard: boolean;
  cardBrand: string | null;
  cardLast4: string | null;
}

/* ---- Admin CRM (owner-only) ---- */

export interface CustomerSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  joinedUtc: string;
  membershipStatus: MembershipStatus;
  planId: string | null;
  planName: string | null;
  currentPeriodEndUtc: string | null;
}

export interface CustomerList {
  totalCustomers: number;
  activeMembers: number;
  customers: CustomerSummary[];
}

export interface MembershipRecord {
  planId: string;
  planName: string | null;
  status: MembershipStatus;
  cardBrand: string | null;
  cardLast4: string | null;
  currentPeriodEndUtc: string | null;
  cancelAtPeriodEnd: boolean;
  createdUtc: string;
  updatedUtc: string;
}

export interface CustomerDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  joinedUtc: string;
  squareCustomerId: string | null;
  summary: CustomerSummary;
  history: MembershipRecord[];
}

/* ---- Admin: day-pass front-desk check-in ---- */

export interface DayPassCheckIn {
  id: number;
  userId: string;
  customerName: string;
  email: string;
  productName: string;
  visitDate: string;
  status: DayPassStatus;
  createdUtc: string;
  redeemedUtc: string | null;
}

export interface DayPassCheckInList {
  date: string;
  total: number;
  redeemed: number;
  passes: DayPassCheckIn[];
}
