// Zu Hause: the bear and his feelings, what he feels and what helps. Three kind
// things make him happy again, one not-so-good idea lies among them; tapping the
// bear strokes him, which always helps too.

import type { SoundName } from "./story";

export type ComfortId = "stroke" | "hug" | "teddy" | "stomp" | "blow" | "blanket" | "lullaby" | "hand" | "light";

/** One kind thing for the bear. */
export interface Comfort {
  /** What its picture shows, for grown-ups under the card; said by screen readers. */
  caption: string;
  narration: string;
  /** Little things that float up from him. */
  float: string;
  sound: SoundName;
}

export const COMFORTS: Record<ComfortId, Comfort> = {
  stroke: {
    caption: "Kind streichelt Bär.",
    narration: "Du streichelst den Bären. Ganz sanft.",
    float: "💛",
    sound: "hum",
  },
  hug: {
    caption: "Kind umarmt Bär.",
    narration: "Du nimmst den Bären fest in den Arm.",
    float: "💛",
    sound: "hum",
  },
  teddy: {
    caption: "Kind gibt Bär Teddy.",
    narration: "Du gibst dem Bären einen Teddy zum Kuscheln.",
    float: "💛",
    sound: "pop",
  },
  stomp: {
    caption: "Bär stampft.",
    narration: "Stampf, stampf! Die Wut darf raus.",
    float: "💥",
    sound: "rumble",
  },
  blow: {
    caption: "Bär pustet tief.",
    narration: "Tief einatmen … und auspusten: Puuuh.",
    float: "💨",
    sound: "hum",
  },
  blanket: {
    caption: "Kind deckt Bär zu.",
    narration: "Du deckst den Bären zu. Schön warm.",
    float: "✨",
    sound: "hum",
  },
  lullaby: {
    caption: "Kind singt Schlaflied.",
    narration: "Du singst ein leises Schlaflied.",
    float: "🎵",
    sound: "melody",
  },
  hand: {
    caption: "Kind hält Bärs Pfote.",
    narration: "Du hältst seine Pfote. Du bist da.",
    float: "💛",
    sound: "hum",
  },
  light: {
    caption: "Kind macht Licht an.",
    narration: "Du machst Licht an. Jetzt ist es hell.",
    float: "✨",
    sound: "chime",
  },
};

export type FeelingId = "sad" | "angry" | "tired" | "scared";

/** How the bear feels at the start, and what makes him happy again. */
export interface Feeling {
  id: FeelingId;
  /** For the grown-ups' choice on the start screen. */
  emoji: string;
  title: string;
  /** What the picture of him at the start shows, for grown-ups under it. */
  caption: string;
  /** Read aloud with the question. */
  intro: string;
  comforts: ComfortId[];
  /** The not-so-good idea among the cards: what its picture shows, and why it doesn't help (read aloud). */
  instead: { caption: string; answer: string };
  /** Read aloud when he is happy again: what is told, then what he says. */
  end: { narration: string; line: string };
  /** What the picture of him happy again shows. */
  endCaption: string;
}

export const FEELINGS: Feeling[] = [
  {
    id: "sad",
    emoji: "😢",
    title: "Traurig",
    caption: "Bär weint.",
    intro: "Der Bär ist traurig. Er weint.",
    comforts: ["hug", "teddy", "stroke"],
    instead: { caption: "Kind nimmt Teddy weg.", answer: "Hmm, jetzt weint der Bär noch mehr. Tröste ihn lieber." },
    end: { narration: "Jetzt ist der Bär wieder fröhlich!", line: "Danke!" },
    endCaption: "Bär lacht wieder.",
  },
  {
    id: "angry",
    emoji: "😠",
    title: "Wütend",
    caption: "Turm ist umgefallen, Bär ist wütend.",
    intro: "Der Bär ist wütend! Sein Turm ist umgefallen.",
    comforts: ["stomp", "blow", "hug"],
    instead: { caption: "Bär wirft Spielzeug.", answer: "Hmm, Werfen macht Sachen kaputt. Lass die Wut lieber raus: Stampf ganz fest!" },
    end: { narration: "Die Wut ist weg. Der Bär ist wieder ruhig.", line: "Danke!" },
    endCaption: "Bär ist wieder ruhig.",
  },
  {
    id: "tired",
    emoji: "😴",
    title: "Müde",
    caption: "Bär gähnt.",
    intro: "Der Bär ist müde. Er gähnt.",
    comforts: ["blanket", "teddy", "lullaby"],
    instead: { caption: "Kind trommelt laut.", answer: "Hmm, so laut kann der Bär nicht schlafen. Sei lieber ganz leise." },
    end: { narration: "Der Bär schläft glücklich ein. Gute Nacht!", line: "Gute Nacht …" },
    endCaption: "Bär schläft.",
  },
  {
    id: "scared",
    emoji: "😨",
    title: "Angst",
    caption: "Gewitter, Bär hat Angst.",
    intro: "Der Bär hat Angst. Es donnert!",
    comforts: ["hand", "light", "hug"],
    instead: { caption: "Kind macht Licht aus.", answer: "Hmm, im Dunkeln hat der Bär noch mehr Angst. Mach lieber Licht an." },
    end: { narration: "Das Gewitter ist vorbei. Der Bär lacht wieder!", line: "Danke!" },
    endCaption: "Bär lacht wieder.",
  },
];

/** This many kind things make the bear happy again. */
export const COMFORTS_NEEDED = 3;
