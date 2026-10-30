import type { Localized } from "@/lib/language";

// Who goes to the potty, the steps of the story and what is said. An animal rather
// than a child: it has fur, so „Hose runter“ shows nothing a parent would mind, and
// the fox Tapsi is already known from the Bewegungsabenteuer. Only Tapsi: every
// animal would need the whole story drawn again. Every step is a Gemini picture in
// ./bilder/ (see images.ts and bilder/README.md).

/** Tapsi the fox, who goes to the potty; Mama and Papa fox are in its pictures. */
export const TAPSI = {
  emoji: "🦊",
  /** Said and shown, in the app language, in its own letters (a Russian voice reads „Tapsi“ badly). */
  name: { de: "Tapsi", en: "Tapsi", zh: "塔普西", hi: "टैप्सी", es: "Tapsi", ar: "تابسي", ru: "Тапси" } as Localized,
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
  { id: "rutsche", emoji: "🛝💦", need: "pipi", sound: "splash" },
  { id: "schiffchen", emoji: "⛵🏞️", need: "pipi", sound: "trickle" },
  { id: "eimer", emoji: "🪣🏰", need: "pipi", sound: "trickle" },
  { id: "pusteblume", emoji: "🌬️🌼", need: "pipi", sound: "whoosh" },
  { id: "pumpe", emoji: "🚰", need: "pipi", sound: "glug" },
  { id: "sanduhr", emoji: "⏳", need: "pipi", sound: "trickle" },
  { id: "drachen", emoji: "🪁", need: "pipi", sound: "whoosh" },
  { id: "ketchup", emoji: "🍅🍝", need: "kaka", sound: "squeeze" },
  { id: "aufblasen", emoji: "😤🎈", need: "kaka", sound: "blow" },
  { id: "huhn", emoji: "🐔🥚", need: "kaka", sound: "plop" },
  { id: "knete", emoji: "🟠🟣🟢", need: "kaka", sound: "squeeze" },
  { id: "spritzbeutel", emoji: "🍰", need: "kaka", sound: "squeeze" },
  { id: "erbsen", emoji: "🫛", need: "kaka", sound: "plop" },
  { id: "moehre", emoji: "🥕", need: "kaka", sound: "plop" },
  { id: "kueken", emoji: "🥚🐣", need: "kaka", sound: "plop" },
  { id: "schubkarre", emoji: "🍂", need: "kaka", sound: "squeeze" },
  { id: "honig", emoji: "🍯", need: "kaka", sound: "squeeze" },
  { id: "kastanie", emoji: "🌰", need: "kaka", sound: "plop" },
  // Waiting until something comes out, without pressing: for children afraid of kaka.
  { id: "tunnel", emoji: "🚂", need: "kaka", sound: "toot" },
  { id: "schmetterling", emoji: "🦋", need: "kaka", sound: "chime" },
  { id: "maulwurf", emoji: "🐾🟤", need: "kaka", sound: "plop" },
  { id: "schildkroete", emoji: "🐢", need: "kaka", sound: "plop" },
  { id: "roehre", emoji: "🛝", need: "kaka", sound: "whoosh" },
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

/** German and its translations; a new or changed German line comes German-only until translations are asked for. */
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
      rutsche: "Tapsi rutscht ins Wasser. Platsch!",
      schiffchen: "Das Schiffchen schwimmt den Bach hinunter. Plätscher, plätscher!",
      eimer: "Tapsi kippt den Eimer aus. Das Wasser läuft in den Graben!",
      pusteblume: "Tapsi pustet die Pusteblume. Die Schirmchen fliegen!",
      pumpe: "Tapsi pumpt. Das Wasser läuft!",
      sanduhr: "Der Sand rieselt. Rieselt und rieselt!",
      drachen: "Tapsi lässt los. Der Drachen fliegt hoch!",
      moehre: "Tapsi zieht ganz fest. Plopp, die Möhre ist raus!",
      kueken: "Das Küken drückt und drückt. Knack, da ist es!",
      schubkarre: "Tapsi schiebt ganz fest. Und oben: auskippen!",
      honig: "Tapsi drückt die Honigflasche. Langsam kommt der Honig!",
      maulwurf: "Der Maulwurf drückt und drückt. Hallo, da ist er!",
      schildkroete: "Tapsi wartet ganz ruhig. Da kommt die Schildkröte raus!",
      roehre: "Tapsi rutscht durch die Röhre. Huiii, da kommt Tapsi raus!",
      kastanie: "Tapsi drückt die Schale. Plopp, die Kastanie!",
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
  // English: "pee" and "poop", the potty is the potty, Mommy and Daddy.
  en: {
    steps: {
      eat: (name) => `Yum! ${name} eats noodles and drinks water.`,
      need: (name, said) =>
        said === "pipi"
          ? `Oh! The bladder feels full. ${name} needs to pee!`
          : said === "kaka"
            ? `Oh! The tummy rumbles. ${name} needs to poop!`
            : said === "both"
              ? `Oh! The bladder feels full and the tummy rumbles. ${name} needs to pee and poop!`
              : `Oh! Something's pressing. ${name} needs to go!`,
      call: (_, said) => `Mommy! Daddy! I need to ${said === "pipi" ? "pee" : said === "kaka" ? "poop" : said === "both" ? "pee and poop" : "go"}!`,
      go: () => "Mommy and Daddy come along. Quick, to the bathroom!",
      down: () => "Pants down!",
      sit: () => "Sit down. Mommy and Daddy wait too.",
      done: (_, came) =>
        came === "pipi"
          ? "Splish, splash! The pee is in the potty!"
          : came === "kaka"
            ? "Plop! The poop is in the potty!"
            : "Splish, splash, plop! Pee and poop are in the potty!",
      wipe: () => "Wipe with paper.",
      up: () => "Pants up!",
      flush: () => "Empty it and flush. Whoosh!",
      wash: () => "Wash hands with soap.",
      party: (name) => `You did it! Great job, ${name}!`,
      stars: () => "These are your stars.",
      play: (name) => `${name} is playing. Mommy and Daddy look in: Do you need to pee or poop?`,
    },
    scenes: {
      giesskanne: "Tapsi waters the flower. Splish, splash!",
      brunnen: "The fountain bubbles. Can you hear it splashing?",
      ballon: "Tapsi lets the balloon go. Pfffft!",
      regen: "It's raining. Splash, into the puddle!",
      schlauch: "Tapsi sprays with the hose. The duck gets wet!",
      ketchup: "Tapsi squeezes the ketchup. Squeeze, squeeze!",
      aufblasen: "Tapsi blows up the balloon. Blow really hard!",
      huhn: "The hen pushes really hard. Plop, an egg!",
      knete: "Tapsi squeezes the play dough. Out come little sausages!",
      wasserrad: "The water turns the wheel. Splish, splash!",
      tee: "Tapsi pours the tea. Glug, glug, glug!",
      spritzbeutel: "Tapsi squeezes the piping bag. Cream on the cake!",
      erbsen: "Tapsi squeezes the pod. Pop, pop, the peas!",
      tunnel: "The train is in the tunnel. Toot toot, here it comes out!",
      elefant: "The elephant sprays with its trunk. Pshhh!",
      wal: "The whale blows water up high. Pfffft!",
      trichter: "Tapsi pours water into the funnel. It runs out at the bottom!",
      schmetterling: "The butterfly squeezes out. Now it flies!",
      rutsche: "Tapsi slides into the water. Splash!",
      schiffchen: "The little boat floats down the stream. Splish, splash!",
      eimer: "Tapsi tips out the bucket. The water runs into the ditch!",
      pusteblume: "Tapsi blows the dandelion. The little parachutes fly!",
      pumpe: "Tapsi pumps. The water flows!",
      sanduhr: "The sand trickles. Trickle, trickle!",
      drachen: "Tapsi lets go. The kite flies up high!",
      moehre: "Tapsi pulls really hard. Pop, the carrot is out!",
      kueken: "The chick pushes and pushes. Crack, there it is!",
      schubkarre: "Tapsi pushes really hard. And at the top: tip it out!",
      honig: "Tapsi squeezes the honey bottle. Slowly the honey comes!",
      maulwurf: "The mole pushes and pushes. Hello, there it is!",
      schildkroete: "Tapsi waits very calmly. Here comes the turtle!",
      roehre: "Tapsi slides through the tube. Wheee, here comes Tapsi!",
      kastanie: "Tapsi squeezes the shell. Pop, the chestnut!",
      tanzen: "Mommy and Daddy are dancing!",
      jonglieren: "Daddy juggles toilet paper!",
      kuckuck: "Where's Mommy? Peekaboo!",
      seifenblasen: "Daddy blows soap bubbles. Pop, pop!",
    },
    said: {
      pipi: "Tapsi needs to pee soon.",
      kaka: "Tapsi needs to poop soon.",
      both: "Tapsi needs to pee and poop soon.",
    },
    next: "Next",
    askSaid: "What does your child need?",
    askWent: "What's in the potty?",
    finish: "Is something in the potty? Pee: press the drop. Poop: press the poop.",
    went: {
      pipi: "Pee is in the potty",
      kaka: "Poop is in the potty",
    },
    nothing: "Nothing today. That's okay!",
    nothingButton: "nothing",
    star: "It worked! Hooray, a star for you!",
  },
  // Chinese: 尿尿 and 便便, the potty is 小马桶, Tapsi is 塔普西.
  zh: {
    steps: {
      eat: (name) => `嗯！${name}在吃面条，喝水。`,
      need: (name, said) =>
        said === "pipi"
          ? `哎呀！小肚子胀胀的。${name}要尿尿！`
          : said === "kaka"
            ? `哎呀！肚子咕噜咕噜响。${name}要便便！`
            : said === "both"
              ? `哎呀！小肚子胀胀的，肚子还咕噜咕噜响。${name}要尿尿，也要便便！`
              : `哎呀！有点憋不住了。${name}要上厕所！`,
      call: (_, said) => `妈妈！爸爸！我要${said === "pipi" ? "尿尿" : said === "kaka" ? "便便" : said === "both" ? "尿尿和便便" : "上厕所"}！`,
      go: () => "妈妈和爸爸一起来。快去卫生间！",
      down: () => "裤子脱下来！",
      sit: () => "坐下来。妈妈和爸爸陪着等。",
      done: (_, came) =>
        came === "pipi" ? "哗啦啦！尿尿在小马桶里啦！" : came === "kaka" ? "扑通！便便在小马桶里啦！" : "哗啦啦，扑通！尿尿和便便都在小马桶里啦！",
      wipe: () => "用纸擦一擦。",
      up: () => "裤子穿上去！",
      flush: () => "倒掉，冲水。哗——！",
      wash: () => "用肥皂洗洗手。",
      party: (name) => `成功啦！真棒，${name}！`,
      stars: () => "这些是你的星星。",
      play: (name) => `${name}在玩。妈妈和爸爸探头问：你要尿尿还是便便？`,
    },
    scenes: {
      giesskanne: "塔普西给花浇水。哗啦，哗啦！",
      brunnen: "喷泉在冒水。听到哗哗的水声了吗？",
      ballon: "塔普西松开气球。噗——！",
      regen: "下雨啦。啪嗒，踩进水坑！",
      schlauch: "塔普西用水管喷水。小鸭子湿啦！",
      ketchup: "塔普西挤番茄酱。挤呀，挤呀！",
      aufblasen: "塔普西吹气球。使劲吹！",
      huhn: "母鸡使劲用力。啵，一个蛋！",
      knete: "塔普西挤彩泥。挤出小香肠啦！",
      wasserrad: "水推着轮子转。哗啦啦，哗啦啦！",
      tee: "塔普西倒茶。咕嘟，咕嘟，咕嘟！",
      spritzbeutel: "塔普西挤裱花袋。奶油挤到蛋糕上！",
      erbsen: "塔普西挤豆荚。啵，啵，豌豆出来啦！",
      tunnel: "火车在隧道里。呜呜，它开出来啦！",
      elefant: "大象用鼻子喷水。噗嗤——！",
      wal: "鲸鱼把水喷得高高的。噗——！",
      trichter: "塔普西往漏斗里倒水。水从下面流出来啦！",
      schmetterling: "蝴蝶使劲钻出来。现在它飞啦！",
      rutsche: "塔普西滑进水里。扑通！",
      schiffchen: "小船顺着小溪漂下去。哗啦，哗啦！",
      eimer: "塔普西把水桶倒空。水流进小沟里啦！",
      pusteblume: "塔普西吹蒲公英。小伞飞起来啦！",
      pumpe: "塔普西压水泵。水流出来啦！",
      sanduhr: "沙子往下流。流呀流呀！",
      drachen: "塔普西松开手。风筝飞高啦！",
      moehre: "塔普西使劲拔。啵，胡萝卜拔出来啦！",
      kueken: "小鸡使劲顶呀顶。咔嚓，它出来啦！",
      schubkarre: "塔普西使劲推。到了上面：倒出来！",
      honig: "塔普西挤蜂蜜瓶。蜂蜜慢慢流出来啦！",
      maulwurf: "鼹鼠使劲钻呀钻。你好，它出来啦！",
      schildkroete: "塔普西静静地等。小乌龟出来啦！",
      roehre: "塔普西滑过管子。呜——塔普西出来啦！",
      kastanie: "塔普西捏开外壳。啵，栗子出来啦！",
      tanzen: "妈妈和爸爸在跳舞！",
      jonglieren: "爸爸用卫生纸玩抛接！",
      kuckuck: "妈妈在哪儿？躲猫猫，在这儿！",
      seifenblasen: "爸爸吹泡泡。啵，啵！",
    },
    said: {
      pipi: "塔普西马上要尿尿。",
      kaka: "塔普西马上要便便。",
      both: "塔普西马上要尿尿和便便。",
    },
    next: "继续",
    askSaid: "孩子要做什么？",
    askWent: "小马桶里有什么？",
    finish: "小马桶里有东西吗？尿尿：按水滴。便便：按便便。",
    went: {
      pipi: "尿尿在小马桶里",
      kaka: "便便在小马桶里",
    },
    nothing: "今天没有。没关系！",
    nothingButton: "没有",
    star: "成功啦！好耶，给你一颗星星！",
  },
  // Hindi: सू-सू and पॉटी, the potty chair is पॉटी-सीट, मम्मी and पापा, Tapsi is टैप्सी. Verbs agree with their
  // subject's gender, so Tapsi and the child are never the subject of one: "टैप्सी को सू-सू जाना है", "मुझे जाना है",
  // commands (धोओ) and "let's" (चलो बैठें); the thoughts tell what the things do.
  hi: {
    steps: {
      eat: (name) => `म्म! ${name} के लिए नूडल्स और पानी।`,
      need: (name, said) =>
        said === "pipi"
          ? `अरे! ज़ोर से सू-सू लगी है। ${name} को सू-सू जाना है!`
          : said === "kaka"
            ? `अरे! पेट गुड़गुड़ कर रहा है। ${name} को पॉटी जाना है!`
            : said === "both"
              ? `अरे! सू-सू लगी है और पेट गुड़गुड़ कर रहा है। ${name} को सू-सू और पॉटी जाना है!`
              : `अरे! कुछ दबाव है। ${name} को जाना है!`,
      call: (_, said) => `मम्मी! पापा! मुझे ${said === "pipi" ? "सू-सू " : said === "kaka" ? "पॉटी " : said === "both" ? "सू-सू और पॉटी " : ""}जाना है!`,
      go: () => "मम्मी और पापा साथ आते हैं। जल्दी से बाथरूम में!",
      down: () => "पैंट नीचे!",
      sit: () => "चलो बैठें। मम्मी और पापा साथ में इंतज़ार करते हैं।",
      done: (_, came) => (came === "pipi" ? "छप-छप! सू-सू पॉटी-सीट में है!" : came === "kaka" ? "धप! पॉटी, पॉटी-सीट में है!" : "छप-छप, धप! सू-सू और पॉटी, पॉटी-सीट में हैं!"),
      wipe: () => "काग़ज़ से पोंछो।",
      up: () => "पैंट ऊपर!",
      flush: () => "खाली करो और फ़्लश करो। वूऊश!",
      wash: () => "साबुन से हाथ धोओ।",
      party: (name) => `हो गया! शाबाश, ${name}!`,
      stars: () => "ये तुम्हारे तारे हैं।",
      play: (name) => `${name} के खेलने का समय। मम्मी और पापा झाँककर पूछते हैं: सू-सू या पॉटी जाना है?`,
    },
    scenes: {
      giesskanne: "फूल को पानी मिल रहा है। छप, छप!",
      brunnen: "फ़व्वारा चल रहा है। कल-कल सुनो!",
      ballon: "गुब्बारा छूट गया। फ़्फ़्फ़्फ़!",
      regen: "बारिश हो रही है। छपाक, पानी में!",
      schlauch: "पाइप से पानी की धार। बत्तख भीग गई!",
      ketchup: "केचप की बोतल दबाओ। दबाओ, दबाओ!",
      aufblasen: "गुब्बारा फुलाओ। ज़ोर से फूँको!",
      huhn: "मुर्गी ज़ोर लगाती है। टप, एक अंडा!",
      knete: "क्ले दबाओ। लंबी-लंबी डोरियाँ निकलती हैं!",
      wasserrad: "पानी पहिया घुमाता है। कल-कल, कल-कल!",
      tee: "प्याले में चाय। गुड़, गुड़, गुड़!",
      spritzbeutel: "क्रीम की थैली दबाओ। केक पर क्रीम!",
      erbsen: "फली दबाओ। टप, टप, मटर!",
      tunnel: "ट्रेन सुरंग में है। छुक-छुक, वो बाहर आई!",
      elefant: "हाथी सूँड़ से पानी उछालता है। फ़्श्श्श!",
      wal: "व्हेल पानी ऊपर उछालती है। फ़्फ़्फ़्फ़!",
      trichter: "कीप में पानी डालो। नीचे से निकल जाता है!",
      schmetterling: "तितली बाहर निकल रही है। अब वो उड़ती है!",
      rutsche: "फिसलपट्टी से सीधे पानी में। छपाक!",
      schiffchen: "नाव नदी में नीचे बहती है। छप, छप!",
      eimer: "बाल्टी उलटो। पानी नाली में बह जाता है!",
      pusteblume: "सिंहपर्णी पर फूँको। छोटी छतरियाँ उड़ती हैं!",
      pumpe: "पंप चलाओ। पानी बहता है!",
      sanduhr: "रेत गिरती है। गिरती जाती है, गिरती जाती है!",
      drachen: "डोर छोड़ो। पतंग ऊपर उड़ती है!",
      moehre: "ज़ोर से खींचो। टप, गाजर बाहर!",
      kueken: "चूज़ा ज़ोर लगाता है। कड़क, ये रहा!",
      schubkarre: "ठेला ज़ोर से धकेलो। और ऊपर: उलट दो!",
      honig: "शहद की बोतल दबाओ। धीरे-धीरे शहद आता है!",
      maulwurf: "छछूंदर ज़ोर लगाता है। नमस्ते, ये रहा!",
      schildkroete: "चुपचाप इंतज़ार करो। कछुआ बाहर आता है!",
      roehre: "पाइप वाली फिसलपट्टी। वूऊ, टैप्सी बाहर!",
      kastanie: "छिलका दबाओ। टप, शाहबलूत!",
      tanzen: "मम्मी और पापा नाच रहे हैं!",
      jonglieren: "पापा टॉयलेट पेपर उछाल-उछालकर करतब दिखा रहे हैं!",
      kuckuck: "मम्मी कहाँ है? ये रही!",
      seifenblasen: "पापा बुलबुले बनाते हैं। फट, फट!",
    },
    said: {
      pipi: "टैप्सी को जल्दी सू-सू जाना है।",
      kaka: "टैप्सी को जल्दी पॉटी जाना है।",
      both: "टैप्सी को जल्दी सू-सू और पॉटी जाना है।",
    },
    next: "आगे",
    askSaid: "आपके बच्चे को सू-सू जाना है या पॉटी?",
    askWent: "पॉटी-सीट में क्या है?",
    finish: "पॉटी-सीट में कुछ है? सू-सू: बूँद दबाइए। पॉटी: पॉटी दबाइए।",
    went: {
      pipi: "सू-सू पॉटी-सीट में है",
      kaka: "पॉटी, पॉटी-सीट में है",
    },
    nothing: "आज कुछ नहीं आया। कोई बात नहीं!",
    nothingButton: "कुछ नहीं",
    star: "हो गया! हुर्रे, तुम्हारे लिए एक तारा!",
  },
  // Spanish: "pipí" and "popó", the potty is the orinal, tú for the child and usted for the grown-up; the steps
  // say "we" (nos lavamos) like a parent does, nothing changes for a boy or a girl.
  es: {
    steps: {
      eat: (name) => `¡Mmm! ${name} come fideos y bebe agua.`,
      need: (name, said) =>
        said === "pipi"
          ? `¡Oh! La vejiga aprieta. ¡${name} tiene que hacer pipí!`
          : said === "kaka"
            ? `¡Oh! La barriga hace ruido. ¡${name} tiene que hacer popó!`
            : said === "both"
              ? `¡Oh! La vejiga aprieta y la barriga hace ruido. ¡${name} tiene que hacer pipí y popó!`
              : `¡Oh! Algo aprieta. ¡${name} tiene que ir al orinal!`,
      call: (_, said) =>
        said === "unsure"
          ? "¡Mamá! ¡Papá! ¡Tengo que ir al orinal!"
          : `¡Mamá! ¡Papá! ¡Tengo que hacer ${said === "pipi" ? "pipí" : said === "kaka" ? "popó" : "pipí y popó"}!`,
      go: () => "Mamá y papá vienen también. ¡Rápido, al baño!",
      down: () => "¡Pantalón abajo!",
      sit: () => "Nos sentamos. Mamá y papá esperan también.",
      done: (_, came) =>
        came === "pipi"
          ? "¡Plis, plas! ¡El pipí está en el orinal!"
          : came === "kaka"
            ? "¡Plof! ¡El popó está en el orinal!"
            : "¡Plis, plas, plof! ¡El pipí y el popó están en el orinal!",
      wipe: () => "Nos limpiamos con papel.",
      up: () => "¡Pantalón arriba!",
      flush: () => "Vaciamos y tiramos de la cadena. ¡Fiuuush!",
      wash: () => "Nos lavamos las manos con jabón.",
      party: (name) => `¡Lo lograste! ¡Muy bien, ${name}!`,
      stars: () => "Estas son tus estrellas.",
      play: (name) => `${name} juega. Mamá y papá se asoman: ¿tienes que hacer pipí o popó?`,
    },
    scenes: {
      giesskanne: "Tapsi riega la flor. ¡Plis, plas!",
      brunnen: "La fuente burbujea. ¿Oyes cómo chapotea?",
      ballon: "Tapsi suelta el globo. ¡Pffff!",
      regen: "Llueve. ¡Plas, al charco!",
      schlauch: "Tapsi echa agua con la manguera. ¡El pato se moja!",
      ketchup: "Tapsi aprieta el kétchup. ¡Aprieta, aprieta!",
      aufblasen: "Tapsi infla el globo. ¡Sopla muy fuerte!",
      huhn: "La gallina aprieta muy fuerte. ¡Plop, un huevo!",
      knete: "Tapsi aprieta la plastilina. ¡Salen salchichitas!",
      wasserrad: "El agua mueve la rueda. ¡Chap, chap!",
      tee: "Tapsi sirve el té. ¡Glu, glu, glu!",
      spritzbeutel: "Tapsi aprieta la manga pastelera. ¡Nata sobre el pastel!",
      erbsen: "Tapsi aprieta la vaina. ¡Plop, plop, los guisantes!",
      tunnel: "El tren está en el túnel. ¡Chu-chu, ahí sale!",
      elefant: "El elefante echa agua con la trompa. ¡Pshhh!",
      wal: "La ballena echa agua hacia arriba. ¡Pffff!",
      trichter: "Tapsi echa agua en el embudo. ¡Sale por abajo!",
      schmetterling: "La mariposa sale apretando. ¡Ahora vuela!",
      rutsche: "Tapsi se tira al agua por el tobogán. ¡Plaf!",
      schiffchen: "El barquito baja por el arroyo. ¡Plis, plas!",
      eimer: "Tapsi vacía el cubo. ¡El agua corre por la zanja!",
      pusteblume: "Tapsi sopla el diente de león. ¡Las semillitas vuelan!",
      pumpe: "Tapsi bombea. ¡Sale el agua!",
      sanduhr: "La arena cae. ¡Cae y cae!",
      drachen: "Tapsi suelta. ¡La cometa sube alto!",
      moehre: "Tapsi tira muy fuerte. ¡Plop, sale la zanahoria!",
      kueken: "El pollito empuja y empuja. ¡Crac, ahí está!",
      schubkarre: "Tapsi empuja muy fuerte. Y arriba: ¡a vaciar!",
      honig: "Tapsi aprieta el bote de miel. ¡La miel sale despacito!",
      maulwurf: "El topo empuja y empuja. ¡Hola, ahí está!",
      schildkroete: "Tapsi espera con calma. ¡Ahí sale la tortuga!",
      roehre: "Tapsi se desliza por el tubo. ¡Uiii, ahí sale Tapsi!",
      kastanie: "Tapsi aprieta la cáscara. ¡Plop, la castaña!",
      tanzen: "¡Mamá y papá bailan!",
      jonglieren: "¡Papá hace malabares con papel higiénico!",
      kuckuck: "¿Dónde está mamá? ¡Cucú!",
      seifenblasen: "Papá hace pompas de jabón. ¡Plop, plop!",
    },
    said: {
      pipi: "Tapsi tiene que hacer pipí pronto.",
      kaka: "Tapsi tiene que hacer popó pronto.",
      both: "Tapsi tiene que hacer pipí y popó pronto.",
    },
    next: "Siguiente",
    askSaid: "¿Qué tiene que hacer su peque?",
    askWent: "¿Qué hay en el orinal?",
    finish: "¿Hay algo en el orinal? Pipí: pulse la gota. Popó: pulse el popó.",
    went: {
      pipi: "Hay pipí en el orinal",
      kaka: "Hay popó en el orinal",
    },
    nothing: "Hoy no sale nada. ¡No pasa nada!",
    nothingButton: "nada",
    star: "¡Funcionó! ¡Hurra, una estrella para ti!",
  },
  // Arabic: بيبي and كاكا, the potty is النونية, ماما and بابا, Tapsi is تابسي. Verbs about the child or Tapsi
  // would differ for a boy and a girl, so the lines say "we" (نغسل), "I" (أريد) or "needs" (بحاجة إلى).
  ar: {
    steps: {
      eat: (name) => `مممم! معكرونة وماء لـ${name}.`,
      need: (name, said) =>
        said === "pipi"
          ? `أوه! المثانة تضغط. ${name} بحاجة إلى بيبي!`
          : said === "kaka"
            ? `أوه! البطن يقرقر. ${name} بحاجة إلى كاكا!`
            : said === "both"
              ? `أوه! المثانة تضغط والبطن يقرقر. ${name} بحاجة إلى بيبي وكاكا!`
              : `أوه! شيء ما يضغط. ${name} بحاجة إلى النونية!`,
      call: (_, said) =>
        said === "unsure"
          ? "ماما! بابا! أحتاج إلى النونية!"
          : `ماما! بابا! أريد أن أعمل ${said === "pipi" ? "بيبي" : said === "kaka" ? "كاكا" : "بيبي وكاكا"}!`,
      go: () => "ماما وبابا يأتيان معًا. بسرعة إلى الحمّام!",
      down: () => "ننزل البنطال!",
      sit: () => "نجلس. ماما وبابا ينتظران معنا.",
      done: (_, came) =>
        came === "pipi" ? "طش، طش! البيبي في النونية!" : came === "kaka" ? "بلوب! الكاكا في النونية!" : "طش، طش، بلوب! البيبي والكاكا في النونية!",
      wipe: () => "نمسح بالورق.",
      up: () => "نرفع البنطال!",
      flush: () => "نُفرغ النونية ونشدّ السيفون. ووووش!",
      wash: () => "نغسل اليدين بالصابون.",
      party: (name) => `نجحنا! رائع يا ${name}!`,
      stars: () => "هذه نجوم الأسبوع.",
      play: (name) => `وقت اللعب لـ${name}. ماما وبابا ينظران من الباب: هل حان وقت البيبي أو الكاكا؟`,
    },
    scenes: {
      giesskanne: "إبريق الري يسقي الزهرة. طش، طش!",
      brunnen: "النافورة تفور. خرير، خرير!",
      ballon: "البالون يفلت. بففففت!",
      regen: "المطر ينزل. طش، في البركة!",
      schlauch: "الماء يرشّ من الخرطوم. البطة تبتلّ!",
      ketchup: "نضغط زجاجة الكاتشب. نضغط، نضغط!",
      aufblasen: "ننفخ البالون. ننفخ بقوة!",
      huhn: "الدجاجة تضغط بقوة. بوب، بيضة!",
      knete: "نضغط الصلصال. تخرج منه نقانق!",
      wasserrad: "الماء يدير الدولاب. خرير، خرير!",
      tee: "نصبّ الشاي. غلوك، غلوك، غلوك!",
      spritzbeutel: "نضغط كيس الكريمة. كريمة على الكعكة!",
      erbsen: "نضغط قرن البازلاء. بوب، بوب، حبات البازلاء!",
      tunnel: "القطار في النفق. توت توت، ها هو يخرج!",
      elefant: "الفيل يرشّ الماء بخرطومه. بششش!",
      wal: "الحوت ينفث الماء عاليًا. بففففت!",
      trichter: "نصبّ الماء في القمع. يخرج من الأسفل!",
      schmetterling: "الفراشة تخرج من الشرنقة. والآن تطير!",
      rutsche: "نتزحلق إلى الماء. طشّ!",
      schiffchen: "القارب الصغير يسبح مع الجدول. طش، طش!",
      eimer: "نفرغ الدلو. الماء يجري في القناة!",
      pusteblume: "ننفخ زهرة الهندباء. المظلات الصغيرة تطير!",
      pumpe: "نضخّ الماء. الماء يجري!",
      sanduhr: "الرمل ينساب. ينساب وينساب!",
      drachen: "نترك الخيط. الطائرة الورقية تطير عاليًا!",
      moehre: "نشدّ بقوة. بوب، خرجت الجزرة!",
      kueken: "الكتكوت يدفع ويدفع. طق، ها هو!",
      schubkarre: "ندفع العربة بقوة. وفي الأعلى: نفرغها!",
      honig: "نضغط زجاجة العسل. العسل ينزل ببطء!",
      maulwurf: "الخلد يدفع ويدفع. مرحبًا، ها هو!",
      schildkroete: "ننتظر بهدوء. ها هي السلحفاة تخرج!",
      roehre: "نتزحلق في الأنبوب. ووووه، ها هو تابسي!",
      kastanie: "نضغط القشرة. بوب، الكستناءة!",
      tanzen: "ماما وبابا يرقصان!",
      jonglieren: "بابا يرمي ورق الحمّام ويلتقطه!",
      kuckuck: "أين ماما؟ ها هي!",
      seifenblasen: "بابا يصنع فقاعات الصابون. بوب، بوب!",
    },
    said: {
      pipi: "تابسي بحاجة قريبًا إلى بيبي.",
      kaka: "تابسي بحاجة قريبًا إلى كاكا.",
      both: "تابسي بحاجة قريبًا إلى بيبي وكاكا.",
    },
    next: "التالي",
    askSaid: "ماذا يحتاج طفلكم؟",
    askWent: "ماذا في النونية؟",
    finish: "هل في النونية شيء؟ بيبي: اضغطوا على القطرة. كاكا: اضغطوا على الكاكا.",
    went: {
      pipi: "البيبي في النونية",
      kaka: "الكاكا في النونية",
    },
    nothing: "اليوم لا شيء. لا بأس!",
    nothingButton: "لا شيء",
    star: "نجحنا! مرحى، نجمة لك!",
  },
  ru: {
    steps: {
      eat: (name) => `Ням! ${name} ест макароны и пьёт воду.`,
      need: (name, said) =>
        said === "pipi"
          ? `Ой! Пи-пи просится наружу. ${name} хочет пи-пи!`
          : said === "kaka"
            ? `Ой! В животике бурчит. ${name} хочет ка-ка!`
            : said === "both"
              ? `Ой! Пи-пи просится, и в животике бурчит. ${name} хочет пи-пи и ка-ка!`
              : `Ой! Что-то просится наружу. ${name} надо на горшок!`,
      call: (_, said) =>
        said === "unsure"
          ? "Мама! Папа! Мне надо на горшок!"
          : `Мама! Папа! Я хочу ${said === "pipi" ? "пи-пи" : said === "kaka" ? "ка-ка" : "пи-пи и ка-ка"}!`,
      go: () => "Мама и папа идут тоже. Скорее в ванную!",
      down: () => "Штанишки вниз!",
      sit: () => "Садимся. Мама и папа ждут вместе.",
      done: (_, came) => (came === "pipi" ? "Кап-кап! Пи-пи в горшке!" : came === "kaka" ? "Плюх! Ка-ка в горшке!" : "Кап-кап, плюх! Пи-пи и ка-ка в горшке!"),
      wipe: () => "Вытираем бумагой.",
      up: () => "Штанишки вверх!",
      flush: () => "Выливаем и смываем. Вжууух!",
      wash: () => "Моем руки с мылом.",
      party: (name) => `Получилось! Молодец, ${name}!`,
      stars: () => "Это твои звёздочки.",
      play: (name) => `${name} играет. Мама и папа заглядывают: тебе надо пи-пи или ка-ка?`,
    },
    scenes: {
      giesskanne: "Тапси поливает цветок. Кап-кап!",
      brunnen: "Фонтан журчит. Слышишь, как плещется?",
      ballon: "Тапси отпускает шарик. Пффф!",
      regen: "Идёт дождь. Шлёп – в лужу!",
      schlauch: "Тапси брызгает из шланга. Уточка мокрая!",
      ketchup: "Тапси жмёт кетчуп. Жмём, жмём!",
      aufblasen: "Тапси надувает шарик. Дуем сильно-сильно!",
      huhn: "Курочка тужится изо всех сил. Плюх – яичко!",
      knete: "Тапси жмёт пластилин. Вылезают колбаски!",
      wasserrad: "Вода крутит колесо. Буль-буль!",
      tee: "Тапси наливает чай. Буль, буль, буль!",
      spritzbeutel: "Тапси жмёт кондитерский мешок. Крем на торт!",
      erbsen: "Тапси жмёт стручок. Чпок, чпок – горошинки!",
      tunnel: "Поезд в тоннеле. Ту-ту, вот он выезжает!",
      elefant: "Слон брызгает хоботом. Пшшш!",
      wal: "Кит пускает фонтан. Пффф!",
      trichter: "Тапси льёт воду в воронку. Внизу она вытекает!",
      schmetterling: "Бабочка выбирается наружу. Теперь она летит!",
      rutsche: "Тапси съезжает в воду. Плюх!",
      schiffchen: "Кораблик плывёт вниз по ручью. Буль-буль!",
      eimer: "Тапси выливает ведро. Вода бежит в канавку!",
      pusteblume: "Тапси дует на одуванчик. Парашютики летят!",
      pumpe: "Тапси качает насос. Вода течёт!",
      sanduhr: "Песок сыплется. Сыплется и сыплется!",
      drachen: "Тапси отпускает. Змей летит высоко!",
      moehre: "Тапси тянет сильно-сильно. Чпок – вот и морковка!",
      kueken: "Цыплёнок толкает и толкает. Крак – вот он!",
      schubkarre: "Тапси толкает сильно-сильно. А наверху – высыпаем!",
      honig: "Тапси жмёт бутылочку с мёдом. Медленно течёт мёд!",
      maulwurf: "Крот толкает и толкает. Привет, вот он!",
      schildkroete: "Тапси спокойно ждёт. Вот выходит черепаха!",
      roehre: "Тапси едет через трубу. У-ух, вот и Тапси!",
      kastanie: "Тапси сжимает скорлупку. Чпок – каштан!",
      tanzen: "Мама и папа танцуют!",
      jonglieren: "Папа жонглирует туалетной бумагой!",
      kuckuck: "Где мама? Ку-ку!",
      seifenblasen: "Папа пускает мыльные пузыри. Чпок, чпок!",
    },
    said: {
      pipi: "Тапси скоро нужно пи-пи.",
      kaka: "Тапси скоро нужно ка-ка.",
      both: "Тапси скоро нужно пи-пи и ка-ка.",
    },
    next: "Дальше",
    askSaid: "Что нужно малышу?",
    askWent: "Что в горшке?",
    finish: "Что-нибудь есть в горшке? Пи-пи – нажмите на капельку. Ка-ка – нажмите на ка-ка.",
    went: {
      pipi: "Пи-пи в горшке",
      kaka: "Ка-ка в горшке",
    },
    nothing: "Сегодня ничего нет. Ничего страшного!",
    nothingButton: "ничего",
    star: "Получилось! Ура, звёздочка для тебя!",
  },
};
