/** Helpers for the one-time day-pass booking flow. */

/** Local calendar day as ISO "yyyy-MM-dd" (matches the <input type="date"> value). */
export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** The latest bookable day, `days` ahead of today, as ISO "yyyy-MM-dd". */
export function maxDateISO(days: number, date = new Date()): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return todayISO(d);
}

/** Friendly label for a "yyyy-MM-dd" string, e.g. "Wed, Aug 20". Parsed as local. */
export function formatDayLabel(iso: string, locale = "en-US"): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
