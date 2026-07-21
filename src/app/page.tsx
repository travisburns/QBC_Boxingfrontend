import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, DisplayHeading, ArrowLink, MediaSlot } from "@/components/ui/Bits";
import { membershipPlans } from "@/lib/plans";
import { PlanCard } from "@/components/home/PlanCard";

const stats = [
  { value: "3,200+", label: "Active Members" },
  { value: "40+", label: "Weekly Classes" },
  { value: "18", label: "Expert Coaches" },
  { value: "24/7", label: "Access" },
];

const offerings = [
  {
    title: "Strength",
    media: "Strength & powerlifting floor",
    body: "Calibrated plates, competition bars, and platforms. Programming and coaching to move real weight, safely.",
  },
  {
    title: "Boxing",
    media: "Boxing ring & heavy bags",
    body: "A full ring, a wall of heavy bags, and coaches who've cornered real fights. Technique first, always.",
  },
  {
    title: "Group Training",
    media: "Group class in session",
    body: "Conditioning, circuits, and skills classes that push a room. Show up, get pushed, leave better.",
  },
];

const coaches = [
  { name: "Marcus Reed", role: "Head of Strength" },
  { name: "Dana Ilić", role: "Boxing Coach" },
  { name: "Theo Vance", role: "Conditioning" },
  { name: "Priya Nair", role: "Mobility" },
];

export default function HomePage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,rgba(53,214,110,0.10),transparent_55%)]"
        />
        <Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div>
            <Eyebrow>Strength · Boxing · Group Training</Eyebrow>
            <DisplayHeading
              as="h1"
              glitch
              className="mt-5 text-[clamp(3.25rem,11vw,7rem)]"
            >
              Train Like
              <br />
              It Matters
            </DisplayHeading>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              A private athletic club built for lifters, fighters, and everyone in between.
              World-class coaching, uncompromising standards.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/membership" size="lg">
                Become a Member
              </ButtonLink>
              <ButtonLink href="/classes" variant="outline" size="lg">
                View Classes
              </ButtonLink>
            </div>
          </div>
          <MediaSlot
            label="Hero — athlete mid-lift or boxing, moody lighting"
            ratio="aspect-[4/3]"
            className="min-h-[260px] lg:min-h-[420px]"
          />
        </Container>
      </section>

      {/* ---------- STAT BAND ---------- */}
      <section className="border-b border-line bg-ink-2">
        <Container className="grid grid-cols-2 gap-y-10 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:border-r md:border-line md:last:border-r-0">
              <div className="font-display text-4xl text-accent sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">{s.label}</div>
            </div>
          ))}
        </Container>
      </section>

      {/* ---------- OFFERINGS ---------- */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>What We Offer</Eyebrow>
              <DisplayHeading className="mt-4 text-[clamp(2.5rem,6vw,3.75rem)]">
                Three Ways to Train
              </DisplayHeading>
            </div>
            <ArrowLink href="/classes">See Full Schedule</ArrowLink>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {offerings.map((o) => (
              <article key={o.title} className="group border border-line bg-ink-2">
                <MediaSlot label={o.media} ratio="aspect-[4/3]" className="border-0 border-b" />
                <div className="p-6">
                  <h3 className="font-display text-2xl text-cream">{o.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{o.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- COACHES ---------- */}
      <section className="border-y border-line bg-ink-2 py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Our Coaches</Eyebrow>
              <DisplayHeading className="mt-4 text-[clamp(2.5rem,6vw,3.75rem)]">
                Led by the Best
              </DisplayHeading>
            </div>
            <ArrowLink href="/trainers">Meet the Team</ArrowLink>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {coaches.map((c) => (
              <div key={c.name}>
                <MediaSlot label="Trainer portrait" ratio="aspect-[3/4]" />
                <h3 className="mt-4 font-display text-xl text-cream">{c.name}</h3>
                <p className="text-sm font-medium text-accent">{c.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- MEMBERSHIP TEASER ---------- */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="text-center">
            <Eyebrow>Membership</Eyebrow>
            <DisplayHeading className="mx-auto mt-4 max-w-2xl text-[clamp(2.5rem,6vw,3.75rem)]">
              Pick Your Standard
            </DisplayHeading>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              No contracts. Cancel anytime. Every plan includes 24/7 access and open gym.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {membershipPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- CTA BANNER ---------- */}
      <section className="border-t border-line bg-ink-2 py-24">
        <Container className="text-center">
          <Eyebrow>No Contracts. No Excuses.</Eyebrow>
          <DisplayHeading className="mx-auto mt-5 max-w-3xl text-[clamp(2.75rem,8vw,5rem)]">
            Ready to Raise Your Standard?
          </DisplayHeading>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            Flexible memberships for every level of commitment — strength, boxing, and unlimited
            classes included.
          </p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="/membership" size="lg">
              See Membership Plans
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
