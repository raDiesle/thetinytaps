// Zu Hause: the bear and his feelings, what he feels and what helps. Three kind
// things make him happy again, one not-so-good idea lies among them; tapping the
// bear strokes him, which always helps too. On his birthday he is happy already,
// and the three kind things are celebrating with him.

import type { SoundName } from "./story";

export type ComfortId = "stroke" | "hug" | "teddy" | "stomp" | "blow" | "blanket" | "lullaby" | "hand" | "light" | "dance" | "streamers";

/** One kind thing for the bear. */
export interface Comfort {
  /** What to do, in a word or two („Hand halten“): for grown-ups under the card, said by screen readers. */
  caption: string;
  narration: string;
  /** Little things that float up from him. */
  float: string;
  sound: SoundName;
}

export const COMFORTS: Record<ComfortId, Comfort> = {
  stroke: {
    caption: "Streicheln",
    narration: "Du streichelst den Bären. Ganz sanft.",
    float: "💛",
    sound: "hum",
  },
  hug: {
    caption: "Umarmen",
    narration: "Du nimmst den Bären fest in den Arm.",
    float: "💛",
    sound: "hum",
  },
  teddy: {
    caption: "Teddy geben",
    narration: "Du gibst dem Bären einen Teddy zum Kuscheln.",
    float: "💛",
    sound: "pop",
  },
  stomp: {
    caption: "Stampfen",
    narration: "Stampf, stampf! Die Wut darf raus.",
    float: "💥",
    sound: "rumble",
  },
  blow: {
    caption: "Tief pusten",
    narration: "Tief einatmen … und auspusten: Puuuh.",
    float: "💨",
    sound: "hum",
  },
  blanket: {
    caption: "Zudecken",
    narration: "Du deckst den Bären zu. Schön warm.",
    float: "✨",
    sound: "hum",
  },
  lullaby: {
    caption: "Schlaflied singen",
    narration: "Du singst ein leises Schlaflied.",
    float: "🎵",
    sound: "melody",
  },
  hand: {
    caption: "Hand halten",
    narration: "Du hältst seine Pfote. Du bist da.",
    float: "💛",
    sound: "hum",
  },
  light: {
    caption: "Licht anmachen",
    narration: "Du machst Licht an. Jetzt ist es hell.",
    float: "✨",
    sound: "chime",
  },
  dance: {
    caption: "Mittanzen",
    narration: "Ihr tanzt zusammen. Hüpf, hüpf!",
    float: "🎵",
    sound: "boing",
  },
  streamers: {
    caption: "Luftschlangen werfen",
    narration: "Du wirfst bunte Luftschlangen. Hurra!",
    float: "🎉",
    sound: "pop",
  },
};

export type FeelingId = "sad" | "angry" | "tired" | "scared" | "happy";

/** How the bear feels at the start, and what makes him happy again. */
export interface Feeling {
  id: FeelingId;
  /** For the grown-ups' choice on the start screen. */
  emoji: string;
  /** The scene in a few words („Angst bei Gewitter“): on the start screen and under the first picture. */
  title: string;
  /** Read aloud with the question. */
  intro: string;
  /** Asked after the intro, if not „Wie kannst du ihm helfen?“. */
  question?: string;
  /** The kind things on the cards, the best one first. */
  comforts: ComfortId[];
  /** The not-so-good idea, the first card: what its picture shows, why it doesn't help (read aloud), and whether something breaks (a crash instead of crying). */
  instead: { caption: string; answer: string; breaks?: boolean };
  /** Read aloud when he is happy again: what is told, then what he says. */
  end: { narration: string; line: string };
  /** What the picture of him happy again shows. */
  endCaption: string;
}

export const FEELINGS: Feeling[] = [
  {
    id: "sad",
    emoji: "😢",
    title: "Traurig, weint",
    intro: "Der Bär ist traurig. Er weint.",
    comforts: ["hug", "stroke", "teddy"],
    instead: { caption: "Teddy wegnehmen", answer: "Hmm, jetzt weint der Bär noch mehr. Tröste ihn lieber." },
    end: { narration: "Jetzt ist der Bär wieder fröhlich!", line: "Danke!" },
    endCaption: "Wieder fröhlich",
  },
  {
    id: "angry",
    emoji: "😠",
    title: "Wut, Turm umgefallen",
    intro: "Der Bär ist wütend! Sein Turm ist umgefallen.",
    comforts: ["stomp", "blow", "hug"],
    instead: { caption: "Spielzeug werfen", answer: "Hmm, Werfen macht Sachen kaputt. Lass die Wut lieber raus: Stampf ganz fest!", breaks: true },
    end: { narration: "Die Wut ist weg. Der Bär ist wieder ruhig.", line: "Danke!" },
    endCaption: "Wieder ruhig",
  },
  {
    id: "tired",
    emoji: "😴",
    title: "Müde am Abend",
    intro: "Der Bär ist müde. Er gähnt.",
    comforts: ["blanket", "lullaby", "teddy"],
    instead: { caption: "Laut trommeln", answer: "Hmm, so laut kann der Bär nicht schlafen. Sei lieber ganz leise." },
    end: { narration: "Der Bär schläft glücklich ein. Gute Nacht!", line: "Gute Nacht …" },
    endCaption: "Schläft ein",
  },
  {
    id: "scared",
    emoji: "😨",
    title: "Angst bei Gewitter",
    intro: "Der Bär hat Angst. Es donnert!",
    comforts: ["hug", "hand", "light"],
    instead: { caption: "Licht ausmachen", answer: "Hmm, im Dunkeln hat der Bär noch mehr Angst. Mach lieber Licht an." },
    end: { narration: "Das Gewitter ist vorbei. Der Bär lacht wieder!", line: "Danke!" },
    endCaption: "Wieder fröhlich",
  },
  {
    id: "happy",
    emoji: "🥳",
    title: "Freude, Geburtstag",
    intro: "Der Bär hat Geburtstag! Er freut sich so.",
    question: "Wie feierst du mit ihm?",
    comforts: ["dance", "streamers", "hug"],
    instead: { caption: "Kuchen wegnehmen", answer: "Hmm, das ist sein Geburtstagskuchen. Jetzt ist er traurig. Feier lieber mit ihm." },
    end: { narration: "Was für ein schöner Geburtstag!", line: "Danke! Das war toll!" },
    endCaption: "Geburtstagsfeier",
  },
];

/** This many kind things make the bear happy again. */
export const COMFORTS_NEEDED = 3;
