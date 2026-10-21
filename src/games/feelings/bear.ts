// The bear and his feelings: what he feels, and what helps. Three kind things
// make him happy again; tapping the bear strokes him, which always helps too.

import type { Mood } from "./Critter";
import type { Pose, SoundName } from "./story";

export type ComfortId = "stroke" | "hug" | "teddy" | "stomp" | "blow" | "blanket" | "lullaby" | "hand" | "light";

export interface Comfort {
  emoji: string;
  label: string;
  narration: string;
  /** What the bear does for a moment. */
  pose: Pose;
  /** Little things that float up from him. */
  float: string;
  sound: SoundName;
}

export const COMFORTS: Record<ComfortId, Comfort> = {
  stroke: { emoji: "✋", label: "Streicheln", narration: "Du streichelst den Bären. Ganz sanft.", pose: "stand", float: "💛", sound: "hum" },
  hug: { emoji: "🤗", label: "Umarmen", narration: "Du nimmst den Bären fest in den Arm.", pose: "hug", float: "💛", sound: "hum" },
  teddy: { emoji: "🧸", label: "Teddy geben", narration: "Du gibst dem Bären einen Teddy zum Kuscheln.", pose: "hug", float: "💛", sound: "pop" },
  stomp: { emoji: "🦶", label: "Stampfen", narration: "Stampf, stampf! Die Wut darf raus.", pose: "stomp", float: "💥", sound: "rumble" },
  blow: { emoji: "💨", label: "Tief pusten", narration: "Tief einatmen … und auspusten: Puuuh.", pose: "breathe", float: "💨", sound: "hum" },
  blanket: { emoji: "🛏️", label: "Zudecken", narration: "Du deckst den Bären zu. Schön warm.", pose: "stand", float: "✨", sound: "hum" },
  lullaby: { emoji: "🎵", label: "Schlaflied", narration: "Du singst ein leises Schlaflied.", pose: "breathe", float: "🎵", sound: "melody" },
  hand: { emoji: "🤝", label: "Hand halten", narration: "Du hältst seine Pfote. Du bist da.", pose: "reach", float: "💛", sound: "hum" },
  light: { emoji: "💡", label: "Licht an", narration: "Du machst Licht an. Jetzt ist es hell.", pose: "stand", float: "✨", sound: "chime" },
};

export type FeelingId = "sad" | "angry" | "tired" | "scared";

export interface Feeling {
  id: FeelingId;
  emoji: string;
  /** The word for the feeling, shown and said: "traurig". */
  name: string;
  mood: Mood;
  intro: string;
  /** What the bear says at first. */
  sound: string;
  comforts: ComfortId[];
  /** How he is at the end. */
  end: { emoji: string; name: string; mood: Mood; narration: string; line: string };
}

export const FEELINGS: Feeling[] = [
  {
    id: "sad",
    emoji: "😢",
    name: "traurig",
    mood: "sad",
    intro: "Der Bär ist traurig. Er weint.",
    sound: "Buhuu …",
    comforts: ["hug", "teddy", "stroke"],
    end: { emoji: "😊", name: "fröhlich", mood: "joy", narration: "Jetzt ist der Bär wieder fröhlich!", line: "Danke!" },
  },
  {
    id: "angry",
    emoji: "😠",
    name: "wütend",
    mood: "angry",
    intro: "Der Bär ist wütend! Sein Turm ist umgefallen.",
    sound: "Grrr!",
    comforts: ["stomp", "blow", "hug"],
    end: { emoji: "😊", name: "ruhig", mood: "joy", narration: "Die Wut ist weg. Der Bär ist wieder ruhig.", line: "Danke!" },
  },
  {
    id: "tired",
    emoji: "🥱",
    name: "müde",
    mood: "sleepy",
    intro: "Der Bär ist müde. Er gähnt.",
    sound: "Uaaah …",
    comforts: ["blanket", "teddy", "lullaby"],
    end: { emoji: "😴", name: "schläft", mood: "asleep", narration: "Der Bär schläft glücklich ein. Gute Nacht!", line: "Gute Nacht …" },
  },
  {
    id: "scared",
    emoji: "😨",
    name: "ängstlich",
    mood: "scared",
    intro: "Der Bär hat Angst. Es donnert!",
    sound: "Huch!",
    comforts: ["hand", "light", "hug"],
    end: { emoji: "😊", name: "mutig", mood: "joy", narration: "Das Gewitter ist vorbei. Der Bär lacht wieder!", line: "Danke!" },
  },
];

/** This many kind things make the bear happy again. */
export const COMFORTS_NEEDED = 3;
