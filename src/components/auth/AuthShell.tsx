import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Bits";

export const authInputClass =
  "w-full border border-line bg-ink-3 px-4 py-3 text-cream placeholder:text-muted/60 " +
  "focus:border-accent focus:outline-none rounded-[2px]";

/** Centered card shell shared by login & register. */
export function AuthShell({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-md">
        <div className="border border-line bg-ink-2 p-8 sm:p-10">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 font-display text-4xl text-cream">{title}</h1>
          <div className="mt-8">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">{footer}</p>
      </Container>
    </section>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted"
    >
      {children}
    </label>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-accent hover:underline">
      {children}
    </Link>
  );
}
