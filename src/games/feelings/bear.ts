// The bear and his feelings: what he feels, and what helps. Three kind things
// make him happy again; tapping the bear strokes him, which always helps too.

import type { SoundName } from "./story";

export type ComfortId = "stroke" | "hug" | "teddy" | "stomp" | "blow" | "blanket" | "lullaby" | "hand" | "light";

export interface Comfort {
  /** Not shown: the card is only a picture. Said by screen readers. */
  label: string;
  narration: string;
  /** Little things that float up from him. */
  float: string;
  sound: SoundName;
}

export const COMFORTS: Record<ComfortId, Comfort> = {
  stroke: {
    label: "Streicheln",
    narration: "Du streichelst den Bären. Ganz sanft.",
    float: "💛",
    sound: "hum",
  },
  hug: {
    label: "Umarmen",
    narration: "Du nimmst den Bären fest in den Arm.",
    float: "💛",
    sound: "hum",
  },
  teddy: {
    label: "Teddy geben",
    narration: "Du gibst dem Bären einen Teddy zum Kuscheln.",
    float: "💛",
    sound: "pop",
  },
  stomp: {
    label: "Stampfen",
    narration: "Stampf, stampf! Die Wut darf raus.",
    float: "💥",
    sound: "rumble",
  },
  blow: {
    label: "Tief pusten",
    narration: "Tief einatmen … und auspusten: Puuuh.",
    float: "💨",
    sound: "hum",
  },
  blanket: {
    label: "Zudecken",
    narration: "Du deckst den Bären zu. Schön warm.",
    float: "✨",
    sound: "hum",
  },
  lullaby: {
    label: "Schlaflied",
    narration: "Du singst ein leises Schlaflied.",
    float: "🎵",
    sound: "melody",
  },
  hand: {
    label: "Hand halten",
    narration: "Du hältst seine Pfote. Du bist da.",
    float: "💛",
    sound: "hum",
  },
  light: {
    label: "Licht an",
    narration: "Du machst Licht an. Jetzt ist es hell.",
    float: "✨",
    sound: "chime",
  },
};

export type FeelingId = "sad" | "angry" | "tired" | "scared";

export interface Feeling {
  id: FeelingId;
  /** For the grown-ups' choice on the start screen. */
  emoji: string;
  title: string;
  /** Read aloud with the question. */
  intro: string;
  comforts: ComfortId[];
  /** Read aloud when he is happy again: what is told, then what he says. */
  end: { narration: string; line: string };
}

export const FEELINGS: Feeling[] = [
  {
    id: "sad",
    emoji: "😢",
    title: "Traurig",
    intro: "Der Bär ist traurig. Er weint.",
    comforts: ["hug", "teddy", "stroke"],
    end: { narration: "Jetzt ist der Bär wieder fröhlich!", line: "Danke!" },
  },
  {
    id: "angry",
    emoji: "😠",
    title: "Wütend",
    intro: "Der Bär ist wütend! Sein Turm ist umgefallen.",
    comforts: ["stomp", "blow", "hug"],
    end: { narration: "Die Wut ist weg. Der Bär ist wieder ruhig.", line: "Danke!" },
  },
  {
    id: "tired",
    emoji: "😴",
    title: "Müde",
    intro: "Der Bär ist müde. Er gähnt.",
    comforts: ["blanket", "teddy", "lullaby"],
    end: { narration: "Der Bär schläft glücklich ein. Gute Nacht!", line: "Gute Nacht …" },
  },
  {
    id: "scared",
    emoji: "😨",
    title: "Angst",
    intro: "Der Bär hat Angst. Es donnert!",
    comforts: ["hand", "light", "hug"],
    end: { narration: "Das Gewitter ist vorbei. Der Bär lacht wieder!", line: "Danke!" },
  },
];

/** This many kind things make the bear happy again. */
export const COMFORTS_NEEDED = 3;
