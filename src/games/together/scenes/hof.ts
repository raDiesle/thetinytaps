import type { SceneSpec } from "../scene";
import { beehive } from "../tools";

// The helpers of the topic „Bauernhof & Wald“ (topics.ts): who works on the farm, in the garden and in the forest,
// written as data (see scene.tsx). The garden's tools without a helper (rake, spade) are things of the day in garten.ts.

export const SCENES: SceneSpec[] = [
  {
    id: "baeuerin",
    topic: "hof",
    name: "Bäuerin",
    the: "die Bäuerin",
    toThe: "die Bäuerin",
    partner: { name: "Traktor", the: "der Traktor", acc: "den Traktor", emoji: "🚜" },
    helper: { fur: "fox", outfit: { coat: "#e8590c", hat: "straw", detail: "straps", detailColor: "#1c7ed6" }, lashes: true },
    // The tractor drives to and fro over the field.
    thing: "🌾",
    backdrop: "bauernhof",
    act: "rub",
    sounds: ["engine"],
  },
  {
    id: "gaertner",
    topic: "hof",
    name: "Gärtner",
    the: "der Gärtner",
    toThe: "der Gärtner",
    partner: { name: "Pflänzchen", the: "das Pflänzchen", acc: "das Pflänzchen", emoji: "🌱" },
    helper: { fur: "fox", outfit: { coat: "#94d82d", hat: "straw", detail: "apron", detailColor: "#2b8a3e" } },
    // The little plant is set into the bed.
    backdrop: "gemuesebeet",
    act: "onto",
    spot: [222, 148, 50],
    sounds: ["rustle", "plop"],
    // A farmer plants too.
    alsoFits: ["baeuerin"],
  },
  {
    id: "imkerin",
    topic: "hof",
    name: "Imkerin",
    the: "die Imkerin",
    toThe: "die Imkerin",
    partner: { name: "Bienenkorb", the: "der Bienenkorb", acc: "den Bienenkorb", draw: beehive },
    helper: { fur: "bear", outfit: { coat: "#f8f9fa", hat: "veil", detail: "belt", detailColor: "#fab005" }, lashes: true },
    // The beehive is set down in the meadow, where the bees fly round the flowers.
    backdrop: "wiese",
    props: [
      ["🌼", 190, 176, 18],
      ["🌼", 270, 178, 16],
      ["🐝", 176, 112, 16],
      ["🐝", 278, 98, 14],
    ],
    act: "onto",
    spot: [226, 140, 62],
    sounds: ["thump", "buzz"],
  },
  {
    id: "holzfaeller",
    topic: "hof",
    name: "Holzfäller",
    the: "der Holzfäller",
    toThe: "der Holzfäller",
    partner: { name: "Axt", the: "die Axt", acc: "die Axt", emoji: "🪓" },
    helper: { fur: "bear", outfit: { coat: "#c92a2a", hat: "beanie", hatColor: "#343a40", detail: "checks" } },
    // The axe swings onto the fir tree's trunk.
    thing: "🌲",
    backdrop: "wald",
    act: "tap",
    spot: [214, 152, 46],
    sounds: ["knock", "knock", "creak"],
    // A carpenter's saw cuts trees too.
    alsoFits: ["tischlerin"],
  },
];
