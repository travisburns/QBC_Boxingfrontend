"use client";

import { getPlan } from "@/lib/plans";
import { apiFetch } from "@/lib/api";
import { SquarePaymentFields } from "@/components/checkout/SquarePaymentFields";
import type { CheckoutResult } from "@/lib/types";

/**
 * Membership checkout: collects a payment token (card / Apple Pay / Google Pay)
 * via {@link SquarePaymentFields} and exchanges it for a subscription — or,
 * in "update" mode, replaces the card on file. The raw card is tokenized in
 * Square's iframe and never reaches our server; we POST only the token.
 */
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
  const plan = getPlan(planId);
  const endpoint =
    mode === "subscribe" ? "/api/checkout/subscription" : "/api/account/payment-method";

  async function submit(token: string) {
    const res = await apiFetch<CheckoutResult>(endpoint, {
      method: "POST",
      body: {
        planId,
        sourceId: token,
        idempotencyKey: crypto.randomUUID(),
      },
    });
    onSuccess(res);
  }

  return (
    <SquarePaymentFields
      amountCents={plan?.priceCents ?? 0}
      currency={plan?.currency ?? "USD"}
      payLabel={ctaLabel}
      onToken={submit}
    />
  );
}
