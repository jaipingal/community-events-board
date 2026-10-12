const wholePriceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const decimalPriceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

export function formatPrice(price: number) {
  if (price === 0) return "Free";
  const formatter = Number.isInteger(price) ? wholePriceFormatter : decimalPriceFormatter;
  return formatter.format(price);
}

export function formatDate(iso: string) {
  const parts = Object.fromEntries(
    dateFormatter.formatToParts(new Date(iso)).map((p) => [p.type, p.value]),
  );
  const period = String(parts.dayPeriod).toUpperCase();
  return `${parts.weekday}, ${parts.day} ${parts.month}, ${parts.hour}:${parts.minute} ${period}`;
}
