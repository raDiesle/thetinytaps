import { expect, test } from "bun:test";
import { isCrawler, pickLanguage, playLanguage } from "./locale";

test("the browser's language is found by its two-letter code", () => {
  expect(pickLanguage(["de", "en", "es"], ["es-MX", "en-US"])).toBe("es");
  expect(pickLanguage(["de", "en", "zh"], ["zh-Hans-CN"])).toBe("zh");
  expect(pickLanguage(["de", "en"], ["fr-FR"])).toBeUndefined();
});

test("players get English when the browser's language isn't there, developers German", () => {
  // In the test runner there is no browser language, so only the fallback counts.
  expect(playLanguage(["de", "en", "tr"], false)).toBe("en");
  expect(playLanguage(["de", "en", "tr"], true)).toBe("de");
  expect(playLanguage(["de", "tr"], false)).toBe("de");
});

test("search engines see the German the built pages are written in", () => {
  expect(playLanguage(["de", "en"], false, true)).toBe("de");
  expect(playLanguage(["de", "en"], false, true, "en")).toBe("en");
  // Players get their browser's language whatever the address (none in the test runner: English).
  expect(playLanguage(["de", "en", "tr"], false, false, "de")).toBe("en");
  for (const agent of [
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36",
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    "Mozilla/5.0 (compatible; DuckDuckBot-Https/1.1; https://duckduckgo.com/duckduckbot)",
  ])
    expect(isCrawler(agent), agent).toBe(true);
  expect(
    isCrawler("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"),
  ).toBe(false);
  expect(isCrawler("Mozilla/5.0 (Linux; Android 12; Cubot P60) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36")).toBe(false);
  expect(isCrawler("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36")).toBe(false);
});
