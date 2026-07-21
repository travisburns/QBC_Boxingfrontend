/** Format a minor-unit (cents) amount as a currency string, no trailing .00. */
export function formatPrice(cents: number, currency = "USD", locale = "en-US"): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatDate(iso: string | null, locale = "en-US"): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
