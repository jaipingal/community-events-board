import { describe, expect, it } from "vitest";
import { formatDate, formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("uses Indian digit grouping", () => {
    expect(formatPrice(150000)).toBe("₹1,50,000");
    expect(formatPrice(499)).toBe("₹499");
  });

  it("keeps paise when the price is not a whole number", () => {
    expect(formatPrice(499.5)).toBe("₹499.50");
  });

  it("shows free events as Free", () => {
    expect(formatPrice(0)).toBe("Free");
  });
});

describe("formatDate", () => {
  it("formats in IST with a short weekday and month", () => {
    expect(formatDate("2026-10-18T13:00:00.000Z")).toBe("Sun, 18 Oct, 6:30 PM");
  });

  it("rolls over to the next day in IST", () => {
    expect(formatDate("2026-10-18T20:00:00.000Z")).toBe("Mon, 19 Oct, 1:30 AM");
  });
});
