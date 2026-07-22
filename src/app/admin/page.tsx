"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Eyebrow, DisplayHeading } from "@/components/ui/Bits";
import { formatDate } from "@/lib/format";
import type { CustomerList, MembershipStatus } from "@/lib/types";

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
  none: "—",
};

export default function AdminCustomersPage() {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [data, setData] = useState<CustomerList | null>(null);
  const [loadingList, setLoadingList] = useState(true);

  // Gate: members and anonymous visitors never see the CRM.
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace("/login?next=/admin");
    else if (!isAdmin) router.replace("/account");
  }, [loading, isAuthenticated, isAdmin, router]);

  const load = useCallback(async (q: string) => {
    setLoadingList(true);
    try {
      const res = await apiFetch<CustomerList>(
        `/api/admin/customers${q ? `?search=${encodeURIComponent(q)}` : ""}`,
      );
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const t = setTimeout(() => void load(search), 250);
    return () => clearTimeout(t);
  }, [isAdmin, search, load]);

  if (loading || !isAdmin) {
    return (
      <Container className="py-24">
        <p className="text-muted">Loading…</p>
      </Container>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-5xl">
        <Eyebrow>Owner CRM</Eyebrow>
        <DisplayHeading className="mt-4 text-[clamp(2.5rem,7vw,4rem)]">Customers</DisplayHeading>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
          <div className="border border-line bg-ink-2 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Total customers</p>
            <p className="mt-2 font-display text-3xl text-cream">{data?.totalCustomers ?? "—"}</p>
          </div>
          <div className="border border-line bg-ink-2 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Active members</p>
            <p className="mt-2 font-display text-3xl text-accent">{data?.activeMembers ?? "—"}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full max-w-md border border-line bg-ink px-4 py-3 text-fg placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto border border-line bg-ink-2">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-[0.16em] text-muted">
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Plan</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Renews / ends</th>
                <th className="px-5 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-muted">
                    Loading customers…
                  </td>
                </tr>
              ) : !data || data.customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-muted">
                    No customers found.
                  </td>
                </tr>
              ) : (
                data.customers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-line/60 transition-colors last:border-0 hover:bg-ink"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/customer?id=${c.id}`}
                        className="font-medium text-cream hover:text-accent"
                      >
                        {c.firstName} {c.lastName}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-muted">{c.email}</td>
                    <td className="px-5 py-4 text-fg">{c.planName ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-semibold uppercase tracking-[0.12em] ${statusStyles[c.membershipStatus]}`}
                      >
                        {statusLabel[c.membershipStatus]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted">{formatDate(c.currentPeriodEndUtc)}</td>
                    <td className="px-5 py-4 text-muted">{formatDate(c.joinedUtc)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
