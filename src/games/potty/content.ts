import type { Localized } from "@/lib/language";

// Who goes to the potty, the steps of the story and what is said. An animal rather
// than a child: it has fur, so „Hose runter“ shows nothing a parent would mind, and
// the fox Tapsi is already known from the Bewegungsabenteuer. Only Tapsi: every
// animal would need the whole story drawn again. Every step is a Gemini picture in
// ./bilder/ (see images.ts and bilder/README.md).

/** Tapsi the fox, who goes to the potty; Mama and Papa fox are in its pictures. */
export const TAPSI = {
  emoji: "🦊",
  /** Said and shown. */
  name: "Tapsi",
  /** The first part of every picture's name: `fox-essen`. */
  pictures: "fox",
};

/** What the animal has to do: the bladder presses after drinking, or the tummy rumbles after eating. */
export type Need = "pipi" | "kaka";

/**
 * What the child said it has to do, tapped by a grown-up on a round button while Tapsi eats and
 * drinks: often nobody knows yet ("unsure", also when nobody taps), so the story says „muss mal“
 * and the waiting brings scenes for both. What really came is chosen at the ✓.
 */
export type Said = Need | "unsure";

/** What really came, chosen at a ✓ while sitting: pipi, kaka or both at once. */
export type Went = Need | "both";

/** What a step is about: what the child said before the ✓, what came after it. */
export type Which = Said | Went;

/** The choices of `Said` in the order of their buttons; the emoji stands for it. */
export const SAID: { id: Said; emoji: string }[] = [
  { id: "pipi", emoji: "💧" },
  { id: "kaka", emoji: "💩" },
  { id: "unsure", emoji: "❓" },
];

/** The steps of the story, one tap each. */
export type StepId = "eat" | "need" | "call" | "go" | "down" | "sit" | "done" | "wipe" | "up" | "flush" | "wash" | "party";

export interface Step {
  id: StepId;
  /** Its picture in the row of steps at the bottom, for each need (see `iconFor`). */
  icon: string | Record<Need, string>;
  /** A small arrow next to the icon, for trousers down and up. */
  arrow?: "↓" | "↑";
  /** Its picture's name after the animal's (`fox-essen`), for each need; several take turns as its frames. */
  picture: string | string[] | Record<Need, string>;
  /** How long its sounds take before the next tap goes on; a tap before that only sparkles. */
  ms: number;
}

/** The synthesized waiting tune's beat while sitting (when there is no recorded song). */
export const BEAT_MS = 500;

/** Taps only sparkle this long after sitting down, so the tap that sat down doesn't end the waiting at once. */
export const SIT_GUARD_MS = 1500;

/** How long a waiting scene runs before the next tap brings another one. */
export const SCENE_MS = 900;

export const STEPS: Step[] = [
  // Eating and drinking take turns by themselves, moving from the start, while a grown-up taps what the child said.
  { id: "eat", icon: "🍝", picture: ["essen", "trinken"], ms: 2000 },
  { id: "need", icon: { pipi: "💦", kaka: "🌀" }, picture: { pipi: "blase", kaka: "bauch" }, ms: 1600 },
  { id: "call", icon: "📣", picture: "rufen", ms: 1800 },
  { id: "go", icon: "🚪", picture: "bad", ms: 1800 },
  { id: "down", icon: "👖", arrow: "↓", picture: "runter", ms: 1000 },
  // Sitting has no fixed length: the parents play scene after scene, one per tap, until the ✓ (see WAIT_SCENES).
  { id: "sit", icon: "⏳", picture: "sitzen", ms: SIT_GUARD_MS },
  { id: "done", icon: { pipi: "💧", kaka: "💩" }, picture: { pipi: "fertig-pipi", kaka: "fertig-kaka" }, ms: 2000 },
  { id: "wipe", icon: "🧻", picture: "abwischen", ms: 1600 },
  { id: "up", icon: "👖", arrow: "↑", picture: "hoch", ms: 1200 },
  { id: "flush", icon: "🚽", picture: "abziehen", ms: 2600 },
  { id: "wash", icon: "🧼", picture: "waschen", ms: 2400 },
  { id: "party", icon: "🎉", picture: "party", ms: 2400 },
];

/** A step's icon in the row: ❓ where it depends on the need and nobody knows it yet, both icons when both came. */
export function iconFor(step: Step, which: Which): string {
  const { icon } = step;
  if (typeof icon === "string") return icon;
  if (which === "unsure") return "❓";
  return which === "both" ? icon.pipi + icon.kaka : icon[which];
}

/**
 * The pictures a step shows, one after the other as its frames: while nobody knows the need (or
 * when both came), the bladder and the tummy picture take turns, so Tapsi presses its legs and holds its tummy.
 */
export function picturesFor(step: Step, which: Which): string[] {
  const { picture } = step;
  if (typeof picture === "string") return [picture];
  if (Array.isArray(picture)) return picture;
  return which === "unsure" || which === "both" ? [picture.pipi, picture.kaka] : [picture[which]];
}

/** The sound a waiting scene makes when it comes (see PottyPlay.tsx). */
export type SceneSound =
  | "trickle"
  | "splash"
  | "glug"
  | "whoosh"
  | "squeeze"
  | "blow"
  | "push"
  | "drops"
  | "train"
  | "dance"
  | "juggle"
  | "peekaboo"
  | "bubbles";

/**
 * Something Mama and Papa do while the animal sits, to keep it there: things that
 * flow and splash for pipi (letting go), things that are pressed for kaka, and
 * plain silliness for both.
 */
export interface WaitScene {
  /** Its picture's name after the animal's: `fox-warten-giesskanne`. */
  id: string;
  /** For which need it shows; "both" are the silly ones. */
  need: Need | "both";
  sound: SceneSound;
}

export const WAIT_SCENES: WaitScene[] = [
  { id: "giesskanne", need: "pipi", sound: "trickle" },
  { id: "wasserhahn", need: "pipi", sound: "splash" },
  { id: "ballon", need: "pipi", sound: "whoosh" },
  { id: "krug", need: "pipi", sound: "glug" },
  { id: "dusche", need: "pipi", sound: "trickle" },
  { id: "zahnpasta", need: "kaka", sound: "squeeze" },
  { id: "aufblasen", need: "kaka", sound: "blow" },
  { id: "schieben", need: "kaka", sound: "push" },
  { id: "schwamm", need: "kaka", sound: "drops" },
  { id: "zug", need: "kaka", sound: "train" },
  { id: "tanzen", need: "both", sound: "dance" },
  { id: "jonglieren", need: "both", sound: "juggle" },
  { id: "kuckuck", need: "both", sound: "peekaboo" },
  { id: "seifenblasen", need: "both", sound: "bubbles" },
];

/**
 * The waiting scenes for what the child said, in the order the taps bring them: one for the need,
 * one silly one, and so on (the silly ones come round again when there are more of the need's).
 * While nobody knows, pipi and kaka scenes take turns.
 */
export function scenesFor(said: Said): WaitScene[] {
  const of = (need: Need) => WAIT_SCENES.filter((s) => s.need === need);
  const own = said === "unsure" ? of("pipi").flatMap((s, i) => [s, of("kaka")[i]]) : of(said);
  const silly = WAIT_SCENES.filter((s) => s.need === "both");
  return Array.from({ length: Math.max(own.length, silly.length) }, (_, i) => [own[i], silly[i % silly.length]]).flatMap((pair) =>
    pair.filter((s) => s !== undefined),
  );
}

/** The name of a waiting scene's picture, after the animal's. */
export const scenePicture = (scene: WaitScene) => `warten-${scene.id}`;

/** What is said, in one language; `name` is Tapsi's. */
export interface PottyTexts {
  /** Said at each step, as it begins. */
  steps: Record<StepId, (name: string, which: Which) => string>;
  /** Said when a waiting scene comes, by its id. */
  scenes: Record<string, string>;
  /** Said when a grown-up taps what the child said, and the button's name for screen readers. */
  said: Record<Said, string>;
  /** Said once while sitting, so a grown-up knows what the two ✓ are for. */
  finish: string;
  /** What each ✓ means, for screen readers. */
  went: Record<Went, string>;
  /** Said when a star comes for really going. */
  star: string;
}

/** German only so far; a translation goes next to it when asked for. */
export const POTTY_TEXTS: Localized<PottyTexts> = {
  de: {
    steps: {
      eat: (name) => `Mmh! ${name} isst Nudeln und trinkt Wasser.`,
      need: (name, said) =>
        said === "pipi"
          ? `Oh! Die Blase drückt. ${name} muss Pipi!`
          : said === "kaka"
            ? `Oh! Der Bauch brummelt. ${name} muss Kaka!`
            : `Oh! Da drückt was. ${name} muss mal!`,
      call: (_, said) => `Mama! Papa! Ich muss ${said === "pipi" ? "Pipi" : said === "kaka" ? "Kaka" : "mal"}!`,
      go: () => "Mama und Papa kommen mit. Schnell ins Bad!",
      down: () => "Hose runter!",
      sit: () => "Hinsetzen. Mama und Papa warten mit.",
      done: (_, came) =>
        came === "pipi"
          ? "Plitsch, platsch! Das Pipi ist im Töpfchen!"
          : came === "kaka"
            ? "Plumps! Das Kaka ist im Töpfchen!"
            : "Plitsch, platsch, plumps! Pipi und Kaka sind im Töpfchen!",
      wipe: () => "Abwischen mit Papier.",
      up: () => "Hose hoch!",
      flush: () => "Ausleeren und abziehen. Wuuusch!",
      wash: () => "Hände waschen mit Seife.",
      party: (name) => `Geschafft! Toll gemacht, ${name}!`,
    },
    scenes: {
      giesskanne: "Papa gießt die Blume. Plitsch, platsch!",
      wasserhahn: "Mama lässt das Wasser laufen. Hörst du es plätschern?",
      ballon: "Mama lässt den Luftballon los. Pfffft!",
      krug: "Papa gießt Wasser ins Glas. Gluck, gluck, gluck!",
      dusche: "Papa lässt es regnen. Die Ente wird nass!",
      zahnpasta: "Papa drückt die Zahnpasta. Drücken, drücken!",
      aufblasen: "Mama bläst den Ballon auf. Ganz fest pusten!",
      schieben: "Papa schiebt den schweren Korb. Hau ruck!",
      schwamm: "Mama drückt den Schwamm aus. Drücken!",
      zug: "Der Zug fährt durch den Tunnel. Tschu, tschu – und raus!",
      tanzen: "Mama und Papa tanzen!",
      jonglieren: "Papa jongliert mit Klopapier!",
      kuckuck: "Wo ist Mama? Kuckuck!",
      seifenblasen: "Papa macht Seifenblasen. Plopp, plopp!",
    },
    said: {
      pipi: "Tapsi muss bald Pipi.",
      kaka: "Tapsi muss bald Kaka.",
      unsure: "Tapsi muss bald mal.",
    },
    finish: "Ist was im Töpfchen? Pipi: drück auf den Tropfen. Kaka: drück auf das Kaka. Beides: drück auf beide!",
    went: {
      pipi: "Pipi ist im Töpfchen",
      kaka: "Kaka ist im Töpfchen",
      both: "Pipi und Kaka sind im Töpfchen",
    },
    star: "Hat geklappt! Hurra, ein Stern für dich!",
  },
};
