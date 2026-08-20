import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/site/PageHero";
import { PlanCard } from "@/components/home/PlanCard";
import { membershipPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "One membership, full access — gym, floor, and all classes. $120/month, no contract, cancel anytime.",
};

const faqs = [
  {
    q: "Are there contracts?",
    a: "No. Every membership is month-to-month. Cancel anytime from your member portal — you keep access through the end of your paid period.",
  },
  {
    q: "What if I only want to come occasionally?",
    a: "No problem — skip the membership and buy a single Drop-In, Kids Class, or Session from the Drop-In page. Pay per visit, no commitment.",
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
        title="One Membership. All Access."
        intro="No contracts. No excuses. Your membership covers the gym, the floor, and every class. Just want to drop in? Grab a single visit instead."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-md">
            {membershipPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Billed monthly through Square. Cancel anytime. Not ready to commit?{" "}
            <a href="/day-pass" className="text-accent hover:underline">
              Buy a drop-in or class
            </a>
            .
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
