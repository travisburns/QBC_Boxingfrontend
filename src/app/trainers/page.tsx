import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/site/PageHero";
import { MediaSlot } from "@/components/ui/Bits";

export const metadata: Metadata = {
  title: "Trainers",
  description: "Meet the coaches behind QBC Boxing.",
};

const trainers = [
  {
    name: "Marcus Reed",
    role: "Head of Strength",
    bio: "Two decades under the bar and a national powerlifting record. Marcus builds strength that lasts.",
  },
  {
    name: "Dana Ilić",
    role: "Boxing Coach",
    bio: "Former amateur champion who's cornered pros. Technique-obsessed, patient, relentless.",
  },
  {
    name: "Theo Vance",
    role: "Conditioning",
    bio: "Engine-builder. Theo's metcon classes are the reason members stop dreading cardio.",
  },
  {
    name: "Priya Nair",
    role: "Mobility & Recovery",
    bio: "Physio background, movement-first philosophy. Keeps the whole club healthy and moving well.",
  },
  {
    name: "Sam Okoro",
    role: "Strength Coach",
    bio: "Olympic lifting specialist. Fast, technical, and endlessly encouraging.",
  },
  {
    name: "Lena Park",
    role: "Boxing & Conditioning",
    bio: "Brings fight-camp intensity to every round. Expect to sweat and learn.",
  },
];

export default function TrainersPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Coaches"
        title="Led by the Best"
        intro="Eighteen coaches, one standard. Every trainer here has competed, coached, and earned their spot on the floor."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((t) => (
              <article key={t.name}>
                <MediaSlot label="Trainer portrait" ratio="aspect-[3/4]" />
                <h2 className="mt-4 font-display text-2xl text-cream">{t.name}</h2>
                <p className="text-sm font-medium text-accent">{t.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t.bio}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
