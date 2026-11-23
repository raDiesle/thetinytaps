import { type PointerEvent, type ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChapterBook, type StoryChapter, type StoryTranslation, withPictures } from "@/components/ChapterBook";
import { DevTag } from "@/components/DevTag";
import { GameShell } from "@/components/GameShell";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import type { TextsLanguageId } from "@/content/texts";
import { goBack } from "@/lib/goBack";
import { type Texts, useT } from "@/lib/language";
import { noPointerClick } from "@/lib/press";
import { playPageTurn, playRandomNote } from "@/lib/sfx";
import { stepIndexInAddress, useStepAddress } from "@/lib/stepAddress";
import { minutesOf } from "@/lib/storyPages";
import { screenTap } from "@/lib/tapGuard";
import type { RecordedVoice } from "@/lib/voice";
import "./chapterBook.css";

/** One story of a chapter book, or one version of it (whole or short), to pick on the book's first page. */
export interface BookStory {
  /** Its address: the book's own, or one below it (`/abstillen/nachts/`, `/kita/kurz/`), so a link or a video lands right on it. */
  href: string;
  /** Its trophy's level, for a story at an address below the book's own (`ChapterBook`'s `level`); a version shares its story's. */
  level?: string;
  /** Its name on its line in the choice: what it is for where a book holds several stories, else the story's title. */
  kind: Texts;
  /** The story's own title, in the browser tab and small under `kind` where it differs. */
  title: Texts;
  /** Where the story has two versions, which one this is, on its start slip (`WHOLE_STORY`, `SHORT_STORY`). */
  version?: Texts;
  chapters: StoryChapter[];
  pictureOf: (id: string) => string | undefined;
  /** The page whose picture stands for the story in the choice. */
  cover: string;
  /** The colour of its line in the choice (`data-tone` in `chapterBook.css`). */
  tone?: "warm" | "rose" | "night";
  voice?: RecordedVoice;
  translations?: Partial<Record<TextsLanguageId, StoryTranslation>>;
  first?: "de" | "en";
  /** The letter of its pages' dev tags (`K<chapter>-<page>`). */
  code: string;
}

/** The start slip of a story's whole version, beside its short one. */
export const WHOLE_STORY = {
  en: "Whole story",
  de: "Ganze Geschichte",
  zh: "完整故事",
  hi: "पूरी कहानी",
  es: "Historia completa",
  ar: "القصة كاملة",
  ru: "Вся история",
};

/** The start slip of a story's short version, made of its own pages (`shortOf`). */
export const SHORT_STORY = {
  en: "Short version",
  de: "Kurzfassung",
  zh: "简短版",
  hi: "छोटी कहानी",
  es: "Versión corta",
  ar: "النسخة القصيرة",
  ru: "Короткая версия",
};

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

/** A chapter book worked out once from its stories (`storyBook`), what its page and its game need. */
export interface StoryBookPlan {
  /** The book's name over its choice (its name on the shelf). */
  name: Texts;
  /** The letter of its choice's dev tag (`<code>0`). */
  code: string;
  /** The lines players see: one per story, its versions side by side on it. */
  lines: BookStory[][];
  /** A story's chapters and pages as players read them. */
  read: Map<BookStory, { chapters: StoryChapter[]; pages: StoryChapter["pages"] }>;
  /** The story an address names: the one at that address, else the book's first. */
  storyAt: (pathname: string) => BookStory;
}

/**
 * A chapter book from its stories, one line each with its versions (user requests, 22 and 23 November 2026: every
 * chapter book opens like „Abstillen“, on its stories with their pictures and minutes, never on its chapters). A story
 * whose pictures are all still waiting is left out of the built site, while the dev server shows it with its
 * placeholders (root CLAUDE.md, „Players never see a picture that isn't made yet“).
 */
export function storyBook(name: Texts, code: string, written: BookStory[][]): StoryBookPlan {
  const read = new Map(
    written.flat().map((story) => {
      const chapters = withPictures(story.chapters, story.pictureOf);
      return [story, { chapters, pages: chapters.flatMap((c) => c.pages) }] as const;
    }),
  );
  const lines = written.map((line) => line.filter((story) => (read.get(story)?.pages.length ?? 0) > 0)).filter((line) => line.length > 0);
  const storyAt = (pathname: string) => lines.flat().find((s) => s.href === (pathname.endsWith("/") ? pathname : `${pathname}/`)) ?? written[0][0];
  return { name, code, lines, read, storyAt };
}

/** A chapter book's game: it opens at once on the choice of its stories, and ✕ goes back to the shelf. */
export function StoryBookGame({ book }: { book: StoryBookPlan }) {
  const t = useT();
  const { pathname } = useLocation();
  return (
    <GameShell title={t(book.storyAt(pathname).title)} startMode="story">
      <StoryBook book={book} />
    </GameShell>
  );
}

/** The story open in the book, and the page it opened on; none while the choice of stories is shown. */
interface Open {
  story: BookStory;
  page: number;
  /** The address the choice was seen at, when opening the story went to another one: the way back steps back there. */
  from?: string;
}

/**
 * A chapter book (user requests, 22 November 2026 for „Abstillen“, 23 November 2026 for the others: „so vom Stil wie
 * Abstillen … zeige nicht mehr die einzelnen Kapitel an, jeder fängt diese immer von Anfang an“): it opens on a choice of
 * its stories, each a big line with its picture and name, and a start slip per version telling its pictures and
 * minutes. A story always starts on its first page – only a link to one of its pages (`?seite=7`) opens it there. Each
 * story is read with the shared `ChapterBook`, whose way back to its contents leads here.
 *
 * The address names the story: the book's own for its first, one below it for each other story or version
 * (`/abstillen/kurz/`, `/kita/kurz/`; a link or a video lands there), and `?seite=` its page or „inhalt“ for this choice.
 */
function StoryBook({ book }: { book: StoryBookPlan }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const here = book.storyAt(pathname);
  const [open, setOpen] = useState<Open | undefined>(() => {
    // A link's page (`?seite=7`, also after a reload); else opened from the choice at the other address (`read`),
    // whether this page stayed or came anew.
    const linked = stepIndexInAddress(book.read.get(here)?.pages.length ?? 0);
    const opened = state as { page?: unknown; from?: unknown } | null;
    const from = typeof opened?.from === "string" ? opened.from : undefined;
    if (linked !== undefined) return { story: here, page: linked, from };
    return typeof opened?.page === "number" ? { story: here, page: opened.page, from } : undefined;
  });
  const { effects, ripple } = useTapFeedback();

  // The browser's back button from a story at another address (the short version opened from the book's own): the
  // address names another story than the one open, so the choice comes back.
  useEffect(() => {
    if (open && open.story !== here) setOpen(undefined);
  }, [here]);

  /** Opens a story at its first page; a story at another address goes there, in the history, so the phone's back comes back. */
  const read = (story: BookStory) => {
    if (!screenTap()) return;
    playPageTurn(0.6);
    const from = story === here ? undefined : here.href;
    setOpen({ story, page: 0, from });
    if (from) navigate(story.href, { state: { page: 0, from } });
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
      book={book}
      onRead={read}
      onMiss={(x, y) => {
        ripple(x, y);
        playRandomNote();
      }}
    >
      <FeedbackLayer effects={effects} />
    </Choice>
  );
}

/** Keys that keep their own job on the choice: leaving, moving the focus and pressing the slip it is on. */
const OWN_KEYS = new Set(["Escape", "Tab", "Enter", " ", "Shift", "Control", "Alt", "Meta"]);

/**
 * The book's first page: its name, then one line per story – its picture, its name – and on it a start slip per version
 * with its number of pictures and about how long it takes (user request, 22 November 2026: „nur die maximale Anzahl der
 * Bilder … und dass klar wird, wo man die Geschichte starten kann … die Dauer ca.“). The line itself starts its first
 * version too, and so does any key; chapters are never shown here.
 */
function Choice({
  book,
  onRead,
  onMiss,
  children,
}: {
  book: StoryBookPlan;
  /** Opens a story at its first page. */
  onRead: (story: BookStory) => void;
  /** A tap beside the lines: ripples and a soft note. */
  onMiss: (x?: number, y?: number) => void;
  /** The tap feedback's layer. */
  children: ReactNode;
}) {
  const t = useT();
  // The address says this page is the choice („inhalt“, as every chapter book's contents).
  useStepAddress("inhalt");
  const first = book.lines[0]?.[0];
  useEffect(() => {
    // Every key does something: any key opens the first story from its beginning, as the book's contents once did.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || OWN_KEYS.has(e.key)) return;
      if (first) onRead(first);
      else onMiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
  const sizeOf = (story: BookStory) => {
    const pages = book.read.get(story)?.pages ?? [];
    return t(SIZE)
      .replace("{n}", String(pages.length))
      .replace("{m}", String(minutesOf(pages)));
  };
  /** A press on a line or a slip: only that starts, the page beneath hears nothing. */
  const press = (story: BookStory) => ({
    onPointerDown: (e: PointerEvent) => {
      e.stopPropagation();
      onRead(story);
    },
    // Enter, Space or a screen reader, which send no pointer.
    onClick: noPointerClick(() => onRead(story)),
  });
  return (
    <div className="cb-play cb-contents cb-stories" onPointerDown={(e) => onMiss(e.clientX, e.clientY)}>
      <h2 className="cb-contents-title">{t(book.name)}</h2>
      <ol className="cb-story-list" data-lines={book.lines.length}>
        {book.lines.map((line) => {
          const [story] = line;
          const cover = story.pictureOf(story.cover);
          const kind = t(story.kind);
          const title = t(story.title);
          return (
            <li key={story.href} className="cb-story" data-tone={story.tone ?? "warm"}>
              <button type="button" className="cb-story-open" data-tap aria-label={kind === title ? kind : `${kind}: ${title}`} {...press(story)} />
              <div className="cb-story-body">
                <span className="cb-story-picture" aria-hidden>
                  {cover && <img src={cover} alt="" draggable={false} decoding="async" />}
                </span>
                <span className="cb-story-name" aria-hidden>
                  <span className="cb-story-kind">{kind}</span>
                  {title !== kind && <span className="cb-story-title">{title}</span>}
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
                        aria-label={`${kind}, ${label}: ${size}`}
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
      <DevTag code={`${book.code}0`} id="inhalt" />
      {children}
    </div>
  );
}
