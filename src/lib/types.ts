/** Shared domain types — mirror the backend DTOs. */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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
