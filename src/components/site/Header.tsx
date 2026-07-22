"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, site } from "@/lib/site";
import { clsx } from "@/lib/clsx";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(53,214,110,0.6)]" />
      <span className="font-display text-xl tracking-wide text-cream">{site.name}</span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-line bg-ink/90 backdrop-blur-md"
          : "border-transparent bg-ink/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Wordmark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-[13px] font-medium uppercase tracking-[0.18em] transition-colors",
                isActive(item.href) ? "text-accent" : "text-muted hover:text-cream",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAdmin && (
            <Link
              href="/admin"
              className={clsx(
                "text-[13px] font-medium uppercase tracking-[0.18em] transition-colors",
                isActive("/admin") ? "text-accent" : "text-muted hover:text-cream",
              )}
            >
              Admin
            </Link>
          )}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className="text-[13px] font-medium uppercase tracking-[0.18em] text-muted hover:text-cream"
          >
            {isAuthenticated ? "My Account" : "Log In"}
          </Link>
          <ButtonLink href="/membership" size="md">
            Join Now
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={clsx(
                "absolute left-0 h-0.5 w-6 bg-cream transition-all duration-200",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={clsx(
                "absolute left-0 top-1.5 h-0.5 w-6 bg-cream transition-all duration-200",
                open && "opacity-0",
              )}
            />
            <span
              className={clsx(
                "absolute left-0 h-0.5 w-6 bg-cream transition-all duration-200",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={clsx(
          "lg:hidden overflow-hidden border-t border-line bg-ink transition-[max-height] duration-300 ease-out",
          open ? "max-h-[80vh]" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-5 py-4" aria-label="Mobile">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "border-b border-line/60 py-4 text-sm font-medium uppercase tracking-[0.18em]",
                isActive(item.href) ? "text-accent" : "text-cream",
              )}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="border-b border-line/60 py-4 text-sm font-medium uppercase tracking-[0.18em] text-accent"
            >
              Admin
            </Link>
          )}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className="border-b border-line/60 py-4 text-sm font-medium uppercase tracking-[0.18em] text-cream"
          >
            {isAuthenticated ? "My Account" : "Log In"}
          </Link>
          <ButtonLink href="/membership" size="lg" className="mt-5 w-full">
            Join Now
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
