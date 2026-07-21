import { Container } from "@/components/ui/Container";
import { Eyebrow, DisplayHeading } from "@/components/ui/Bits";

/** Compact page header used on interior routes. */
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_10%_0%,rgba(53,214,110,0.08),transparent_55%)]"
      />
      <Container className="relative py-16 sm:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <DisplayHeading as="h1" className="mt-4 text-[clamp(2.75rem,8vw,4.75rem)]">
          {title}
        </DisplayHeading>
        {intro && <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">{intro}</p>}
      </Container>
    </section>
  );
}
