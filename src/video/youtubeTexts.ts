// Title and description of a YouTube video made from a game (Y-18): the title from the YouTube searches looked up for
// it (research „youtube-suchen“ on /management/recherchen/), the description from the game's texts for search engines
// (`seo.ts`, `seo.<lang>.ts`) in the video's language, with the game's address on top.

import type { SeoLanguage } from "@/content/seo";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { seoWords } from "@/lib/seoText";
import { addressFor, type CodeTarget } from "./outro/content";

/** One kind of video: the game it is made from, whether it is for children, and its title. */
export interface YouTubeVideo {
  /** The game's address, where the description leads. */
  path: CodeTarget;
  /**
   * Set as „made for kids“ on YouTube: no comments, no end screens or cards, so the address in the description and
   * in the picture (the outro's QR code) is the only way to the site.
   */
  forKids: boolean;
  /**
   * Its music is a Suno song: YouTube asks AI-made music to be marked as „altered or synthetic content“, while drawn
   * pictures and a voice that is plainly a cartoon's need no mark (research „youtube-rechte“).
   */
  song: boolean;
  /**
   * Titles of at most 60 letters with the words parents type into YouTube, English first; another language uses
   * the English one until it gets its own (German was looked up with it).
   */
  title: { en: string; de?: string };
}

/** The videos there are or will be (ideas Y-06 to Y-11), by name. */
export const YOUTUBE_VIDEOS = {
  zaehne: {
    path: "/zaehne/",
    forKids: true,
    song: true,
    title: { en: "Brush Your Teeth Song for Kids – Brush Along with Tapsi", de: "Zähne putzen Lied für Kinder – Mitputzen mit Tapsi" },
  },
  toepfchen: {
    path: "/toepfchen/",
    forKids: true,
    song: true,
    title: { en: "Potty Training Song for Toddlers – Potty Time with Tapsi", de: "Töpfchen Lied für Kinder – Töpfchentraining mit Tapsi" },
  },
  "toepfchen-eltern": {
    path: "/toepfchen/",
    forKids: false,
    song: false,
    title: { en: "Potty Training Game for Toddlers – How It Works", de: "Töpfchentraining-Spiel für Kleinkinder – so geht's" },
  },
  timer: {
    path: "/timer/",
    forKids: true,
    song: false,
    title: { en: "5 Minute Visual Timer for Kids – Calm Clean Up Countdown", de: "Timer für Kinder 5 Minuten – ruhiger Aufräum-Countdown" },
  },
  schnullerfee: {
    path: "/schnullerfee/",
    forKids: true,
    song: false,
    title: { en: "Pacifier Fairy Story for Toddlers – Bye Bye Pacifier", de: "Schnullerfee Geschichte – Schnuller abgewöhnen für Kinder" },
  },
  abstillen: {
    path: "/abstillen/",
    forKids: true,
    song: false,
    title: { en: "Weaning Story for Toddlers – Goodbye Milk, Hello Cuddles", de: "Abstillen Geschichte für Kleinkinder – Tschüss Milch" },
  },
  kita: {
    path: "/kita/",
    forKids: true,
    song: false,
    title: { en: "First Day of Daycare Story for Toddlers – See You Later!", de: "Kita Eingewöhnung Geschichte – Mein erster Tag in der Kita" },
  },
} satisfies Record<string, YouTubeVideo>;

/** Name of a video in `YOUTUBE_VIDEOS`. */
export type YouTubeVideoId = keyof typeof YOUTUBE_VIDEOS;

/** YouTube cuts a title after 100 letters, search results after about 60: ours stay within that. */
export const TITLE_LIMIT = 60;

/** What goes into YouTube Studio for a video in one language. */
export interface YouTubeText {
  title: string;
  description: string;
  /** The language the description is in: the video's, or English where the game's texts lack it. */
  language: TargetLanguageId;
}

/**
 * Title and description of a video in `language`: the description's first lines are what the search result shows, so
 * the game's short description comes first, then its address, then the longer text and what the whole site promises.
 */
export function youtubeText(id: YouTubeVideoId, language: TargetLanguageId): YouTubeText {
  const video: YouTubeVideo = YOUTUBE_VIDEOS[id];
  const words = seoWords(video.path, language) ?? seoWords(video.path, "en") ?? seoWords(video.path, "de");
  const spoken = (words?.language ?? "de") as SeoLanguage;
  const title = (language === "de" && video.title.de) || video.title.en;
  const description = [words?.description, `▶ ${addressFor(video.path, spoken)}`, words?.text, words?.promise].filter(Boolean).join("\n\n");
  return { title, description, language: spoken };
}
