// The bear and his feelings: what he feels, and what helps. Three kind things
// make him happy again; tapping the bear strokes him, which always helps too.

import type { Mood } from "./Critter";
import type { Picture, Pose, SoundName } from "./story";

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
  /** What the card shows: the bear when it helps. */
  picture: Picture;
}

export const COMFORTS: Record<ComfortId, Comfort> = {
  stroke: {
    emoji: "✋",
    label: "Streicheln",
    narration: "Du streichelst den Bären. Ganz sanft.",
    pose: "stand",
    float: "💛",
    sound: "hum",
    picture: { cast: { bear: { x: 50, mood: "joy" } }, signs: [{ emoji: "✋", x: 50, y: 70, size: 28 }, { emoji: "💛", x: 82, y: 44, size: 16 }] },
  },
  hug: {
    emoji: "🤗",
    label: "Umarmen",
    narration: "Du nimmst den Bären fest in den Arm.",
    pose: "hug",
    float: "💛",
    sound: "hum",
    picture: { cast: { bear: { x: 50, pose: "hug", mood: "joy" } }, signs: [{ emoji: "💛", x: 80, y: 60, size: 18 }, { emoji: "💛", x: 20, y: 44, size: 14 }] },
  },
  teddy: {
    emoji: "🧸",
    label: "Teddy geben",
    narration: "Du gibst dem Bären einen Teddy zum Kuscheln.",
    pose: "hug",
    float: "💛",
    sound: "pop",
    picture: { cast: { bear: { x: 46, pose: "hug", mood: "joy", holds: "🧸" } }, signs: [{ emoji: "💛", x: 82, y: 60, size: 16 }] },
  },
  stomp: {
    emoji: "🦶",
    label: "Stampfen",
    narration: "Stampf, stampf! Die Wut darf raus.",
    pose: "stomp",
    float: "💥",
    sound: "rumble",
    picture: { cast: { bear: { x: 42, pose: "stomp", mood: "angry" } }, signs: [{ emoji: "🦶", x: 76, y: 4, size: 30 }] },
  },
  blow: {
    emoji: "💨",
    label: "Tief pusten",
    narration: "Tief einatmen … und auspusten: Puuuh.",
    pose: "breathe",
    float: "💨",
    sound: "hum",
    picture: { cast: { bear: { x: 38, pose: "breathe", mood: "neutral" } }, signs: [{ emoji: "💨", x: 76, y: 50, size: 26 }] },
  },
  blanket: {
    emoji: "🛏️",
    label: "Zudecken",
    narration: "Du deckst den Bären zu. Schön warm.",
    pose: "stand",
    float: "✨",
    sound: "hum",
    picture: { cast: { bear: { x: 50, mood: "asleep" } }, blanket: true, signs: [{ emoji: "💤", x: 80, y: 66, size: 22 }] },
  },
  lullaby: {
    emoji: "🎵",
    label: "Schlaflied",
    narration: "Du singst ein leises Schlaflied.",
    pose: "breathe",
    float: "🎵",
    sound: "melody",
    picture: { cast: { bear: { x: 50, mood: "sleepy" } }, signs: [{ emoji: "🎵", x: 82, y: 58, size: 22 }, { emoji: "🎶", x: 18, y: 66, size: 18 }] },
  },
  hand: {
    emoji: "🤝",
    label: "Hand halten",
    narration: "Du hältst seine Pfote. Du bist da.",
    pose: "reach",
    float: "💛",
    sound: "hum",
    picture: { cast: { bear: { x: 36, pose: "reach", mood: "happy" } }, signs: [{ emoji: "🤝", x: 78, y: 30, size: 26 }] },
  },
  light: {
    emoji: "💡",
    label: "Licht an",
    narration: "Du machst Licht an. Jetzt ist es hell.",
    pose: "stand",
    float: "✨",
    sound: "chime",
    picture: { cast: { bear: { x: 36, mood: "happy" } }, signs: [{ emoji: "💡", x: 76, y: 56, size: 34 }] },
  },
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
