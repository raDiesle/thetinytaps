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

/** What really came, chosen at a ✓ while sitting: pipi, kaka or both at once. */
export type Went = Need | "both";

/**
 * What the child said it has to do, tapped by a grown-up on a button while Tapsi calls Mama and Papa: one of
 * pipi, kaka or both, and the story goes on only with that tap. Before it nobody knows yet ("unsure", also
 * after jumping past calling in the row of steps, which asks again on the way), so the story says „muss mal“
 * and otherwise treats it like both. What really came is chosen at the ✓.
 */
export type Said = Went | "unsure";

/** What a step is about: what the child said before the ✓, what came after it. */
export type Which = Said | Went;

/**
 * The buttons for what the child said, in their order; the emoji stands for it. No ❓: not knowing is
 * the same as both (the user's choice), so 💧💩 is that button.
 */
export const SAID: { id: Went; emoji: string }[] = [
  { id: "pipi", emoji: "💧" },
  { id: "kaka", emoji: "💩" },
  { id: "both", emoji: "💧💩" },
];

/** What the ✓ of what the child said is, and what came when a grown-up skips the ✓: both when nobody knew. */
export const expectedWent = (said: Said): Went => (said === "unsure" ? "both" : said);

/** The steps of the story, one tap each. */
export type StepId = "eat" | "need" | "call" | "go" | "down" | "sit" | "done" | "wipe" | "up" | "flush" | "wash" | "party" | "stars" | "play";

export interface Step {
  id: StepId;
  /** Its picture in the row of steps at the bottom, for each need (see `iconFor`). */
  icon: string | Record<Need, string>;
  /** A small arrow next to the icon, for trousers down and up. */
  arrow?: "↓" | "↑";
  /** Its picture's name after the animal's (`fox-essen`), for each need; several take turns as its frames. */
  picture: string | string[] | Record<Need, string>;
  /** Pictures played once before `picture`, one after the other: a tiny animation of what happens (trousers going down). */
  moves?: string[];
  /** The tiny animation (`moves`) plays again after this pause, over and over until the story goes on. */
  again?: number;
  /** How long its sounds take before the next tap goes on; a tap before that only sparkles. */
  ms: number;
  /**
   * The story goes on by itself after this long. Without it the step waits for a tap or „Weiter“: what the child
   * really does with its own trousers, bottom and hands takes as long as it takes.
   */
  auto?: number;
  /**
   * Never goes on by itself, and „Weiter“ calls for attention, since a grown-up reads the story out at their own
   * pace: the first steps, where nothing real happens yet. Any tap or key goes on there too – except while the
   * buttons for what the child said show: they are the only way on then, and call for attention instead.
   */
  nudge?: true;
}

/** The synthesized waiting tune's beat while sitting (when there is no recorded song). */
export const BEAT_MS = 500;

/** Taps only sparkle this long after sitting down, so the tap that sat down doesn't end the waiting at once. */
export const SIT_GUARD_MS = 1500;

/** How long a thought runs before the next tap brings another one. */
export const SCENE_MS = 900;

/** How long a thought shows before the next one comes by itself. */
export const WAIT_SCENE_MS = 2600;

export const STEPS: Step[] = [
  // Eating and drinking take turns as the step's frames, moving from the start; the first steps wait for „Weiter“.
  { id: "eat", icon: "🍝", picture: ["essen", "trinken"], ms: 2000, nudge: true },
  { id: "need", icon: { pipi: "💦", kaka: "🌀" }, picture: { pipi: "blase", kaka: "bauch" }, ms: 1600, nudge: true },
  // Here (and on the way, while nothing was picked) a grown-up taps what the child said, and only that goes on.
  { id: "call", icon: "📣", picture: "rufen", ms: 1800, nudge: true },
  { id: "go", icon: "🚪", picture: "bad", ms: 1800, nudge: true },
  // The child takes its own trousers down: no timer, „Weiter“ when it's done.
  // The trousers go down again and again, so the child sees what to do while it does it.
  { id: "down", icon: "👖", arrow: "↓", picture: "runter", moves: ["runter-1", "runter-2"], again: 1500, ms: 1200 },
  // Sitting down goes on by itself into the waiting, which has no fixed length: thought after thought until the ✓ (see WAIT_SCENES).
  { id: "sit", icon: "⏳", picture: "sitzen", moves: ["sitzen-1"], ms: SIT_GUARD_MS, auto: 3000 },
  { id: "done", icon: { pipi: "💧", kaka: "💩" }, picture: { pipi: "fertig-pipi", kaka: "fertig-kaka" }, ms: 2000, auto: 3500 },
  { id: "wipe", icon: "🧻", picture: "abwischen", ms: 1600 },
  { id: "up", icon: "👖", arrow: "↑", picture: "hoch", ms: 1200 },
  { id: "flush", icon: "🚽", picture: "abziehen", ms: 2600 },
  { id: "wash", icon: "🧼", picture: "waschen", ms: 2400 },
  { id: "party", icon: "🎉", picture: "party", ms: 2400 },
  // The end: this week's stars over the party picture, with a new one today when a grown-up tapped a ✓ (PottyPlay.tsx).
  { id: "stars", icon: "⭐", picture: "party", ms: 2400 },
];

const SIT = STEPS.findIndex((s) => s.id === "sit");

/**
 * The story when nothing came on the potty (the „nichts“ next to the ✓): from sitting straight to washing hands, then
 * Tapsi plays in its room and Mama and Papa look in at the door to ask whether it has to go – the story ends there.
 */
export const NOTHING_STEPS: Step[] = [
  ...STEPS.slice(0, SIT + 1),
  ...STEPS.filter((s) => s.id === "wash"),
  { id: "play", icon: "🧸", picture: "spielen", ms: 2400 },
];

/** The steps of the story: the usual one, or the one when nothing came. */
export const storyFor = (nothing: boolean) => (nothing ? NOTHING_STEPS : STEPS);

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
  | "plop"
  | "dance"
  | "juggle"
  | "peekaboo"
  | "bubbles"
  | "toot"
  | "chime";

/**
 * What Tapsi thinks of while it sits, in a thought bubble over the still bathroom picture: things that
 * flow and splash for pipi (letting go), things that are pressed for kaka, and plain silliness.
 */
export interface WaitScene {
  /** Its picture's name after the animal's: `fox-denken-giesskanne`. */
  id: string;
  /** Shown in the bubble while it has no picture yet. */
  emoji: string;
  /** For which need it shows; "silly" ones are kept but not shown (see scenesFor). */
  need: Need | "silly";
  sound: SceneSound;
}

export const WAIT_SCENES: WaitScene[] = [
  { id: "giesskanne", emoji: "🌻💦", need: "pipi", sound: "trickle" },
  { id: "brunnen", emoji: "⛲", need: "pipi", sound: "splash" },
  { id: "ballon", emoji: "🎈💨", need: "pipi", sound: "whoosh" },
  { id: "regen", emoji: "🌧️☔", need: "pipi", sound: "trickle" },
  { id: "schlauch", emoji: "💦🦆", need: "pipi", sound: "splash" },
  { id: "wasserrad", emoji: "💧🎡", need: "pipi", sound: "trickle" },
  { id: "tee", emoji: "🫖☕", need: "pipi", sound: "glug" },
  { id: "elefant", emoji: "🐘💦", need: "pipi", sound: "splash" },
  { id: "wal", emoji: "🐳", need: "pipi", sound: "blow" },
  { id: "trichter", emoji: "🫗", need: "pipi", sound: "trickle" },
  { id: "ketchup", emoji: "🍅🍝", need: "kaka", sound: "squeeze" },
  { id: "aufblasen", emoji: "😤🎈", need: "kaka", sound: "blow" },
  { id: "huhn", emoji: "🐔🥚", need: "kaka", sound: "plop" },
  { id: "knete", emoji: "🟠🟣🟢", need: "kaka", sound: "squeeze" },
  { id: "spritzbeutel", emoji: "🍰", need: "kaka", sound: "squeeze" },
  { id: "erbsen", emoji: "🫛", need: "kaka", sound: "plop" },
  // Waiting until something comes out, without pressing: for children afraid of kaka.
  { id: "tunnel", emoji: "🚂", need: "kaka", sound: "toot" },
  { id: "schmetterling", emoji: "🦋", need: "kaka", sound: "chime" },
  { id: "tanzen", emoji: "💃🕺", need: "silly", sound: "dance" },
  { id: "jonglieren", emoji: "🤹", need: "silly", sound: "juggle" },
  { id: "kuckuck", emoji: "🙈", need: "silly", sound: "peekaboo" },
  { id: "seifenblasen", emoji: "🫧", need: "silly", sound: "bubbles" },
];

/**
 * The waiting scenes for what the child said, in the order they come: only the scenes that help with that
 * need (the user's choice, so the waiting stays on letting go or pressing); for both or while nobody knows,
 * pipi and kaka scenes take turns. The silly ones are not shown.
 */
export function scenesFor(said: Said): WaitScene[] {
  const of = (need: Need) => WAIT_SCENES.filter((s) => s.need === need);
  if (said === "pipi" || said === "kaka") return of(said);
  return of("pipi")
    .flatMap((s, i) => [s, of("kaka")[i]])
    .filter((s) => s !== undefined);
}

/** The name of a waiting scene's picture in the thought bubble, after the animal's. */
export const scenePicture = (scene: WaitScene) => `denken-${scene.id}`;

/** What is said, in one language; `name` is Tapsi's. */
export interface PottyTexts {
  /** Said at each step, as it begins. */
  steps: Record<StepId, (name: string, which: Which) => string>;
  /** Said when a waiting scene comes, by its id. */
  scenes: Record<string, string>;
  /** Said when a grown-up taps what the child said, and the button's name for screen readers. */
  said: Record<Went, string>;
  /** The „Weiter“ button's name for screen readers. */
  next: string;
  /** Over the buttons for what the child said, for the grown-up, and said when a tap misses them. */
  askSaid: string;
  /** Over the ✓ while sitting, for the grown-up. */
  askWent: string;
  /** Said once while sitting, so a grown-up knows what the two ✓ are for. */
  finish: string;
  /** What each ✓ means, for screen readers. */
  went: Record<Need, string>;
  /** The button for nothing next to the ✓, for screen readers, and said when it is tapped. */
  nothing: string;
  /** What that button says, for the grown-up. */
  nothingButton: string;
  /** Said at the end instead of the step's line when a star comes for really going. */
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
            : said === "both"
              ? `Oh! Die Blase drückt und der Bauch brummelt. ${name} muss Pipi und Kaka!`
              : `Oh! Da drückt was. ${name} muss mal!`,
      call: (_, said) => `Mama! Papa! Ich muss ${said === "pipi" ? "Pipi" : said === "kaka" ? "Kaka" : said === "both" ? "Pipi und Kaka" : "mal"}!`,
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
      stars: () => "Das sind deine Sterne.",
      play: (name) => `${name} spielt. Mama und Papa schauen rein: Musst du Pipi oder Kaka?`,
    },
    scenes: {
      giesskanne: "Tapsi gießt die Blume. Plitsch, platsch!",
      brunnen: "Der Brunnen sprudelt. Hörst du es plätschern?",
      ballon: "Tapsi lässt den Luftballon los. Pfffft!",
      regen: "Es regnet. Platsch, in die Pfütze!",
      schlauch: "Tapsi spritzt mit dem Schlauch. Die Ente wird nass!",
      ketchup: "Tapsi drückt den Ketchup. Drücken, drücken!",
      aufblasen: "Tapsi bläst den Ballon auf. Ganz fest pusten!",
      huhn: "Das Huhn drückt ganz fest. Plopp, ein Ei!",
      knete: "Tapsi drückt die Knete. Da kommen Würstchen raus!",
      wasserrad: "Das Wasser dreht das Rad. Plätscher, plätscher!",
      tee: "Tapsi gießt Tee ein. Gluck, gluck, gluck!",
      spritzbeutel: "Tapsi drückt den Spritzbeutel. Sahne auf den Kuchen!",
      erbsen: "Tapsi drückt die Schote. Plopp, plopp, die Erbsen!",
      tunnel: "Der Zug ist im Tunnel. Tuut, da kommt er raus!",
      elefant: "Der Elefant spritzt mit dem Rüssel. Pschhh!",
      wal: "Der Wal pustet Wasser hoch. Pfffft!",
      trichter: "Tapsi gießt Wasser in den Trichter. Unten läuft es raus!",
      schmetterling: "Der Schmetterling drückt sich raus. Jetzt fliegt er!",
      tanzen: "Mama und Papa tanzen!",
      jonglieren: "Papa jongliert mit Klopapier!",
      kuckuck: "Wo ist Mama? Kuckuck!",
      seifenblasen: "Papa macht Seifenblasen. Plopp, plopp!",
    },
    said: {
      pipi: "Tapsi muss bald Pipi.",
      kaka: "Tapsi muss bald Kaka.",
      both: "Tapsi muss bald Pipi und Kaka.",
    },
    next: "Weiter",
    askSaid: "Was muss dein Kind?",
    askWent: "Was ist im Töpfchen?",
    finish: "Ist was im Töpfchen? Pipi: drück auf den Tropfen. Kaka: drück auf das Kaka.",
    went: {
      pipi: "Pipi ist im Töpfchen",
      kaka: "Kaka ist im Töpfchen",
    },
    nothing: "Heute kommt nichts. Macht nichts!",
    nothingButton: "nichts",
    star: "Hat geklappt! Hurra, ein Stern für dich!",
  },
};
