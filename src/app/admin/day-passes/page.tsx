"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Eyebrow, DisplayHeading } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { todayISO, formatDayLabel } from "@/lib/dayPasses";
import type { DayPassCheckIn, DayPassCheckInList } from "@/lib/types";

export default function AdminDayPassesPage() {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState<string>(() => todayISO());
  const [data, setData] = useState<DayPassCheckInList | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [redeeming, setRedeeming] = useState<number | null>(null);

  // Gate: members and anonymous visitors never see the desk view.
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace("/login?next=/admin/day-passes");
    else if (!isAdmin) router.replace("/account");
  }, [loading, isAuthenticated, isAdmin, router]);

  const load = useCallback(async (d: string) => {
    setLoadingList(true);
    try {
      const res = await apiFetch<DayPassCheckInList>(
        `/api/admin/day-passes?date=${encodeURIComponent(d)}`,
      );
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAdmin) void load(date);
  }, [isAdmin, date, load]);

  async function checkIn(id: number) {
    setRedeeming(id);
    try {
      const updated = await apiFetch<DayPassCheckIn>(`/api/admin/day-passes/${id}/redeem`, {
        method: "POST",
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              redeemed: prev.passes.filter(
                (p) => (p.id === id ? updated : p).status === "redeemed",
              ).length,
              passes: prev.passes.map((p) => (p.id === id ? updated : p)),
            }
          : prev,
      );
    } catch {
      /* leave the row as-is; the desk can retry */
    } finally {
      setRedeeming(null);
    }
  }

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
        <Eyebrow>Front Desk</Eyebrow>
        <DisplayHeading className="mt-4 text-[clamp(2.5rem,7vw,4rem)]">Day Pass Check-In</DisplayHeading>

        {/* Date + stats */}
        <div className="mt-8 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="date" className="block text-xs uppercase tracking-[0.2em] text-muted">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 border border-line bg-ink px-4 py-3 text-fg [color-scheme:dark] focus:border-accent focus:outline-none"
            />
          </div>
          <div className="border border-line bg-ink-2 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Booked</p>
            <p className="mt-1 font-display text-2xl text-cream">{data?.total ?? "—"}</p>
          </div>
          <div className="border border-line bg-ink-2 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Checked in</p>
            <p className="mt-1 font-display text-2xl text-accent">{data?.redeemed ?? "—"}</p>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto border border-line bg-ink-2">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-[0.16em] text-muted">
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Pass</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-right">Check in</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-muted">
                    Loading…
                  </td>
                </tr>
              ) : !data || data.passes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-muted">
                    No day passes booked for {formatDayLabel(date)}.
                  </td>
                </tr>
              ) : (
                data.passes.map((p) => {
                  const used = p.status === "redeemed";
                  return (
                    <tr key={p.id} className="border-b border-line/60 last:border-0">
                      <td className="px-5 py-4 font-medium text-cream">{p.customerName}</td>
                      <td className="px-5 py-4 text-muted">{p.email}</td>
                      <td className="px-5 py-4 text-fg">{p.productName}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-semibold uppercase tracking-[0.12em] ${
                            used ? "text-muted" : "text-accent"
                          }`}
                        >
                          {used ? "Checked in" : "Booked"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {used ? (
                          <span aria-hidden className="text-accent">
                            ✓
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="md"
                            onClick={() => checkIn(p.id)}
                            disabled={redeeming === p.id}
                          >
                            {redeeming === p.id ? "…" : "Check in"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
