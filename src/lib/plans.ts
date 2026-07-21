import type { MembershipPlan } from "@/lib/types";

/**
 * Marketing source-of-truth for membership tiers.
 * The backend mirrors these `id`s and prices and maps each to a Square
 * subscription plan variation. Prices are in cents.
 */
export const membershipPlans: MembershipPlan[] = [
  {
    id: "strength",
    name: "Strength",
    priceCents: 8900,
    currency: "USD",
    cycle: "monthly",
    tagline: "The iron. The platform. Open gym, all yours.",
    features: [
      "Full strength & powerlifting floor",
      "Open gym, 24/7 member access",
      "Programming templates & PR tracking",
      "Locker room & recovery area",
    ],
  },
  {
    id: "boxing",
    name: "Boxing",
    priceCents: 9900,
    currency: "USD",
    cycle: "monthly",
    tagline: "Ring, bags, and coaching that hits back.",
    features: [
      "Boxing ring & heavy-bag stations",
      "All boxing & conditioning classes",
      "Wraps, gloves & technique clinics",
      "Open gym, 24/7 member access",
    ],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    priceCents: 14900,
    currency: "USD",
    cycle: "monthly",
    tagline: "Everything we do — no limits, no excuses.",
    features: [
      "Everything in Strength + Boxing",
      "Unlimited group classes",
      "Priority class booking",
      "Guest passes & recovery suite",
    ],
    featured: true,
  },
];

export function getPlan(id: string): MembershipPlan | undefined {
  return membershipPlans.find((p) => p.id === id);
}
