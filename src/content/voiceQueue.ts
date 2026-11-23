/**
 * Recordings the user has asked for and that still wait for their run (user request, 21 November 2026): the network
 * of the Mac most sessions run on (the company's Zscaler) blocks ElevenLabs and Gemini, so an approved paid run is
 * written down here and made in a Claude cloud session with `/paid-queue` (`bun run paid`, `scripts/paid-queue.mjs`),
 * which records these jobs with `bun run voice make`, then makes the cheap pictures of `pictureQueue.ts` and lists the
 * sound effects of `soundQueue.ts`.
 *
 * A job only says which recordings to make, never the lines: `voice make` finds the lines still missing in the parts
 * and languages named, so a job run twice costs nothing the second time. Once its recordings are made and committed,
 * the job leaves this list (`bun run paid` says so).
 */

/** The ElevenLabs account a job records with, and the variable its key is in (never written anywhere in the repo). */
export const ACCOUNT_KEYS = {
  /** Creator: Tapsi's own voice (`stimme.json`) lives only here. */
  first: "ELEVENLABS_API_KEY",
  /** Creator since November 2026 (`--parallel 2` stays): only the clones of Tapsi (`bun run voice clone`). */
  second: "ELEVENLABS_API_KEY_2",
} as const;

/** Which account a job uses. */
export type VoiceAccount = keyof typeof ACCOUNT_KEYS;

/** The clones of Tapsi on the second account, by id, with the languages each is used for (root CLAUDE.md). */
export const CLONES: Record<string, { name: string; languages: string[] }> = {
  iGb9o2uzfokG3rIleRfg: { name: "Tapsi Coach (Klon)", languages: ["en", "zh", "hi", "es", "ar"] },
  P8WiXqMIbsXF2nUgvRI0: { name: "Tapsi Coach (Klon de)", languages: ["de"] },
  wlDm46LsfSYnFAMs48Uv: { name: "Tapsi Coach (Klon ru)", languages: ["ru"] },
};

/** One approved run of `bun run voice make`. */
export interface VoiceJob {
  /** Unique, short, for the list on `/management/` and for taking it out once made. */
  id: string;
  /** What it is for, in a few words (German, like the management page). */
  why: string;
  /** The day the user asked for it, YYYY-MM-DD. */
  date: string;
  /** Parts of `RECORDED_GAMES` (`--only`), or story folders of the Bewegungsabenteuer. */
  only: string[];
  /** Languages (`--lang`). */
  lang: string[];
  /** The account: the first for Tapsi's own voice, the second for a clone. */
  account: VoiceAccount;
  /** A clone's id (`--voice`); left out for Tapsi's own voice. */
  voice?: string;
  /** Requests at once (`--parallel`): 2 on the second account, whose plan allows 3. */
  parallel?: number;
  /** What is left to do once it is recorded (a line to switch on, a test to update); left out where the game plays the recordings as soon as they are there. */
  after?: string;
}

/** Approved and not made yet, in the order `bun run paid` records them. */
export const VOICE_QUEUE: VoiceJob[] = [
  {
    id: "clone-en-ganze-teile",
    why: "Alle Vorlesebücher, Fire Rescue, die neuen Abenteuer, Gefühle-Szenen und Tage, Timer-Bilder und Farbenbahn – ganze Teile mit dem englischen Klon",
    date: "2026-11-23",
    only: [
      "abstillen",
      "schnullerfee",
      "kita",
      "haare-waschen",
      "abstillen-nachts",
      "abstillen-abschied",
      "flaeschchen",
      "grosses-bett",
      "fireRescue",
      "kleine-abenteuer",
      "gefuehle",
      "timer",
      "kettenreaktion",
    ],
    lang: ["en", "zh", "hi", "es", "ar"],
    account: "second",
    voice: "iGb9o2uzfokG3rIleRfg",
    parallel: 2,
    after:
      "Delete the four single new machine lines of Kettenreaktion in en/zh/hi/es/ar again (Licht-Kette, Badezimmer, Große Maschine, Verrückte Küche): they would sit among Tapsi's original lines of their level.",
  },
  {
    id: "clone-de-luecken",
    why: "Deutsch: Vorlesebücher, Fire Rescue, neue Abenteuer, Timer-Bilder und Kettenreaktion mit dem deutschen Klon",
    date: "2026-11-23",
    only: [
      "abstillen",
      "schnullerfee",
      "kita",
      "haare-waschen",
      "abstillen-nachts",
      "abstillen-abschied",
      "flaeschchen",
      "grosses-bett",
      "fireRescue",
      "kleine-abenteuer",
      "timer",
      "kettenreaktion",
    ],
    lang: ["de"],
    account: "second",
    voice: "P8WiXqMIbsXF2nUgvRI0",
    parallel: 2,
  },
  {
    id: "clone-ru-alles",
    why: "Russisch: alles, was fehlt (Gefühle, Tiere, Erkennen, Was gehört zusammen?, Vorlesebücher …), mit dem russischen Klon",
    date: "2026-11-23",
    only: [
      "abstillen",
      "schnullerfee",
      "kita",
      "haare-waschen",
      "abstillen-nachts",
      "abstillen-abschied",
      "flaeschchen",
      "grosses-bett",
      "fireRescue",
      "kleine-abenteuer",
      "gefuehle",
      "tiere",
      "schatten",
      "zusammen",
      "buchstaben",
      "timer",
      "kettenreaktion",
    ],
    lang: ["ru"],
    account: "second",
    voice: "wlDm46LsfSYnFAMs48Uv",
    parallel: 2,
  },
];
