import type { PaintedPair } from ".";

// The painted pairs of the topic „gesundheit“ (topics.ts); how to write one is in index.ts and the game's CLAUDE.md.

export const PAINTED: PaintedPair[] = [
  {
    id: "zahnaerztin",
    topic: "gesundheit",
    name: "Zahnärztin",
    the: "die Zahnärztin",
    toThe: "die Zahnärztin",
    partner: { name: "Zahnarztspiegel", the: "der Zahnarztspiegel", acc: "den Zahnarztspiegel" },
    part: "a dentist's mouth mirror: a small round mirror on a long thin silver handle, lying diagonally",
    cast: "bear",
    before:
      "A friendly dentist's room: a dentist's chair with a round lamp above it, a small cabinet behind. A little bear child in a light-blue T-shirt sits in the chair with its mouth wide open. Beside the chair stands the dentist, a grown-up bear woman with eyelashes in a white coat with a light-blue collar, her paws empty and open, looking puzzled at the open mouth.",
    after:
      "The dentist now holds a small round dental mirror on a thin silver handle into the child's open mouth and looks at the teeth, smiling contently. The child is relaxed and its eyes smile.",
    sounds: ["scrub", "squeak"],
    made: true,
  },
];
