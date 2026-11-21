import { describe, expect, test } from "bun:test";
import { chapterList, chapterText, MIN_CHAPTER_SECONDS, srt, stamp } from "./captions";

describe("chapterList", () => {
  test("starts at 0:00 and keeps chapters long enough as they are", () => {
    const list = chapterList(
      [
        { at: 0.6, title: "Time to go" },
        { at: 30, title: "On the potty" },
        { at: 160, title: "Party" },
      ],
      180,
    );
    expect(list).toEqual([
      { at: 0, title: "Time to go" },
      { at: 30, title: "On the potty" },
      { at: 160, title: "Party" },
    ]);
  });

  test("joins a short chapter to the one before, the first to the one after, so every chapter is long enough", () => {
    const list = chapterList(
      [
        { at: 0.6, title: "A" },
        { at: 4, title: "B" },
        { at: 30, title: "C" },
        { at: 33, title: "D" },
        { at: 60, title: "E" },
        { at: 75, title: "F" },
      ],
      80,
    );
    expect(list.map((c) => c.title)).toEqual(["A · B · C", "D", "E · F"]);
    list.forEach((c, i) => {
      expect((list[i + 1]?.at ?? 80) - c.at).toBeGreaterThanOrEqual(MIN_CHAPTER_SECONDS);
    });
  });

  test("the same title twice in a row is one chapter, marks after the end are left out", () => {
    expect(
      chapterList(
        [
          { at: 0, title: "Sit" },
          { at: 20, title: "Sit" },
          { at: 40, title: "Hen" },
          { at: 99, title: "Late" },
        ],
        60,
      ),
    ).toEqual([
      { at: 0, title: "Sit" },
      { at: 40, title: "Hen" },
    ]);
  });
});

test("stamps and chapter text are written as YouTube reads them", () => {
  expect(stamp(7.9)).toBe("0:07");
  expect(stamp(750)).toBe("12:30");
  expect(stamp(3723)).toBe("1:02:03");
  expect(
    chapterText([
      { at: 0, title: "Time to go" },
      { at: 75, title: "Party" },
    ]),
  ).toBe("0:00 Time to go\n1:15 Party");
});

test("subtitles end where the next line starts and never after the video", () => {
  const file = srt(
    [
      { at: 1.5, seconds: 3, text: "Mmh! Tapsi eats." },
      { at: 3, seconds: 2, text: "Oh!" },
      { at: 9, seconds: 5, text: "Well done!" },
    ],
    10,
  );
  expect(file).toBe(
    "1\n00:00:01,500 --> 00:00:03,000\nMmh! Tapsi eats.\n\n2\n00:00:03,000 --> 00:00:05,000\nOh!\n\n3\n00:00:09,000 --> 00:00:10,000\nWell done!\n",
  );
});
