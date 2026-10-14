export const etb = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

export const when = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa",
});

export const relative = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

export function formatRelativeTime(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  const now = Date.now();

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  const seconds = Math.round((date.getTime() - now) / 1000);

  if (Math.abs(seconds) < 60) {
    return relative.format(seconds, "second");
  }

  const minutes = Math.round(seconds / 60);

  if (Math.abs(minutes) < 60) {
    return relative.format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);

  if (Math.abs(hours) < 24) {
    return relative.format(hours, "hour");
  }

  const days = Math.round(hours / 24);

  if (Math.abs(days) < 30) {
    return relative.format(days, "day");
  }

  const months = Math.round(days / 30);

  if (Math.abs(months) < 12) {
    return relative.format(months, "month");
  }

  return relative.format(Math.round(days / 365), "year");
}