import type { Localized } from "@/lib/language";

// Who goes to the potty and what is said at each step. Animals rather than a
// child: they have fur, so „Hose runter“ shows nothing a parent would mind, and
// the fox Tapsi is already known from the Bewegungsabenteuer.

/** One of the animals that go to the potty. */
export type AnimalId = "fox" | "bear" | "bunny";

/** How an animal looks; the drawing is the same for all, only these differ. */
export interface Animal {
  id: AnimalId;
  emoji: string;
  /** Its name, said and shown on the start screen. */
  name: string;
  fur: string;
  /** Muzzle, belly and the tip of the tail. */
  light: string;
  /** Inside of the ears, nose, outline of the fur. */
  dark: string;
  /** The colour of its trousers. */
  pants: string;
  ears: "pointy" | "round" | "long";
  tail: "bushy" | "stub" | "puff";
}

/** In the order „Weiter“ goes through them. */
export const ANIMALS: Animal[] = [
  { id: "fox", emoji: "🦊", name: "Tapsi", fur: "#f08a3c", light: "#fff4e6", dark: "#8a4a1c", pants: "#3f88c5", ears: "pointy", tail: "bushy" },
  { id: "bear", emoji: "🐻", name: "Bruno", fur: "#a8744a", light: "#f3dcc0", dark: "#5c3a20", pants: "#e05a7a", ears: "round", tail: "stub" },
  { id: "bunny", emoji: "🐰", name: "Hoppel", fur: "#d9d4e4", light: "#ffffff", dark: "#7d7590", pants: "#4caf6a", ears: "long", tail: "puff" },
];

export const animalById = (id: AnimalId) => ANIMALS.find((a) => a.id === id) ?? ANIMALS[0];

/** The animal after `id`, after the last the first again. */
export const nextAnimal = (id: AnimalId) => ANIMALS[(ANIMALS.findIndex((a) => a.id === id) + 1) % ANIMALS.length];

/** The steps of going to the potty, one tap each. */
export type StepId = "walk" | "down" | "sit" | "paper" | "up" | "flush" | "wash" | "party";

export interface Step {
  id: StepId;
  /** Its picture in the row of steps at the bottom. */
  icon: string;
  /** A small arrow next to the icon, for trousers down and up. */
  arrow?: "↓" | "↑";
  /** How long its motion takes before the next tap goes on; a tap before that only sparkles. */
  ms: number;
}

/** The waiting tune's beat while sitting. */
export const BEAT_MS = 500;

/** Sitting down, before the waiting tune starts. */
export const SIT_MS = 1000;

/** The trickle at the end of the waiting, before the next tap goes on. */
export const PEE_MS = 1800;

export const STEPS: Step[] = [
  { id: "walk", icon: "👣", ms: 2400 },
  { id: "down", icon: "👖", arrow: "↓", ms: 1000 },
  // Sitting is the long one: sit down, the waiting tune, then the trickle (see SIT_MS, PEE_MS and the tune's beats).
  { id: "sit", icon: "💧", ms: 0 },
  { id: "paper", icon: "🧻", ms: 2200 },
  { id: "up", icon: "👖", arrow: "↑", ms: 1200 },
  { id: "flush", icon: "🌀", ms: 4400 },
  { id: "wash", icon: "🧼", ms: 4600 },
  { id: "party", icon: "🎉", ms: 2400 },
];

/** What is said, in one language; `name` is the animal's name. */
export interface PottyTexts {
  /** Said at each step, as it begins. */
  steps: Record<StepId, (name: string) => string>;
  /** Said when the trickle comes after the waiting. */
  pee: string;
  /** Said when a star comes for really going. */
  star: string;
}

/** German only so far; a translation goes next to it when asked for. */
export const POTTY_TEXTS: Localized<PottyTexts> = {
  de: {
    steps: {
      walk: (name) => `${name} muss mal! Schnell zum Töpfchen!`,
      down: () => "Hose runter!",
      sit: () => "Hinsetzen. Und jetzt warten …",
      paper: () => "Abwischen mit Papier.",
      up: () => "Hose hoch!",
      flush: () => "Ausleeren und abziehen. Wuuusch!",
      wash: () => "Hände waschen mit Seife.",
      party: (name) => `Geschafft! Toll gemacht, ${name}!`,
    },
    pee: "Plitsch, platsch! Pipi ist im Töpfchen!",
    star: "Hat geklappt! Hurra, ein Stern für dich!",
  },
};
