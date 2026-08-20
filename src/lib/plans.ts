import type { MembershipPlan } from "@/lib/types";

/**
 * Marketing source-of-truth for membership tiers.
 * The backend mirrors these `id`s and prices and maps each to a Square
 * subscription plan variation. Prices are in cents.
 */
export const membershipPlans: MembershipPlan[] = [
  {
    id: "membership",
    name: "Membership",
    priceCents: 12000,
    currency: "USD",
    cycle: "monthly",
    tagline: "Full access. Train on your schedule.",
    features: [
      "Unlimited gym & floor access",
      "All classes included",
      "Open gym hours",
      "No contract — cancel anytime",
    ],
    featured: true,
  },
];

export function getPlan(id: string): MembershipPlan | undefined {
  return membershipPlans.find((p) => p.id === id);
}
