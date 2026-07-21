import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";
import { MediaSlot } from "@/components/ui/Bits";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}. Hours, location, and membership questions.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Come Train With Us"
        intro="Questions about membership, a tour, or your first class? Send a note — or just walk in."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-display text-2xl text-cream">Send a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div id="location">
            <h2 className="font-display text-2xl text-cream">Visit</h2>
            <dl className="mt-6 space-y-5 border-t border-line pt-6">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-accent">Address</dt>
                <dd className="mt-1 text-fg">{site.address}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-accent">Hours</dt>
                <dd className="mt-1 text-fg">{site.hours}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-accent">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="text-fg hover:text-accent">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-accent">Phone</dt>
                <dd className="mt-1 text-fg">{site.phone}</dd>
              </div>
            </dl>
            <div className="mt-8">
              <MediaSlot label="Map — club location" ratio="aspect-[16/10]" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
