import type { SceneSpec } from "../scene";
import { digger, paintRoller } from "../tools";

// The helpers of the topic „Bauen & Reparieren“ (topics.ts): who builds, mends and paints, written as data (see
// scene.tsx). Hammer, saw and spanner fit several of them, so `alsoFits` keeps those apart.

export const SCENES: SceneSpec[] = [
  {
    id: "mechanikerin",
    topic: "bauen",
    name: "Mechanikerin",
    the: "die Mechanikerin",
    toThe: "die Mechanikerin",
    partner: { name: "Schraubenschlüssel", the: "der Schraubenschlüssel", acc: "den Schraubenschlüssel", emoji: "🔧" },
    helper: { fur: "bear", outfit: { coat: "#adb5bd", hat: "cap", hatColor: "#e03131", detail: "straps", detailColor: "#1c7ed6" }, lashes: true },
    // The spanner turns a nut on the car.
    thing: "🚗",
    backdrop: "werkstatt",
    act: "turn",
    sounds: ["click", "rattle"],
    // A plumber turns his pipes with a spanner too.
    alsoFits: ["klempner"],
  },
  {
    id: "tischlerin",
    topic: "bauen",
    name: "Tischlerin",
    the: "die Tischlerin",
    toThe: "die Tischlerin",
    partner: { name: "Säge", the: "die Säge", acc: "die Säge", emoji: "🪚" },
    helper: { fur: "fox", outfit: { coat: "#74c0fc", hat: "bandana", hatColor: "#2b8a3e", detail: "apron", detailColor: "#b5835a" }, lashes: true },
    // The saw goes to and fro over the log.
    thing: "🪵",
    backdrop: "werkstatt",
    act: "rub",
    sounds: ["saw"],
  },
  {
    id: "handwerker",
    topic: "bauen",
    name: "Handwerker",
    the: "der Handwerker",
    toThe: "der Handwerker",
    partner: { name: "Hammer", the: "der Hammer", acc: "den Hammer", emoji: "🔨" },
    helper: { fur: "bear", outfit: { coat: "#495057", hat: "cap", hatColor: "#f08c00", detail: "belt" } },
    // The hammer knocks the wobbly chair's nail in.
    thing: "🪑",
    backdrop: "kinderzimmer",
    act: "tap",
    sounds: ["knock", "knock"],
    // A carpenter, a builder and a mechanic all may need a hammer.
    alsoFits: ["tischlerin", "bauarbeiterin", "mechanikerin"],
  },
  {
    id: "elektrikerin",
    topic: "bauen",
    name: "Elektrikerin",
    the: "die Elektrikerin",
    toThe: "die Elektrikerin",
    partner: { name: "Glühbirne", the: "die Glühbirne", acc: "die Glühbirne", emoji: "💡" },
    helper: { fur: "fox", outfit: { coat: "#fab005", hat: "hardhat", hatColor: "#f8f9fa", detail: "belt" }, lashes: true },
    // The bulb touches the dark house in the evening, and it lights up.
    thing: "🏠",
    backdrop: "nacht",
    act: "light",
    sounds: ["click", "ding"],
  },
  {
    id: "kranfuehrer",
    topic: "bauen",
    name: "Kranführer",
    the: "der Kranführer",
    toThe: "der Kranführer",
    partner: { name: "Kran", the: "der Kran", acc: "den Kran", emoji: "🏗️" },
    helper: { fur: "fox", outfit: { coat: "#fd7e14", hat: "hardhat", hatColor: "#f8f9fa", detail: "vest", detailColor: "#ffd43b" } },
    // The crane is set down on the building site.
    backdrop: "baustelle",
    act: "onto",
    spot: [214, 116, 80],
    sounds: ["whirr", "thump"],
    // A builder works with the crane too.
    alsoFits: ["bauarbeiterin"],
  },
  {
    id: "klempner",
    topic: "bauen",
    name: "Klempner",
    the: "der Klempner",
    toThe: "der Klempner",
    partner: { name: "Saugglocke", the: "die Saugglocke", acc: "die Saugglocke", emoji: "🪠" },
    helper: { fur: "fox", outfit: { coat: "#1971c2", hat: "cap", hatColor: "#e03131", detail: "straps", detailColor: "#495057" } },
    // The plunger pumps the toilet free.
    thing: "🚽",
    backdrop: "bad",
    act: "tap",
    sounds: ["squeak", "glug"],
  },
  {
    id: "baggerfahrer",
    topic: "bauen",
    name: "Baggerfahrer",
    the: "der Baggerfahrer",
    toThe: "der Baggerfahrer",
    partner: { name: "Bagger", the: "der Bagger", acc: "den Bagger", draw: digger },
    helper: { fur: "bear", outfit: { coat: "#1c7ed6", hat: "hardhat", hatColor: "#fd7e14", detail: "vest", detailColor: "#fab005" } },
    // The digger comes down onto the building site, beside the sand heap.
    backdrop: "baustelle",
    act: "onto",
    spot: [218, 134, 102],
    sounds: ["rumble", "beeps"],
    // A builder and a crane driver work with a digger too.
    alsoFits: ["bauarbeiterin", "kranfuehrer"],
  },
  {
    id: "anstreicher",
    topic: "bauen",
    name: "Anstreicher",
    the: "der Anstreicher",
    toThe: "der Anstreicher",
    partner: { name: "Farbrolle", the: "die Farbrolle", acc: "die Farbrolle", draw: paintRoller },
    helper: { fur: "fox", outfit: { coat: "#f8f9fa", hat: "cap", hatColor: "#f8f9fa", detail: "dots", detailColor: "#74c0fc" } },
    // The roller rolls the fresh blue up and down the wall.
    backdrop: "renovieren",
    act: "rub",
    spot: [192, 94, 62],
    sounds: ["swirl", "scrub"],
    // A painter's brush paints walls too.
    alsoFits: ["malerin"],
  },
];
