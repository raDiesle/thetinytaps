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
    // More search engines that run pages: China's besides Baidu, Naver, Cốc Cốc.
    "Mozilla/5.0 (compatible; Baiduspider-render/2.0; +http://www.baidu.com/search/spider.html)",
    "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36; 360Spider",
    "Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)",
    "Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)",
    "Mozilla/5.0 (compatible; coccocbot-web/1.0; +http://help.coccoc.com/searchengine)",
    // Crawlers of Google, Bing and Yandex besides their main one that render the page.
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 (compatible; GoogleOther)",
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; BingPreview/1.0b) Chrome/116.0.1938.76 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B411 Safari/600.1.4 (compatible; YandexMobileBot/3.0; +http://yandex.com/bots)",
    "Mozilla/5.0 (compatible; YandexRenderResourcesBot/1.0; +http://yandex.com/bots)",
  ])
    expect(isCrawler(agent), agent).toBe(true);
  // Browsers that carry a search engine's name are players: Sogou's and Yandex's own browsers, and Naver's app.
  for (const agent of [
    "Mozilla/5.0 (Linux; Android 12; M2102J2SC) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36 SogouMSE,SogouMobileBrowser/6.2.5",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 YaBrowser/25.8.0.0 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36 NAVER(inapp; search; 2000; 12.14.5)",
  ])
    expect(isCrawler(agent), agent).toBe(false);
  expect(
    isCrawler("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"),
  ).toBe(false);
  expect(isCrawler("Mozilla/5.0 (Linux; Android 12; Cubot P60) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36")).toBe(false);
  expect(isCrawler("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36")).toBe(false);
});
