import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import type { StoryChapter } from "@/components/ChapterBook";
import { CATEGORIES } from "@/content/games";
import { BOTTLE_SHORT_PAGES, BOTTLE_STORY, BOTTLE_STORY_SHORT } from "@/games/bottlestory/bottleStory";
import { SHOWER_SHORT_PAGES, SHOWER_STORY, SHOWER_STORY_SHORT } from "@/games/hairshower/hairShower";
import { HAIR_SHORT_PAGES, HAIR_STORY, HAIR_STORY_SHORT } from "@/games/hairstory/hairStory";
import { KITA_SHORT_PAGES, KITA_STORY, KITA_STORY_SHORT } from "@/games/kitastory/kitaStory";
import { PACIFIER_SHORT_PAGES, PACIFIER_STORY, PACIFIER_STORY_SHORT } from "@/games/pacifierstory/pacifierStory";
import { TREE_SHORT_PAGES, TREE_STORY, TREE_STORY_SHORT } from "@/games/pacifiertree/pacifierTree";

// Every chapter book opens like „Abstillen“ on the choice of its stories, with a short version made of its own pages
// where it has one, and never lists its chapters; a story always starts on its first page (user request, 23 November
// 2026: „so vom Stil wie Abstillen … biete auch Kurzversionen an … zeige nicht mehr die einzelnen Kapitel an, jeder
// fängt diese immer von Anfang an“). Abstillen's own short version is checked in `milkchain.test.ts`.

/** Each book's whole story, its short version and the ids it is made of, with the words its pages cry and comfort in. */
const BOOKS: {
  href: string;
  /** The book's own address, where the story is not its first one (a second story lives below it). */
  book?: string;
  file: string;
  story: StoryChapter[];
  short: StoryChapter[];
  ids: readonly string[];
  cries: RegExp;
  comforts: RegExp;
}[] = [
  {
    href: "/schnullerfee/",
    file: "src/games/pacifierstory/PacifierStoryGame.tsx",
    story: PACIFIER_STORY,
    short: PACIFIER_STORY_SHORT,
    ids: PACIFIER_SHORT_PAGES,
    cries: /weint/,
    comforts: /Mama|Papa|hält|tröst|Arm|kuschel|drück/,
  },
  {
    href: "/schnullerfee/baum/",
    book: "/schnullerfee/",
    file: "src/games/pacifierstory/PacifierStoryGame.tsx",
    story: TREE_STORY,
    short: TREE_STORY_SHORT,
    ids: TREE_SHORT_PAGES,
    cries: /\bcr(y|ies)\b/,
    comforts: /Mama|Papa|hold|hug|arms|comfort|cuddle/,
  },
  {
    href: "/kita/",
    file: "src/games/kitastory/KitaStoryGame.tsx",
    story: KITA_STORY,
    short: KITA_STORY_SHORT,
    ids: KITA_SHORT_PAGES,
    cries: /weint/,
    comforts: /Mama|Papa|Mia|hält|tröst|Arm|kuschel|drück/,
  },
  {
    href: "/haare-waschen/",
    file: "src/games/hairstory/HairStoryGame.tsx",
    story: HAIR_STORY,
    short: HAIR_STORY_SHORT,
    ids: HAIR_SHORT_PAGES,
    cries: /\bcr(y|ies)\b/,
    comforts: /Mama|Papa|hold|hug|arms|comfort|cuddle/,
  },
  {
    href: "/haare-waschen/dusche/",
    book: "/haare-waschen/",
    file: "src/games/hairstory/HairStoryGame.tsx",
    story: SHOWER_STORY,
    short: SHOWER_STORY_SHORT,
    ids: SHOWER_SHORT_PAGES,
    cries: /\bcr(y|ies)\b/,
    comforts: /Mama|Papa|hold|hug|arms|comfort|cuddle/,
  },
  {
    href: "/flaeschchen/",
    file: "src/games/bottlestory/BottleStoryGame.tsx",
    story: BOTTLE_STORY,
    short: BOTTLE_STORY_SHORT,
    ids: BOTTLE_SHORT_PAGES,
    cries: /\bcr(y|ies)\b/,
    comforts: /Mama|Papa|hold|hug|arms|comfort|cuddle/,
  },
];

for (const book of BOOKS) {
  describe(`the short version of ${book.href}`, () => {
    const pages = book.story.flatMap((c) => c.pages);
    const short = book.short.flatMap((c) => c.pages);
    const ids = pages.map((p) => p.id);

    test("is made of the whole story's own pages, in their order, about a third of them", () => {
      // Every id is a page of the whole story, so a renamed page can't drop out unseen.
      expect(book.ids.filter((id) => !ids.includes(id))).toEqual([]);
      const at = short.map((p) => ids.indexOf(p.id));
      expect(at).toEqual([...at].sort((a, b) => a - b));
      expect(short.length).toBeGreaterThanOrEqual(10);
      expect(short.length).toBeLessThanOrEqual(pages.length * 0.55);
    });

    test("tells the whole way, from its first page to the love at its end", () => {
      expect(short[0].id).toBe(pages[0].id);
      expect(short.at(-1)?.id).toBe(pages.at(-1)?.id);
    });

    test("never leaves Tapsi crying: a grown-up is on that page or holds Tapsi on the next", () => {
      short.forEach((page, i) => {
        if (!book.cries.test(page.text)) return;
        expect(book.comforts.test(page.text) || book.comforts.test(short[i + 1]?.text ?? ""), page.id).toBe(true);
      });
    });

    test("has an address of its own, below the book's, opened from the choice", () => {
      const game = CATEGORIES.flatMap((c) => c.games).find((g) => g.href === (book.book ?? book.href));
      expect(game?.also).toContain(`${book.href}kurz/`);
      expect(readFileSync(book.file, "utf8")).toContain(`href: "${book.href}kurz/", version: SHORT_STORY`);
      expect(readFileSync("src/App.tsx", "utf8")).toContain(`"${book.href}kurz/"`);
    });
  });
}

test("every chapter book opens on the shared choice, and none lists its chapters", () => {
  const books = [...new Set(BOOKS.map((b) => b.file)), "src/games/milkchain/MilkChainGame.tsx", "src/games/bedstory/BedStoryGame.tsx"];
  for (const file of books) expect(readFileSync(file, "utf8"), file).toContain("<StoryBookGame book={BOOK} />");
  // Only the shared choice opens a story in `ChapterBook`; the chapter list and its classes are gone.
  const sources = [...new Bun.Glob("src/**/*.{ts,tsx,css}").scanSync()].filter((file) => !/\.test\.tsx?$/.test(file));
  const users = sources.filter((file) => readFileSync(file, "utf8").includes("<ChapterBook"));
  expect(users).toEqual(["src/components/StoryChoice.tsx"]);
  expect(sources.filter((file) => readFileSync(file, "utf8").includes("cb-toc"))).toEqual([]);
});
