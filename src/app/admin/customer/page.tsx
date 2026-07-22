"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Eyebrow, DisplayHeading } from "@/components/ui/Bits";
import { formatDate } from "@/lib/format";
import type { CustomerDetail, MembershipStatus } from "@/lib/types";

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
  none: "No membership",
};

function CustomerInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const id = params.get("id") ?? "";

  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace("/login?next=/admin");
    else if (!isAdmin) router.replace("/account");
  }, [loading, isAuthenticated, isAdmin, router]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoadingDetail(true);
    setNotFound(false);
    try {
      const res = await apiFetch<CustomerDetail>(`/api/admin/customers/${id}`);
      setDetail(res);
    } catch {
      setNotFound(true);
    } finally {
      setLoadingDetail(false);
    }
  }, [id]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  if (loading || !isAdmin) {
    return (
      <Container className="py-24">
        <p className="text-muted">Loading…</p>
      </Container>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link href="/admin" className="text-sm text-muted hover:text-cream">
          ← Back to customers
        </Link>

        {loadingDetail ? (
          <p className="mt-8 text-muted">Loading customer…</p>
        ) : notFound || !detail ? (
          <div className="mt-8">
            <DisplayHeading className="text-4xl">Customer not found</DisplayHeading>
            <p className="mt-4 text-muted">That customer doesn&apos;t exist.</p>
          </div>
        ) : (
          <>
            <Eyebrow className="mt-6">Customer</Eyebrow>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <DisplayHeading className="text-[clamp(2.25rem,6vw,3.5rem)]">
                {detail.firstName} {detail.lastName}
              </DisplayHeading>
              <span
                className={`text-sm font-semibold uppercase tracking-[0.16em] ${statusStyles[detail.summary.membershipStatus]}`}
              >
                {statusLabel[detail.summary.membershipStatus]}
              </span>
            </div>

            {/* Profile */}
            <div className="mt-8 border border-line bg-ink-2 p-7">
              <h2 className="eyebrow text-muted">Profile</h2>
              <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">Email</dt>
                  <dd className="mt-1 text-fg">{detail.email}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">Member since</dt>
                  <dd className="mt-1 text-fg">{formatDate(detail.joinedUtc)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">Current plan</dt>
                  <dd className="mt-1 text-fg">{detail.summary.planName ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                    {"Renews / ends"}
                  </dt>
                  <dd className="mt-1 text-fg">{formatDate(detail.summary.currentPeriodEndUtc)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">Square customer</dt>
                  <dd className="mt-1 break-all text-fg">{detail.squareCustomerId ?? "—"}</dd>
                </div>
              </dl>
            </div>

            {/* Membership history */}
            <div className="mt-6 border border-line bg-ink-2 p-7">
              <h2 className="eyebrow text-muted">Membership history</h2>
              {detail.history.length === 0 ? (
                <p className="mt-6 text-muted">No membership records yet.</p>
              ) : (
                <ul className="mt-6 space-y-4">
                  {detail.history.map((h, i) => (
                    <li key={i} className="border border-line/70 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-display text-xl text-cream">
                          {h.planName ?? h.planId}
                        </span>
                        <span
                          className={`text-xs font-semibold uppercase tracking-[0.14em] ${statusStyles[h.status]}`}
                        >
                          {statusLabel[h.status]}
                        </span>
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <div>
                          <dt className="text-xs uppercase tracking-[0.16em] text-muted">Card</dt>
                          <dd className="mt-1 text-fg">
                            {h.cardBrand && h.cardLast4
                              ? `${h.cardBrand} ···· ${h.cardLast4}`
                              : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.16em] text-muted">
                            Period end
                          </dt>
                          <dd className="mt-1 text-fg">{formatDate(h.currentPeriodEndUtc)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.16em] text-muted">Started</dt>
                          <dd className="mt-1 text-fg">{formatDate(h.createdUtc)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.16em] text-muted">Updated</dt>
                          <dd className="mt-1 text-fg">{formatDate(h.updatedUtc)}</dd>
                        </div>
                      </dl>
                      {h.cancelAtPeriodEnd && (
                        <p className="mt-3 text-sm text-[#f5c451]">
                          Set to cancel at the end of the current period.
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

export default function AdminCustomerPage() {
  return (
    <Suspense fallback={null}>
      <CustomerInner />
    </Suspense>
  );
}
