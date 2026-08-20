"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Eyebrow, DisplayHeading } from "@/components/ui/Bits";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/format";
import { formatDayLabel } from "@/lib/dayPasses";
import { getPlan } from "@/lib/plans";
import type { DayPass, Membership, MembershipStatus } from "@/lib/types";

const statusStyles: Record<MembershipStatus, string> = {
  active: "text-accent",
  pending: "text-[#f5c451]",
  past_due: "text-[#ff5a7a]",
  canceled: "text-muted",
  paused: "text-[#5ac8ff]",
  none: "text-muted",
};

const statusLabel: Record<MembershipStatus, string> = {
  active: "Active",
  pending: "Pending",
  past_due: "Past due",
  canceled: "Canceled",
  paused: "Paused",
  none: "Free account",
};

export default function AccountPage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [membership, setMembership] = useState<Membership | null>(null);
  const [loadingMembership, setLoadingMembership] = useState(true);
  const [dayPasses, setDayPasses] = useState<DayPass[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated visitors to login once auth has resolved.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login?next=/account");
    }
  }, [loading, isAuthenticated, router]);

  const loadMembership = useCallback(async () => {
    setLoadingMembership(true);
    setError(null);
    try {
      const m = await apiFetch<Membership>("/api/account/membership");
      setMembership(m);
    } catch {
      setMembership(null);
    } finally {
      setLoadingMembership(false);
    }
  }, []);

  const loadDayPasses = useCallback(async () => {
    try {
      const passes = await apiFetch<DayPass[]>("/api/account/day-passes");
      setDayPasses(passes);
    } catch {
      setDayPasses([]);
    }
  }, []);

  const loadAccount = useCallback(async () => {
    await Promise.all([loadMembership(), loadDayPasses()]);
  }, [loadMembership, loadDayPasses]);

  useEffect(() => {
    // Fetch membership + day passes once authenticated (external-system sync).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAuthenticated) void loadAccount();
  }, [isAuthenticated, loadAccount]);

  async function cancelMembership() {
    if (!confirm("Cancel your membership? You'll keep access until the end of the current period.")) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const m = await apiFetch<Membership>("/api/account/membership/cancel", { method: "POST" });
      setMembership(m);
    } catch {
      setError("Could not cancel right now. Please try again or contact us.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <Container className="py-24">
        <p className="text-muted">Loading…</p>
      </Container>
    );
  }

  const plan = membership?.planId ? getPlan(membership.planId) : undefined;
  const status = membership?.status ?? "none";
  const hasActivePlan = status === "active" || status === "past_due" || status === "paused";

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Eyebrow>Client Portal</Eyebrow>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <DisplayHeading className="text-[clamp(2.5rem,7vw,4rem)]">
            Hey, {user?.firstName}
          </DisplayHeading>
          <button onClick={logout} className="text-sm text-muted hover:text-cream">
            Log out
          </button>
        </div>

        {/* Membership card */}
        <div className="mt-10 border border-line bg-ink-2 p-7">
          <div className="flex items-center justify-between">
            <h2 className="eyebrow text-muted">Membership</h2>
            <span className={`text-sm font-semibold uppercase tracking-[0.16em] ${statusStyles[status]}`}>
              {statusLabel[status]}
            </span>
          </div>

          {loadingMembership ? (
            <p className="mt-6 text-muted">Loading membership…</p>
          ) : hasActivePlan && membership ? (
            <>
              <div className="mt-6 flex items-end gap-2">
                <span className="font-display text-4xl text-cream">
                  {plan?.name ?? membership.planName ?? "Membership"}
                </span>
              </div>
              <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">Payment method</dt>
                  <dd className="mt-1 text-fg">
                    {membership.cardBrand && membership.cardLast4
                      ? `${membership.cardBrand} ···· ${membership.cardLast4}`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                    {membership.cancelAtPeriodEnd ? "Access until" : "Renews on"}
                  </dt>
                  <dd className="mt-1 text-fg">{formatDate(membership.currentPeriodEndUtc)}</dd>
                </div>
              </dl>

              {membership.cancelAtPeriodEnd && (
                <p className="mt-4 text-sm text-[#f5c451]">
                  Your membership is set to cancel at the end of the current period.
                </p>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/membership" variant="outline">
                  Change plan
                </ButtonLink>
                <ButtonLink
                  href={`/checkout?plan=${membership.planId}&update=1`}
                  variant="outline"
                >
                  Update payment method
                </ButtonLink>
                {!membership.cancelAtPeriodEnd && (
                  <Button variant="ghost" onClick={cancelMembership} disabled={busy}>
                    {busy ? "Working…" : "Cancel membership"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="mt-6">
              <p className="text-muted">
                You&apos;re on a free account — browse the schedule and book classes anytime.
                Add a membership whenever you&apos;re ready for full access.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/classes" size="lg">
                  Browse Classes
                </ButtonLink>
                <ButtonLink href="/membership" variant="outline" size="lg">
                  View Memberships
                </ButtonLink>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-[#ff5a7a]">{error}</p>}
        </div>

        {/* Day passes */}
        <div className="mt-6 border border-line bg-ink-2 p-7">
          <div className="flex items-center justify-between">
            <h2 className="eyebrow text-muted">Day Passes</h2>
            <ButtonLink href="/day-pass" variant="outline" size="md">
              Buy a Day Pass
            </ButtonLink>
          </div>
          {dayPasses.length === 0 ? (
            <p className="mt-6 text-muted">
              No day passes yet. Grab a single-day drop-in whenever you want to train without a
              membership.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-line">
              {dayPasses.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-fg">{formatDayLabel(p.visitDate)}</p>
                    <p className="text-xs text-muted">
                      {p.productName} · {formatPrice(p.priceCents, p.currency)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                      p.status === "redeemed" ? "text-muted" : "text-accent"
                    }`}
                  >
                    {p.status === "redeemed" ? "Used" : "Booked"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Account details */}
        <div className="mt-6 border border-line bg-ink-2 p-7">
          <h2 className="eyebrow text-muted">Account</h2>
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">Name</dt>
              <dd className="mt-1 text-fg">
                {user?.firstName} {user?.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">Email</dt>
              <dd className="mt-1 text-fg">{user?.email}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-6 text-sm text-muted">
          Need help? <Link href="/contact" className="text-accent hover:underline">Contact the club</Link>.
        </p>
      </Container>
    </section>
  );
}
