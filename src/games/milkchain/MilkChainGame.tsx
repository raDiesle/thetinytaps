import { type PointerEvent, type ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChapterBook, type StoryChapter, type StoryTranslation, withPictures } from "@/components/ChapterBook";
import { DevTag } from "@/components/DevTag";
import { GameShell } from "@/components/GameShell";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { byLanguage, type TextsLanguageId } from "@/content/texts";
import { GOODBYE_MILK } from "@/games/milkgoodbye/goodbyeMilk";
import { GOODBYE_MILK_KIND, GOODBYE_MILK_TITLE } from "@/games/milkgoodbye/names";
import { GOODBYE_TRANSLATIONS, GOODBYE_VOICE, goodbyePictureOf } from "@/games/milkgoodbye/story";
import { NIGHT_MILK } from "@/games/nightmilk/nightMilk";
import { NIGHT_MILK_KIND, NIGHT_MILK_TITLE } from "@/games/nightmilk/names";
import { NIGHT_TRANSLATIONS, NIGHT_VOICE, nightPictureOf } from "@/games/nightmilk/story";
import { goBack } from "@/lib/goBack";
import { type Texts, useT } from "@/lib/language";
import { noPointerClick } from "@/lib/press";
import { playPageTurn, playRandomNote } from "@/lib/sfx";
import { stepIndexInAddress, useStepAddress } from "@/lib/stepAddress";
import { screenTap } from "@/lib/tapGuard";
import { type RecordedVoice, recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { MILK_CHAIN, MILK_CHAIN_SHORT, minutesOf } from "./milkChain";
import { MILK_CHAIN_BOOK, MILK_CHAIN_KIND, MILK_CHAIN_TITLE } from "./names";

/** Each page's picture by its file name without extension (`kette-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** One story of the book „Abstillen“, or one version of it, to pick on its first page. */
interface Story {
  /** Its address: the book's own, or one below it (`/abstillen/nachts/`), so a link or a video lands right on it. */
  href: string;
  /** Its trophy's level, for a story at an address below the book's own (`ChapterBook`'s `level`); a version shares its story's. */
  level?: string;
  /** What it is for, the line's name in the choice. */
  kind: Texts;
  /** The story's own title, small under it. */
  title: Texts;
  /** Where the story has two versions, which one this is, on its start slip („Ganze Geschichte“, „Kurzfassung“). */
  version?: Texts;
  chapters: StoryChapter[];
  pictureOf: (id: string) => string | undefined;
  /** The page whose picture stands for the story in the choice. */
  cover: string;
  /** The colour of its line in the choice (`data-tone` in `chapterBook.css`). */
  tone: "warm" | "rose" | "night";
  voice: RecordedVoice;
  translations?: Partial<Record<TextsLanguageId, StoryTranslation>>;
  first: "de" | "en";
  /** The letter of its dev tags. */
  code: string;
}

/** „Tapsis Milchkette“, weaning altogether in chapters along the guides' steps, the whole story. */
const MILK_CHAIN_STORY: Story = {
  href: "/abstillen/",
  kind: MILK_CHAIN_KIND,
  title: MILK_CHAIN_TITLE,
  version: { en: "Whole story", de: "Ganze Geschichte", zh: "完整故事", hi: "पूरी कहानी", es: "Historia completa", ar: "القصة كاملة", ru: "Вся история" },
  chapters: MILK_CHAIN,
  pictureOf: (id) => PICTURES.get(`kette-${id}`),
  cover: "kette",
  tone: "warm",
  // Tapsi's voice reading the pages, from `stimme/` (German) and `stimme/<language>/`; a page not recorded yet stays silent.
  voice: recordedVoice(voiceFiles),
  // The story in the other languages, filled as their texts load; German is in `milkChain.ts`.
  translations: byLanguage((texts) => texts.milkChain),
  first: "de",
  code: "K",
};

/**
 * The book's stories (user requests, 22 November 2026): „Tapsis Milchkette“ whole and in its short version (its own
 * pages, `SHORT_PAGES`, read in one evening), „Three More Sleeps“ (src/games/milkgoodbye) for weaning on one day with a
 * goodbye party, and „The Milk Sleeps at Night“ (src/games/nightmilk) for families who wean only at night. Each line of
 * the choice is one story, its versions side by side on it.
 */
const LINES: Story[][] = [
  [
    MILK_CHAIN_STORY,
    {
      ...MILK_CHAIN_STORY,
      href: "/abstillen/kurz/",
      version: { en: "Short version", de: "Kurzfassung", zh: "简短版", hi: "छोटी कहानी", es: "Versión corta", ar: "النسخة القصيرة", ru: "Короткая версия" },
      chapters: MILK_CHAIN_SHORT,
      code: "S",
    },
  ],
  [
    {
      href: "/abstillen/abschied/",
      level: "abschied",
      kind: GOODBYE_MILK_KIND,
      title: GOODBYE_MILK_TITLE,
      chapters: GOODBYE_MILK,
      pictureOf: goodbyePictureOf,
      cover: "fest",
      tone: "rose",
      voice: GOODBYE_VOICE,
      translations: GOODBYE_TRANSLATIONS,
      first: "en",
      code: "F",
    },
  ],
  [
    {
      href: "/abstillen/nachts/",
      level: "nachts",
      kind: NIGHT_MILK_KIND,
      title: NIGHT_MILK_TITLE,
      chapters: NIGHT_MILK,
      pictureOf: nightPictureOf,
      cover: "weiter",
      tone: "night",
      voice: NIGHT_VOICE,
      translations: NIGHT_TRANSLATIONS,
      first: "en",
      code: "N",
    },
  ],
];

/** A story's chapters as players read them, and its pages. */
function chaptersOf(story: Story) {
  const chapters = withPictures(story.chapters, story.pictureOf);
  return { chapters, pages: chapters.flatMap((c) => c.pages) };
}

/** The book's stories with their pages as players read them, worked out once. */
const READ = new Map(LINES.flat().map((story) => [story, chaptersOf(story)]));

/** How many pages a story has for players. */
const pagesOf = (story: Story) => READ.get(story)?.pages.length ?? 0;

/**
 * The lines players see: a story whose pictures are all still waiting (in the queue, not made) is left out of the built
 * site, while the dev server shows it with its placeholders (root CLAUDE.md, „Players never see a picture that isn't made yet“).
 */
const PLAYED = LINES.map((line) => line.filter((story) => pagesOf(story) > 0)).filter((line) => line.length > 0);

/** The story an address names: the one at that address, else the book's own long story. */
const storyAt = (pathname: string) => PLAYED.flat().find((s) => s.href === (pathname.endsWith("/") ? pathname : `${pathname}/`)) ?? MILK_CHAIN_STORY;

/** A story's size on its start slip: its pictures and about how long it takes. */
const SIZE = {
  en: "{n} pictures · about {m} min",
  de: "{n} Bilder · ca. {m} Min.",
  zh: "{n}幅图 · 约{m}分钟",
  hi: "{n} चित्र · लगभग {m} मिनट",
  es: "{n} imágenes · unos {m} min",
  ar: "الصور: {n} · نحو {m} د",
  ru: "Картинок: {n} · около {m} мин.",
};

/** The start slip's word where a story has one version only. */
const READ_STORY = { en: "Read", de: "Lesen", zh: "开始读", hi: "पढ़ें", es: "Leer", ar: "ابدؤوا القراءة", ru: "Читать" };

/** The browser tab's title on an address of the book: the story's there. */
export const titleAt = (pathname: string) => storyAt(pathname).title;

export function MilkChainGame() {
  const t = useT();
  const { pathname } = useLocation();
  return (
    <GameShell
      title={t(storyAt(pathname).title)}
      // One book with nothing to choose before it: it opens at once on its choice of stories, and ✕ goes back to the shelf.
      startMode="story"
    >
      <WeaningBook />
    </GameShell>
  );
}

/** The story open in the book, and the page it opened on; none while the choice of stories is shown. */
interface Open {
  story: Story;
  page: number;
  /** The address the choice was seen at, when opening the story went to another one: the way back steps back there. */
  from?: string;
}

/**
 * The book „Abstillen“ (user request, 22 November 2026: „ein Buch, darin kann man mehrere Varianten auswählen“): it
 * opens on a choice of its stories – „Ganz abstillen“ whole or short, „Mit Abschiedsfest“ and „Nachts abstillen“ – each
 * a big line with its picture, what it is for and its title, and a start slip per version telling its pictures and
 * minutes. Each story is read with the shared `ChapterBook`, whose way back to its contents leads here.
 *
 * The address names the story: the book's own for the long one, one below it for each other story or version
 * (`/abstillen/kurz/`, `/abstillen/abschied/`, `/abstillen/nachts/`; a link or a video lands there), and `?seite=` its page or „inhalt“ for this choice. A link to a page opens that page.
 */
function WeaningBook() {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const here = storyAt(pathname);
  const [open, setOpen] = useState<Open | undefined>(() => {
    // A link's page (`?seite=7`, also after a reload); else opened from the choice at the other address (`read`),
    // whether this page stayed or came anew.
    const linked = stepIndexInAddress(READ.get(here)?.pages.length ?? 0);
    const opened = state as { page?: unknown; from?: unknown } | null;
    const from = typeof opened?.from === "string" ? opened.from : undefined;
    if (linked !== undefined) return { story: here, page: linked, from };
    return typeof opened?.page === "number" ? { story: here, page: opened.page, from } : undefined;
  });
  const { effects, ripple } = useTapFeedback();

  // The browser's back button from a story at another address (the night story opened from the book's own): the
  // address names another story than the one open, so the choice comes back.
  useEffect(() => {
    if (open && open.story !== here) setOpen(undefined);
  }, [here]);

  /** Opens a story at a page; a story at another address goes there, in the history, so the phone's back comes back. */
  const read = (story: Story, page: number) => {
    if (!screenTap()) return;
    playPageTurn(0.6);
    const from = story === here ? undefined : here.href;
    setOpen({ story, page, from });
    if (from) navigate(story.href, { state: { page, from } });
  };

  /** Back to the choice: where the story was opened from another address, a step back to it. */
  const toChoice = () => {
    const from = open?.from;
    setOpen(undefined);
    if (from) goBack(navigate, from);
  };

  if (open) {
    const { story } = open;
    return (
      <ChapterBook
        key={story.href}
        chapters={story.chapters}
        voice={story.voice}
        title={story.title}
        pictureOf={story.pictureOf}
        translations={story.translations}
        code={story.code}
        first={story.first}
        level={story.level}
        opensAt={open.page}
        onContents={toChoice}
      />
    );
  }

  return (
    <Choice
      onRead={read}
      onMiss={(e) => {
        ripple(e.clientX, e.clientY);
        playRandomNote();
      }}
    >
      <FeedbackLayer effects={effects} />
    </Choice>
  );
}

/**
 * The book's first page: its name, then one line per story – its picture, what it is for, its title – and on it a start
 * slip per version with its number of pictures and about how long it takes (user request, 22 November 2026: „nur die
 * maximale Anzahl der Bilder … und dass klar wird, wo man die Geschichte starten kann … die Dauer ca.“). The line itself
 * starts its first version too; chapters are no longer shown here.
 */
function Choice({
  onRead,
  onMiss,
  children,
}: {
  /** Opens a story at its first page. */
  onRead: (story: Story, page: number) => void;
  /** A tap beside the lines: ripples and a soft note. */
  onMiss: (e: PointerEvent) => void;
  /** The tap feedback's layer. */
  children: ReactNode;
}) {
  const t = useT();
  // The address says this page is the choice („inhalt“, as every chapter book's contents).
  useStepAddress("inhalt");
  const sizeOf = (story: Story) => {
    const pages = READ.get(story)?.pages ?? [];
    return t(SIZE)
      .replace("{n}", String(pages.length))
      .replace("{m}", String(minutesOf(pages)));
  };
  /** A press on a line or a slip: only that starts, the page beneath hears nothing. */
  const press = (story: Story) => ({
    onPointerDown: (e: PointerEvent) => {
      e.stopPropagation();
      onRead(story, 0);
    },
    // Enter, Space or a screen reader, which send no pointer.
    onClick: noPointerClick(() => onRead(story, 0)),
  });
  return (
    <div className="cb-play cb-contents cb-stories" onPointerDown={onMiss}>
      <h2 className="cb-contents-title">{t(MILK_CHAIN_BOOK)}</h2>
      <ol className="cb-story-list" data-lines={PLAYED.length}>
        {PLAYED.map((line) => {
          const [story] = line;
          const cover = story.pictureOf(story.cover);
          return (
            <li key={story.href} className="cb-story" data-tone={story.tone}>
              <button type="button" className="cb-story-open" data-tap aria-label={`${t(story.kind)}: ${t(story.title)}`} {...press(story)} />
              <div className="cb-story-body">
                <span className="cb-story-picture" aria-hidden>
                  {cover && <img src={cover} alt="" draggable={false} decoding="async" />}
                </span>
                <span className="cb-story-name" aria-hidden>
                  <span className="cb-story-kind">{t(story.kind)}</span>
                  <span className="cb-story-title">{t(story.title)}</span>
                </span>
                {/* Where to start: one slip per version, with its pictures and minutes. */}
                <span className="cb-story-starts">
                  {line.map((version) => {
                    const label = t(line.length > 1 && version.version ? version.version : READ_STORY);
                    const size = sizeOf(version);
                    return (
                      <button
                        key={version.href}
                        type="button"
                        className="cb-story-start"
                        data-tap
                        aria-label={`${t(story.kind)}, ${label}: ${size}`}
                        {...press(version)}
                      >
                        <span className="cb-story-start-label">{label}</span>
                        <span className="cb-story-start-size">{size}</span>
                      </button>
                    );
                  })}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <DevTag code="A0" id="inhalt" />
      {children}
    </div>
  );
}
