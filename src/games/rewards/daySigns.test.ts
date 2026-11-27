import { describe, expect, test } from "bun:test";
import { DEFAULT_SIGN_SET, signSetOf, type WithSigns, withPartSign, withSignSet, withSignsShown } from "./daySigns";

describe("the signs of the times of day on a chart", () => {
  test("a chart shows the Tagesplan's pictures unless another set was picked or 🗑️ hid them", () => {
    expect(DEFAULT_SIGN_SET).toBe("pictures");
    expect(signSetOf(undefined)).toBe("pictures");
    expect(signSetOf("sky")).toBe("sky");
    expect(signSetOf("none")).toBeUndefined();
  });

  test("🗑️ hides them, „＋ Zeichen“ brings back the set they had", () => {
    const sun: WithSigns = { signs: "sun" };
    const hidden = withSignsShown(sun, false);
    expect(hidden.signs).toBe("none");
    expect(withSignsShown(hidden, true).signs).toBeUndefined();
    expect(withSignsShown(sun, true).signs).toBe("sun");
  });

  test("a set is for every part, a picture for one part alone, and picking either shows them again", () => {
    const hiddenSigns: WithSigns = { signs: "none" };
    const own = withPartSign(hiddenSigns, "morning", { emoji: "🏫", catalog: "kita" });
    expect(own.signs).toBeUndefined();
    expect(own.partSigns).toEqual({ morning: { emoji: "🏫", catalog: "kita" } });
    const set = withSignSet(own, "sky");
    expect(set.signs).toBe("sky");
    expect(set.partSigns).toBeUndefined();
    expect(withPartSign(own, "morning", undefined).partSigns).toBeUndefined();
  });
});
