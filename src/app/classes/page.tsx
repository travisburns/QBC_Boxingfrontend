import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Classes & Schedule",
  description: "40+ weekly classes across strength, boxing, and conditioning.",
};

type ClassRow = { time: string; name: string; coach: string; type: "Strength" | "Boxing" | "Conditioning" };

const schedule: { day: string; sessions: ClassRow[] }[] = [
  {
    day: "Monday",
    sessions: [
      { time: "6:00a", name: "Barbell Strength", coach: "Marcus", type: "Strength" },
      { time: "12:00p", name: "Boxing Fundamentals", coach: "Dana", type: "Boxing" },
      { time: "6:30p", name: "Metcon Conditioning", coach: "Theo", type: "Conditioning" },
    ],
  },
  {
    day: "Tuesday",
    sessions: [
      { time: "6:00a", name: "Bag & Pad Work", coach: "Dana", type: "Boxing" },
      { time: "5:30p", name: "Powerlifting Club", coach: "Marcus", type: "Strength" },
      { time: "7:00p", name: "Mobility & Recovery", coach: "Priya", type: "Conditioning" },
    ],
  },
  {
    day: "Wednesday",
    sessions: [
      { time: "6:00a", name: "Metcon Conditioning", coach: "Theo", type: "Conditioning" },
      { time: "12:00p", name: "Boxing Sparring", coach: "Dana", type: "Boxing" },
      { time: "6:30p", name: "Barbell Strength", coach: "Marcus", type: "Strength" },
    ],
  },
  {
    day: "Thursday",
    sessions: [
      { time: "6:00a", name: "Strength Circuit", coach: "Theo", type: "Strength" },
      { time: "5:30p", name: "Boxing Fundamentals", coach: "Dana", type: "Boxing" },
    ],
  },
  {
    day: "Friday",
    sessions: [
      { time: "6:00a", name: "Barbell Strength", coach: "Marcus", type: "Strength" },
      { time: "5:30p", name: "Fight Night Conditioning", coach: "Theo", type: "Conditioning" },
    ],
  },
  {
    day: "Saturday",
    sessions: [
      { time: "8:00a", name: "Open Sparring", coach: "Dana", type: "Boxing" },
      { time: "10:00a", name: "Team Strength", coach: "Marcus", type: "Strength" },
    ],
  },
];

const typeColor: Record<ClassRow["type"], string> = {
  Strength: "text-accent",
  Boxing: "text-[#ff5a7a]",
  Conditioning: "text-[#5ac8ff]",
};

export default function ClassesPage() {
  return (
    <>
      <PageHero
        eyebrow="Classes"
        title="The Full Schedule"
        intro="40+ classes a week across strength, boxing, and conditioning. Unlimited members get priority booking on every session."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="space-y-8">
            {schedule.map((day) => (
              <div key={day.day} className="border border-line bg-ink-2">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <h2 className="font-display text-2xl text-cream">{day.day}</h2>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted">
                    {day.sessions.length} sessions
                  </span>
                </div>
                <ul className="divide-y divide-line">
                  {day.sessions.map((s, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[64px_1fr] items-center gap-4 px-5 py-4 sm:grid-cols-[90px_1fr_140px]"
                    >
                      <span className="font-display text-lg text-cream">{s.time}</span>
                      <div>
                        <p className="font-medium text-cream">{s.name}</p>
                        <p className={`text-xs uppercase tracking-[0.16em] ${typeColor[s.type]}`}>
                          {s.type}
                        </p>
                      </div>
                      <span className="hidden text-sm text-muted sm:block sm:text-right">
                        Coach {s.coach}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 border border-line bg-ink-2 p-8 text-center">
            <p className="max-w-md text-muted">
              Classes are included with every membership. Booking opens 48 hours ahead in your
              member portal.
            </p>
            <ButtonLink href="/membership" size="lg">
              Become a Member
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
