import type { PaintedPair } from ".";

// The painted pairs of the topic „unterwegs“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "briefkasten-brief",
    topic: "unterwegs",
    name: "Briefkasten",
    the: "der Briefkasten",
    toThe: "zum Briefkasten",
    partner: { name: "Brief", the: "der Brief", acc: "den Brief", emoji: "✉️" },
    cast: "fox",
    before:
      "A quiet street in front of a house. On the pavement a yellow post box on a post, its slot empty, no writing or sign on it. A fox child in a light-blue T-shirt and dark blue trousers stands in front of the post box with empty paws, looking at the slot, puzzled.",
    after: "The fox child now pushes a white envelope into the post box's slot, half of it still sticking out, and smiles happily.",
    sounds: ["whoosh", "plop"],
    made: true,
  },
  {
    id: "fahrrad-helm",
    topic: "unterwegs",
    name: "Fahrrad",
    the: "das Fahrrad",
    toThe: "zum Fahrrad",
    partner: { name: "Fahrradhelm", the: "der Fahrradhelm", acc: "den Fahrradhelm" },
    part: "a light-blue children's bicycle helmet with air slots and a black chin strap",
    cast: "bear",
    before:
      "A quiet path in a park with a bench at the side. In the middle a small red children's bicycle stands ready on its stand. A bear child in a green T-shirt and blue trousers stands beside it, one paw on the handlebar, the other paw on top of its own bare head, looking unsure.",
    after: "The bear child now wears a light-blue bicycle helmet, its strap closed under the chin, sits on the bicycle and rides off, smiling happily.",
    sounds: ["click", "ring"],
  },
  {
    id: "einkaufswagen-muenze",
    topic: "unterwegs",
    name: "Einkaufswagen",
    the: "der Einkaufswagen",
    toThe: "zum Einkaufswagen",
    partner: { name: "Münze", the: "die Münze", acc: "die Münze", emoji: "🪙" },
    cast: "fox",
    before:
      "In front of a supermarket: its glass door behind, a row of shopping trolleys pushed into each other and joined by their little chains. A fox child in a light-green T-shirt and red trousers holds the handle of the front trolley with both paws and tugs, but it stays chained; the little lock box on its handle has an empty slot. The child looks at the lock box, puzzled.",
    after:
      "The fox child now pushes a shiny gold coin into the lock box on the handle, the chain comes free, and the child pulls the trolley out, smiling happily.",
    sounds: ["plink", "click"],
  },
  {
    id: "haltestelle-bus",
    topic: "unterwegs",
    name: "Haltestelle",
    the: "die Haltestelle",
    toThe: "zur Haltestelle",
    partner: { name: "Bus", the: "der Bus", acc: "den Bus" },
    part: "a yellow city bus seen from the side, its doors open",
    cast: "fox",
    before:
      "A bus stop on a town street: a plain round sign without letters on a pole and a small glass shelter with a bench, houses behind. The road beside it is empty. A fox child in a red jacket with a little backpack stands at the kerb beside a grown-up fox in a blue coat; both look down the empty road, waiting, puzzled.",
    after: "A yellow city bus now stands at the stop with its doors open; the fox child climbs in, waving happily, and the grown-up fox smiles behind it.",
    sounds: ["engine", "hiss"],
  },
  {
    id: "auto-reifen",
    topic: "unterwegs",
    name: "Auto",
    the: "das Auto",
    toThe: "zum Auto",
    partner: { name: "Reifen", the: "der Reifen", acc: "den Reifen" },
    part: "a black car tyre on a silver wheel rim",
    cast: "bear",
    before:
      "The side of a quiet country road with a grassy verge. In the middle a small blue car, raised on a car jack at its front corner; there the wheel arch is empty, and only the bare round hub with its bolts shows. A grown-up bear in blue overalls and a bear child in a yellow T-shirt and blue dungarees stand beside the car with empty paws, looking at the empty wheel arch, puzzled.",
    after:
      "The bear child and the grown-up bear now fit a black tyre on a silver rim onto the hub together, and the car stands on all its wheels again. Both smile happily.",
    sounds: ["clonk", "click"],
  },
  {
    id: "ruderboot-ruder",
    topic: "unterwegs",
    name: "Ruderboot",
    the: "das Ruderboot",
    toThe: "zum Ruderboot",
    partner: { name: "Ruder", the: "die Ruder", acc: "die Ruder", plural: true },
    part: "two wooden oars with flat red-tipped blades, crossed",
    cast: "both",
    before:
      "A calm lake with reeds and a wooden jetty. In the middle a small wooden rowing boat floats beside the jetty; the two metal holders on its sides are empty. A fox child in a yellow life jacket and a bear child in an orange life jacket sit in the boat, their empty paws in their laps, looking at the still water, puzzled: the boat doesn't move.",
    after:
      "The bear child now holds two wooden oars in the holders and rows; the boat glides away from the jetty with little waves behind it, and both children smile happily.",
    sounds: ["splash", "trickle"],
  },
];
