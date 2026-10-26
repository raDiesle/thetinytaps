import { existsSync } from "node:fs";
import { expect, test } from "@rstest/core";
import { PREP_CUES, PREP_MS, PREP_RECORDINGS } from "./prep";
import { ORIGIN_CUES, ORIGIN_MS, ORIGIN_RECORDINGS } from "./origin";

// The prelude's sounds fire when the brushing clock passes them, so they must lie inside their part.
const PARTS = [
  { name: "sweets", cues: ORIGIN_CUES, ms: ORIGIN_MS.sweets },
  { name: "brush", cues: PREP_CUES.brush, ms: PREP_MS.brush },
  { name: "paste", cues: PREP_CUES.paste, ms: PREP_MS.paste },
];

test("prelude sounds are in order and inside their part", () => {
  for (const { name, cues, ms } of PARTS) {
    const times = cues.map((c) => c.at);
    expect({ name, times }).toEqual({ name, times: [...times].sort((a, b) => a - b) });
    for (const at of times) expect({ name, at, inside: at >= 0 && at < ms }).toEqual({ name, at, inside: true });
  }
});

test("every preloaded prelude recording has its file", () => {
  for (const name of [...ORIGIN_RECORDINGS, ...PREP_RECORDINGS]) expect({ name, file: existsSync(`src/lib/sounds/${name}.mp3`) }).toEqual({ name, file: true });
});
