import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="py-16">
        <Container className="max-w-2xl space-y-6 text-muted">
          <p>
            This describes how {site.name} handles your information. This is placeholder copy —
            replace it with your reviewed privacy policy before launch.
          </p>
          <h2 className="font-display text-2xl text-cream">What we collect</h2>
          <p>
            Account details you provide (name, email) and membership status. Card details are
            entered directly into Square and are never stored on our systems.
          </p>
          <h2 className="font-display text-2xl text-cream">Payment data</h2>
          <p>
            Payment processing is handled by Square. We retain only non-sensitive references such as
            your Square customer ID and the last four digits of your card for display.
          </p>
          <h2 className="font-display text-2xl text-cream">Contact</h2>
          <p>
            Questions? Email <a className="text-accent hover:underline" href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </Container>
      </section>
    </>
  );
}
