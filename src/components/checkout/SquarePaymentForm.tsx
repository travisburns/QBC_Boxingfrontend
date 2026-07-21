"use client";

import { useEffect, useRef, useState } from "react";
import {
  getSquareConfig,
  isSquareConfigured,
  loadSquareSdk,
  type SquareCard,
} from "@/lib/square";
import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import type { CheckoutResult } from "@/lib/types";

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

type Phase = "loading" | "ready" | "submitting" | "done" | "unavailable";

export function SquarePaymentForm({
  planId,
  mode,
  ctaLabel,
  onSuccess,
}: {
  planId: string;
  /** "subscribe" starts a subscription; "update" replaces the card on file. */
  mode: "subscribe" | "update";
  ctaLabel: string;
  onSuccess: (result: CheckoutResult) => void;
}) {
  const cardRef = useRef<SquareCard | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>(() =>
    isSquareConfigured() ? "loading" : "unavailable",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cfg = getSquareConfig();

    // Nothing to initialize when Square isn't configured (state already set).
    if (!isSquareConfigured(cfg)) return;

    (async () => {
      try {
        const sdk = await loadSquareSdk(cfg.env);
        if (cancelled) return;
        const payments = sdk.payments(cfg.appId, cfg.locationId);
        const card = await payments.card({ style: cardStyle });
        if (cancelled) return;
        await card.attach(containerRef.current as HTMLElement);
        cardRef.current = card;
        setPhase("ready");
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
      cardRef.current = null;
    };
  }, []);

  async function handlePay() {
    if (!cardRef.current || phase !== "ready") return;
    setError(null);
    setPhase("submitting");

    // 1) Tokenize the card in-browser. The PAN never reaches our server.
    let token: string;
    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK" || !result.token) {
        setError(result.errors?.[0]?.message ?? "Please check your card details.");
        setPhase("ready");
        return;
      }
      token = result.token;
    } catch {
      setError("Could not verify the card. Please try again.");
      setPhase("ready");
      return;
    }

    // 2) Send only the single-use token to the backend, which talks to Square.
    const endpoint =
      mode === "subscribe"
        ? "/api/checkout/subscription"
        : "/api/account/payment-method";
    try {
      const res = await apiFetch<CheckoutResult>(endpoint, {
        method: "POST",
        body: {
          planId,
          sourceId: token,
          idempotencyKey: crypto.randomUUID(),
        },
      });
      setPhase("done");
      onSuccess(res);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Payment could not be completed. You were not charged.",
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

  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted">
          Card details
        </span>
        {/* Square injects secure iframe fields here */}
        <div ref={containerRef} className="min-h-[52px]" />
        {phase === "loading" && (
          <p className="mt-2 text-sm text-muted">Loading secure payment form…</p>
        )}
      </div>

      {error && <p className="text-sm text-[#ff5a7a]">{error}</p>}

      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={handlePay}
        disabled={phase !== "ready"}
      >
        {phase === "submitting" ? "Processing…" : ctaLabel}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-muted">
        <span aria-hidden>🔒</span>
        Secured by Square. Your card is encrypted and never stored on our servers.
      </p>
    </div>
  );
}
