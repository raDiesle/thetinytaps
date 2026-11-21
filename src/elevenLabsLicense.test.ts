import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

// Everything made with ElevenLabs must be allowed in our YouTube videos (user decision, 21 November 2026): only models
// covered by a paid plan's commercial license (no Beta Services) and only paid accounts. The voice script enforces it
// before its first paid request (`requireLicense`); this keeps the script and the voice's stored model in line with it.
const script = readFileSync(new URL("../scripts/elevenlabs-voice.mjs", import.meta.url), "utf8");
const listed = (name: string) => {
  const found = script.match(new RegExp(`const ${name} = \\[([^\\]]*)\\]`));
  return found ? [...found[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
};
const licensed = listed("LICENSED_MODELS");

describe("ElevenLabs: only licensed models", () => {
  it("names the licensed models and refuses free accounts", () => {
    expect(licensed.length).toBeGreaterThan(0);
    expect(listed("UNLICENSED_TIERS")).toContain("free");
  });

  it("asks for the license before recording a line, in make and in try", () => {
    expect(script.match(/await requireLicense\(/g)?.length).toBe(2);
  });

  it("uses only licensed models: the default, Voice Design and the voice's stored model", () => {
    for (const [, model] of script.matchAll(/(?:DEFAULT_MODEL =|model_id:) "([^"]+)"/g)) expect(licensed, model).toContain(model);
    const stored = JSON.parse(readFileSync(new URL("games/adventure/stimme.json", import.meta.url), "utf8"));
    expect(licensed).toContain(stored.model);
  });
});
