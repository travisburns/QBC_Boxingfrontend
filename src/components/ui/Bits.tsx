import Link from "next/link";
import { clsx } from "@/lib/clsx";

/** Small green letter-spaced label that sits above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={clsx("eyebrow", className)}>{children}</p>;
}

/** Large condensed uppercase display heading. Renders as h2 by default. */
export function DisplayHeading({
  as: Tag = "h2",
  children,
  className,
  glitch = false,
}: {
  as?: "h1" | "h2" | "h3";
  children: React.ReactNode;
  className?: string;
  glitch?: boolean;
}) {
  return (
    <Tag className={clsx("font-display text-cream", glitch && "glitch", className)}>
      {children}
    </Tag>
  );
}

/** Green underlined text link with a trailing arrow ("SEE FULL SCHEDULE →"). */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent",
        "underline decoration-accent/40 underline-offset-[6px] hover:decoration-accent",
        className,
      )}
    >
      {children}
      <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

/** Placeholder media block (swap in <Image> when photography is ready). */
export function MediaSlot({
  label,
  className,
  ratio = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={clsx(
        "media-slot flex items-center justify-center text-center",
        ratio,
        className,
      )}
      role="img"
      aria-label={label}
    >
      <span className="px-4 text-xs uppercase tracking-[0.2em] text-muted/70">{label}</span>
    </div>
  );
}
