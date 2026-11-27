import { describe, expect, test } from "bun:test";
import { SEO_LANGUAGES, seoFor } from "@/content/seo";
import { TITLE_LIMIT, YOUTUBE_VIDEOS, type YouTubeVideoId, youtubeText } from "./youtubeTexts";

const IDS = Object.keys(YOUTUBE_VIDEOS) as YouTubeVideoId[];

describe("the texts for YouTube (Y-18)", () => {
  test.each(IDS)("%s: titles fit a search result", (id) => {
    const { en, de } = YOUTUBE_VIDEOS[id].title as { en: string; de?: string };
    for (const title of [en, de ?? ""]) expect(title.length, title).toBeLessThanOrEqual(TITLE_LIMIT);
  });

  test.each(IDS)("%s: the description leads to the game in every language, its own words first", (id) => {
    expect(seoFor(YOUTUBE_VIDEOS[id].path), id).toBeDefined();
    for (const language of SEO_LANGUAGES) {
      const text = youtubeText(id, language);
      expect(text.language, `${id} ${language}`).toBe(language);
      const prefix = language === "de" ? "" : `/${language}`;
      expect(text.description).toContain(`▶ https://www.littlestepstogrow.com${prefix}${YOUTUBE_VIDEOS[id].path}`);
      expect(text.description.split("\n\n").length, `${id} ${language}`).toBe(4);
    }
  });

  test("a German video gets its German title, every other language the English one", () => {
    expect(youtubeText("zaehne", "de").title).toBe(YOUTUBE_VIDEOS.zaehne.title.de);
    expect(youtubeText("zaehne", "ru").title).toBe(YOUTUBE_VIDEOS.zaehne.title.en);
  });
});
