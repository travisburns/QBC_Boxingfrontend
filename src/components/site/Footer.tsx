import Link from "next/link";
import { footerNav, site } from "@/lib/site";

function Column({
  heading,
  links,
}: {
  heading: string;
  links: readonly { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h3 className="eyebrow mb-4 text-muted">{heading}</h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fg/80 hover:text-accent"
              >
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-sm text-fg/80 hover:text-accent">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="font-display text-lg tracking-wide text-cream">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{site.tagline}</p>
        </div>
        <Column {...footerNav.explore} />
        <Column {...footerNav.club} />
        <Column {...footerNav.follow} />
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-fg">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-fg">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
