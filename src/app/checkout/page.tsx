"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { Eyebrow, DisplayHeading } from "@/components/ui/Bits";
import { ButtonLink } from "@/components/ui/Button";
import { SquarePaymentForm } from "@/components/checkout/SquarePaymentForm";
import type { CheckoutResult } from "@/lib/types";

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const planId = params.get("plan") ?? "";
  const isUpdate = params.get("update") === "1";
  const plan = getPlan(planId);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  // Require login before checkout; preserve the intended destination.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const next = encodeURIComponent(`/checkout?plan=${planId}${isUpdate ? "&update=1" : ""}`);
      router.replace(`/login?next=${next}`);
    }
  }, [loading, isAuthenticated, planId, isUpdate, router]);

  if (!plan) {
    return (
      <Container className="py-24 text-center">
        <DisplayHeading className="text-4xl">Plan not found</DisplayHeading>
        <p className="mt-4 text-muted">That membership plan doesn&apos;t exist.</p>
        <ButtonLink href="/membership" className="mt-8">
          View Plans
        </ButtonLink>
      </Container>
    );
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
          <DisplayHeading className="mt-6 text-4xl">
            {isUpdate ? "Card updated" : "You're in"}
          </DisplayHeading>
          <p className="mt-4 text-muted">
            {isUpdate
              ? "Your payment method has been updated."
              : `Welcome to the ${plan.name} membership. Your training starts now.`}
          </p>
          {!isUpdate && (
            <p className="mt-3 text-sm text-muted">A receipt has been emailed to you.</p>
          )}
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
        <Eyebrow>{isUpdate ? "Update Payment" : "Checkout"}</Eyebrow>
        <DisplayHeading className="mt-4 text-[clamp(2.5rem,7vw,4rem)]">
          {isUpdate ? "Update Your Card" : `Join ${plan.name}`}
        </DisplayHeading>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Order summary */}
          <div className="order-2 border border-line bg-ink-2 p-7 lg:order-1">
            <h2 className="eyebrow text-muted">Order Summary</h2>
            <div className="mt-6 flex items-center justify-between border-b border-line pb-6">
              <div>
                <p className="font-display text-2xl text-cream">{plan.name}</p>
                <p className="text-sm text-muted">{plan.tagline}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl text-cream">
                  {formatPrice(plan.priceCents, plan.currency)}
                </p>
                <p className="text-xs text-muted">/{plan.cycle === "monthly" ? "month" : "year"}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-fg/85">
                  <span aria-hidden className="text-accent">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted">
              Billed {plan.cycle}. No contract — cancel anytime from your account.
            </p>
          </div>

          {/* Payment */}
          <div className="order-1 border border-line bg-ink-2 p-7 lg:order-2">
            <h2 className="eyebrow text-muted">Payment</h2>
            <div className="mt-6">
              <SquarePaymentForm
                planId={plan.id}
                mode={isUpdate ? "update" : "subscribe"}
                ctaLabel={
                  isUpdate
                    ? "Save Card"
                    : `Start Membership · ${formatPrice(plan.priceCents, plan.currency)}/${
                        plan.cycle === "monthly" ? "mo" : "yr"
                      }`
                }
                onSuccess={setResult}
              />
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
      </Container>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
