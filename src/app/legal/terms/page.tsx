import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <section className="py-16">
        <Container className="max-w-2xl space-y-6 text-muted">
          <p>
            These terms govern your membership and use of {site.name}. This is placeholder copy —
            replace it with your club&apos;s reviewed terms before launch.
          </p>
          <h2 className="font-display text-2xl text-cream">Memberships</h2>
          <p>
            Memberships are billed on a recurring basis through Square. You may cancel at any time
            from your member portal; access continues through the end of the paid period.
          </p>
          <h2 className="font-display text-2xl text-cream">Payments</h2>
          <p>
            Payments are processed securely by Square. {site.name} does not store your full card
            number. Refunds are handled per our posted club policy.
          </p>
          <h2 className="font-display text-2xl text-cream">Conduct</h2>
          <p>Members agree to follow club rules and staff guidance while on the premises.</p>
        </Container>
      </section>
    </>
  );
}
