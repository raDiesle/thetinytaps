import { expect, test } from "@rstest/core";
import { pickLanguage, playLanguage } from "./locale";

test("the browser's language is found by its two-letter code", () => {
  expect(pickLanguage(["de", "en", "es"], ["es-MX", "en-US"])).toBe("es");
  expect(pickLanguage(["de", "en", "zh"], ["zh-Hans-CN"])).toBe("zh");
  expect(pickLanguage(["de", "en"], ["fr-FR"])).toBeUndefined();
});

test("players get English when the browser's language isn't there, developers German", () => {
  // In Node there is no browser language, so only the fallback counts.
  expect(playLanguage(["de", "en", "tr"], false)).toBe("en");
  expect(playLanguage(["de", "en", "tr"], true)).toBe("de");
  expect(playLanguage(["de", "tr"], false)).toBe("de");
});
