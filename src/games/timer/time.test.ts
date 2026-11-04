import { describe, expect, test } from "bun:test";
import { clock, clockOn, dayKey, digits, lengthLabel, MAX_SECONDS, MIN_SECONDS, ownTimeMs, parseClock, parseLength, READY_MINUTES } from "./time";

describe("Timer: own times (H-59, H-60, H-62)", () => {
  test("a typed length: minutes alone, m:ss, h:mm:ss, kept within 10 seconds and 3 hours", () => {
    expect(parseLength("45")).toBe(45 * 60);
    expect(parseLength("7:30")).toBe(7 * 60 + 30);
    expect(parseLength(" 1:30:00 ")).toBe(90 * 60);
    expect(parseLength("0:05")).toBe(MIN_SECONDS);
    expect(parseLength("500")).toBe(MAX_SECONDS);
    for (const wrong of ["", "abc", "0", "7:75", "1:2:3:4", "-5"]) expect(parseLength(wrong)).toBeNull();
  });

  test("a typed clock time comes out as HH:MM, or null", () => {
    expect(parseClock("17:30")).toBe("17:30");
    expect(parseClock("8.10")).toBe("08:10");
    expect(parseClock("1730")).toBe("17:30");
    expect(parseClock("12")).toBe("12:00");
    for (const wrong of ["24:00", "12:60", "abc", ""]) expect(parseClock(wrong)).toBeNull();
    expect(clock(-5)).toBe("23:55");
    expect(clock(1440 + 65)).toBe("01:05");
  });

  test("a clock time ahead runs until then; one behind us today is never quietly tomorrow's", () => {
    const now = new Date(2026, 10, 4, 17, 0, 0);
    expect(ownTimeMs({ kind: "until", at: "17:30" }, now)).toBe(30 * 60_000);
    expect(ownTimeMs({ kind: "until", at: "16:59" }, now)).toBe("past");
    expect(ownTimeMs({ kind: "until", at: "17:00" }, now)).toBe("past");
    // Said „tomorrow“ today: it runs to tomorrow's; the day after, the same slip means that day's clock time again.
    expect(ownTimeMs({ kind: "until", at: "08:00", tomorrowFrom: dayKey(now) }, now)).toBe(15 * 60 * 60_000);
    const nextDay = new Date(2026, 10, 5, 7, 0, 0);
    expect(ownTimeMs({ kind: "until", at: "08:00", tomorrowFrom: dayKey(now) }, nextDay)).toBe(60 * 60_000);
    expect(clockOn("08:00", now, true)).toBe(new Date(2026, 10, 5, 8, 0, 0).getTime());
    expect(ownTimeMs({ kind: "for", seconds: 90 }, now)).toBe(90_000);
  });

  test("slips and digits read as grown-ups write them", () => {
    expect(READY_MINUTES.map((m) => lengthLabel(m * 60))).toEqual(["15 Min.", "20 Min.", "30 Min.", "45 Min.", "1 Std."]);
    expect(lengthLabel(450)).toBe("7 Min. 30 Sek.");
    expect(lengthLabel(5400)).toBe("1 Std. 30 Min.");
    expect(lengthLabel(30)).toBe("30 Sek.");
    expect(digits(277_000)).toBe("4:37");
    expect(digits(276_200)).toBe("4:37");
    expect(digits(3_877_000)).toBe("1:04:37");
    expect(digits(-5)).toBe("0:00");
  });
});
