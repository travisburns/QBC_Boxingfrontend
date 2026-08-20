"use client";

import { useEffect, useRef, useState } from "react";
import {
  getSquareConfig,
  isSquareConfigured,
  loadSquareSdk,
  toMajorAmount,
  type SquareCard,
  type SquareWallet,
} from "@/lib/square";
import { Button } from "@/components/ui/Button";

// Card iframe styling to match the dark theme.
const cardStyle = {
  input: { color: "#e9e7de", fontSize: "16px" },
  ".input-container": { borderColor: "rgba(255,255,255,0.16)", borderRadius: "2px" },
  ".input-container.is-focus": { borderColor: "#35d66e" },
  ".input-container.is-error": { borderColor: "#ff5a7a" },
  ".message-text": { color: "#8f918b" },
  ".message-icon": { color: "#8f918b" },
  "input::placeholder": { color: "#8f918b" },
} as const;

type Phase = "loading" | "ready" | "submitting" | "unavailable";

/**
 * Collects a Square payment token — via a saved card, the digital wallets
 * (Apple Pay / Google Pay), or a manually entered card — and hands it to the
 * caller through {@link onToken}. The raw card number is tokenized inside
 * Square's iframe and never touches our code. The caller decides what to do
 * with the token (which endpoint to POST it to).
 */
export function SquarePaymentFields({
  amountCents,
  currency = "USD",
  payLabel,
  walletLabel = "QBC Boxing",
  enableWallets = true,
  savedCard,
  onUseSavedCard,
  onToken,
}: {
  amountCents: number;
  currency?: string;
  payLabel: string;
  /** Merchant label shown on the wallet payment sheet. */
  walletLabel?: string;
  enableWallets?: boolean;
  /** When present (and it has a last-4), a "pay with saved card" option is offered. */
  savedCard?: { cardBrand: string | null; cardLast4: string | null } | null;
  onUseSavedCard?: () => Promise<void>;
  /** Called with a single-use token. Throw to signal failure (message is shown). */
  onToken: (token: string) => Promise<void>;
}) {
  const cardRef = useRef<SquareCard | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const googlePayRef = useRef<SquareWallet | null>(null);
  const applePayRef = useRef<SquareWallet | null>(null);
  const googlePayContainerRef = useRef<HTMLDivElement | null>(null);

  const [phase, setPhase] = useState<Phase>(() =>
    isSquareConfigured() ? "loading" : "unavailable",
  );
  const [error, setError] = useState<string | null>(null);
  const [hasGooglePay, setHasGooglePay] = useState(false);
  const [hasApplePay, setHasApplePay] = useState(false);
  const [usingSaved, setUsingSaved] = useState(Boolean(savedCard?.cardLast4));

  useEffect(() => {
    let cancelled = false;
    const cfg = getSquareConfig();
    if (!isSquareConfigured(cfg)) return;

    (async () => {
      try {
        const sdk = await loadSquareSdk(cfg.env);
        if (cancelled) return;
        const payments = sdk.payments(cfg.appId, cfg.locationId);

        // Manual card entry — always available.
        const card = await payments.card({ style: cardStyle });
        if (cancelled) return;
        await card.attach(cardContainerRef.current as HTMLElement);
        cardRef.current = card;
        setPhase("ready");

        // Digital wallets — best effort. Apple Pay needs Safari + a verified
        // domain; Google Pay needs a supporting browser. When unavailable the
        // SDK throws and we simply don't render that button (card still works).
        if (enableWallets) {
          const request = payments.paymentRequest({
            countryCode: "US",
            currencyCode: currency,
            total: { amount: toMajorAmount(amountCents), label: walletLabel },
          });

          try {
            const gp = await payments.googlePay(request);
            if (!cancelled && googlePayContainerRef.current) {
              await gp.attach?.(googlePayContainerRef.current);
              googlePayRef.current = gp;
              setHasGooglePay(true);
            }
          } catch {
            /* Google Pay unavailable here */
          }

          try {
            const ap = await payments.applePay(request);
            if (!cancelled) {
              applePayRef.current = ap;
              setHasApplePay(true);
            }
          } catch {
            /* Apple Pay unavailable here */
          }
        }
      } catch {
        if (!cancelled) {
          setError("Payment form failed to load. Refresh and try again.");
          setPhase("unavailable");
        }
      }
    })();

    return () => {
      cancelled = true;
      void cardRef.current?.destroy().catch(() => {});
      void googlePayRef.current?.destroy?.().catch(() => {});
      void applePayRef.current?.destroy?.().catch(() => {});
      cardRef.current = null;
      googlePayRef.current = null;
      applePayRef.current = null;
    };
  }, [amountCents, currency, enableWallets, walletLabel]);

  async function tokenizeWith(source: SquareCard | SquareWallet | null) {
    if (!source || phase === "submitting") return;
    setError(null);
    setPhase("submitting");
    try {
      const result = await source.tokenize();
      if (result.status !== "OK" || !result.token) {
        setError(result.errors?.[0]?.message ?? "Please check your card details.");
        setPhase("ready");
        return;
      }
      await onToken(result.token);
      // On success the parent typically navigates/unmounts; if not, re-enable.
      setPhase("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment could not be completed. You were not charged.",
      );
      setPhase("ready");
    }
  }

  async function payWithSaved() {
    if (!onUseSavedCard || phase === "submitting") return;
    setError(null);
    setPhase("submitting");
    try {
      await onUseSavedCard();
      setPhase("ready");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment could not be completed.",
      );
      setPhase("ready");
    }
  }

  if (phase === "unavailable") {
    return (
      <div className="border border-line bg-ink-3 p-6 text-sm text-muted">
        {error ??
          "Online payments aren't configured yet. Add your Square Application ID and Location ID to enable checkout."}
      </div>
    );
  }

  const busy = phase === "submitting";

  // Saved-card fast path.
  if (savedCard?.cardLast4 && usingSaved) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between border border-line bg-ink-3 p-4">
          <span className="text-sm text-fg">
            {savedCard.cardBrand ?? "Card"} ···· {savedCard.cardLast4}
          </span>
          <span className="text-xs uppercase tracking-[0.16em] text-accent">Saved</span>
        </div>
        <Button type="button" size="lg" className="w-full" onClick={payWithSaved} disabled={busy}>
          {busy ? "Processing…" : payLabel}
        </Button>
        <button
          type="button"
          className="block w-full text-center text-xs text-muted hover:text-cream"
          onClick={() => setUsingSaved(false)}
          disabled={busy}
        >
          Use a different card
        </button>
        {error && <p className="text-sm text-[#ff5a7a]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {(hasApplePay || hasGooglePay) && (
        <div className="space-y-3">
          {hasApplePay && (
            <button
              type="button"
              onClick={() => tokenizeWith(applePayRef.current)}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-[2px] bg-cream py-3.5 text-sm font-semibold text-ink disabled:opacity-50"
            >
              <span aria-hidden></span> Pay
            </button>
          )}
          {/* Google renders its official button inside this element on attach. */}
          <div
            ref={googlePayContainerRef}
            onClick={() => tokenizeWith(googlePayRef.current)}
            className={hasGooglePay ? "cursor-pointer" : "hidden"}
          />
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted">
            <span className="h-px flex-1 bg-line" />
            or pay with card
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>
      )}

      <div>
        <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted">
          Card details
        </span>
        {/* Square injects secure iframe fields here */}
        <div ref={cardContainerRef} className="min-h-[52px]" />
        {phase === "loading" && (
          <p className="mt-2 text-sm text-muted">Loading secure payment form…</p>
        )}
      </div>

      {error && <p className="text-sm text-[#ff5a7a]">{error}</p>}

      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={() => tokenizeWith(cardRef.current)}
        disabled={phase !== "ready"}
      >
        {busy ? "Processing…" : payLabel}
      </Button>

      {savedCard?.cardLast4 && (
        <button
          type="button"
          className="block w-full text-center text-xs text-muted hover:text-cream"
          onClick={() => setUsingSaved(true)}
          disabled={busy}
        >
          Use saved card ({savedCard.cardBrand ?? "card"} ···· {savedCard.cardLast4})
        </button>
      )}

      <p className="flex items-center justify-center gap-2 text-xs text-muted">
        <span aria-hidden>🔒</span>
        Secured by Square. Your card is encrypted and never stored on our servers.
      </p>
    </div>
  );
}
