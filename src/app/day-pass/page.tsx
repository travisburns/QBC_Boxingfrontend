"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { todayISO, maxDateISO, formatDayLabel } from "@/lib/dayPasses";
import { Container } from "@/components/ui/Container";
import { Eyebrow, DisplayHeading } from "@/components/ui/Bits";
import { ButtonLink } from "@/components/ui/Button";
import { SquarePaymentFields } from "@/components/checkout/SquarePaymentFields";
import type { DayPass, DayPassProduct, SavedCard } from "@/lib/types";

export default function DayPassPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [product, setProduct] = useState<DayPassProduct | null>(null);
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);
  const [visitDate, setVisitDate] = useState<string>(() => todayISO());
  const [saveCard, setSaveCard] = useState(true);
  const [result, setResult] = useState<DayPass | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Require login before buying; preserve the intended destination.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent("/day-pass")}`);
    }
  }, [loading, isAuthenticated, router]);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const products = await apiFetch<DayPassProduct[]>("/api/day-passes/products", {
        auth: false,
      });
      setProduct(products[0] ?? null);
    } catch {
      setProduct(null);
    }
    try {
      const card = await apiFetch<SavedCard>("/api/account/saved-card");
      setSavedCard(card);
    } catch {
      setSavedCard(null);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAuthenticated) void loadData();
  }, [isAuthenticated, loadData]);

  async function buy(body: Record<string, unknown>) {
    const pass = await apiFetch<DayPass>("/api/checkout/day-pass", {
      method: "POST",
      body: { productId: product!.id, visitDate, idempotencyKey: crypto.randomUUID(), ...body },
    });
    setResult(pass);
  }

  if (loading || !isAuthenticated) {
    return (
      <Container className="py-24">
        <p className="text-muted">Loading…</p>
      </Container>
    );
  }

  if (result) {
    return (
      <Container className="max-w-lg py-20 text-center">
        <div className="border border-accent/40 bg-ink-2 p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-accent-ink">
            ✓
          </div>
          <DisplayHeading className="mt-6 text-4xl">You&apos;re booked</DisplayHeading>
          <p className="mt-4 text-muted">
            Your {result.productName} is reserved for{" "}
            <span className="text-cream">{formatDayLabel(result.visitDate)}</span>. Show your name
            at the front desk when you arrive.
          </p>
          <ButtonLink href="/account" size="lg" className="mt-8">
            Go to My Account
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-4xl">
        <Eyebrow>Day Pass</Eyebrow>
        <DisplayHeading className="mt-4 text-[clamp(2.5rem,7vw,4rem)]">
          Drop In For A Day
        </DisplayHeading>
        <p className="mt-4 max-w-xl text-muted">
          No membership needed — reserve a single day and pay online. Tap with Apple Pay or Google
          Pay, or use a card.
        </p>

        {loadingData ? (
          <p className="mt-10 text-muted">Loading…</p>
        ) : !product ? (
          <p className="mt-10 text-muted">Day passes aren&apos;t available right now.</p>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* Summary + date */}
            <div className="order-2 border border-line bg-ink-2 p-7 lg:order-1">
              <h2 className="eyebrow text-muted">Your Visit</h2>
              <div className="mt-6 flex items-center justify-between border-b border-line pb-6">
                <div>
                  <p className="font-display text-2xl text-cream">{product.name}</p>
                  <p className="text-sm text-muted">{product.description}</p>
                </div>
                <p className="font-display text-3xl text-cream">
                  {formatPrice(product.priceCents, product.currency)}
                </p>
              </div>

              <label htmlFor="visitDate" className="mt-6 block text-xs uppercase tracking-[0.16em] text-muted">
                Which day?
              </label>
              <input
                id="visitDate"
                type="date"
                value={visitDate}
                min={todayISO()}
                max={maxDateISO(product.maxDaysAhead)}
                onChange={(e) => setVisitDate(e.target.value)}
                className="mt-2 w-full border border-line bg-ink-3 px-4 py-3 text-fg [color-scheme:dark] focus:border-accent focus:outline-none"
              />
              <p className="mt-2 text-xs text-muted">
                Reserve any day up to {product.maxDaysAhead} days out.
              </p>
            </div>

            {/* Payment */}
            <div className="order-1 border border-line bg-ink-2 p-7 lg:order-2">
              <h2 className="eyebrow text-muted">Payment</h2>
              <div className="mt-6">
                <SquarePaymentFields
                  amountCents={product.priceCents}
                  currency={product.currency}
                  payLabel={`Pay ${formatPrice(product.priceCents, product.currency)}`}
                  savedCard={savedCard?.hasCard ? savedCard : null}
                  onUseSavedCard={() => buy({ useSavedCard: true })}
                  onToken={(token) => buy({ sourceId: token, saveCard })}
                />

                {!savedCard?.hasCard && (
                  <label className="mt-4 flex items-center gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="accent-accent"
                    />
                    Save this card for faster checkout next time
                  </label>
                )}
              </div>
              <p className="mt-6 text-center text-xs text-muted">
                By continuing you agree to our{" "}
                <Link href="/legal/terms" className="text-accent hover:underline">
                  terms
                </Link>
                .
              </p>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
