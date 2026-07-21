import { ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { clsx } from "@/lib/clsx";
import type { MembershipPlan } from "@/lib/types";

/** Pricing card used on the home teaser and the membership page. */
export function PlanCard({ plan }: { plan: MembershipPlan }) {
  return (
    <div
      className={clsx(
        "flex h-full flex-col border p-7 transition-colors",
        plan.featured
          ? "border-accent/70 bg-ink-3 shadow-[0_0_0_1px_rgba(53,214,110,0.25)]"
          : "border-line bg-ink-2 hover:border-line-strong",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-cream">{plan.name}</h3>
        {plan.featured && (
          <span className="bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-ink">
            Most Popular
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted">{plan.tagline}</p>

      <div className="mt-6 flex items-end gap-1">
        <span className="font-display text-5xl text-cream">
          {formatPrice(plan.priceCents, plan.currency)}
        </span>
        <span className="mb-1.5 text-sm text-muted">
          /{plan.cycle === "monthly" ? "mo" : "yr"}
        </span>
      </div>

      <ul className="mt-6 space-y-3 border-t border-line pt-6">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 text-sm text-fg/85">
            <span aria-hidden className="mt-0.5 text-accent">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      <ButtonLink
        href={`/checkout?plan=${plan.id}`}
        variant={plan.featured ? "solid" : "outline"}
        size="lg"
        className="mt-8 w-full"
      >
        Choose {plan.name}
      </ButtonLink>
    </div>
  );
}
