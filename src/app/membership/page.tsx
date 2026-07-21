import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/site/PageHero";
import { PlanCard } from "@/components/home/PlanCard";
import { membershipPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Flexible memberships for every level of commitment — strength, boxing, and unlimited classes. No contracts, cancel anytime.",
};

const faqs = [
  {
    q: "Are there contracts?",
    a: "No. Every membership is month-to-month. Cancel anytime from your member portal — you keep access through the end of your paid period.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. Upgrade or downgrade from your account at any time. Changes take effect on your next billing date.",
  },
  {
    q: "How does billing work?",
    a: "Payments are processed securely through Square. Your card details are entered directly into Square's encrypted form — they never touch our servers.",
  },
  {
    q: "Is there a joining fee?",
    a: "No sign-up fee, no hidden charges. The price you see is the price you pay.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Pick Your Standard"
        intro="No contracts. No excuses. Every plan includes 24/7 access, open gym, and locker rooms. Choose the training that fits how you move."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {membershipPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Prices in USD. Billed monthly through Square. Cancel anytime.
          </p>
        </Container>
      </section>

      <section className="border-t border-line bg-ink-2 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] text-cream">Questions</h2>
          <dl className="mt-8 divide-y divide-line">
            {faqs.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="text-lg font-semibold text-cream">{f.q}</dt>
                <dd className="mt-2 text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
