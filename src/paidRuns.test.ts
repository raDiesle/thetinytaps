import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

// This Mac's Zscaler blocks ElevenLabs and Gemini for good; paid work goes into queues that only a Claude cloud session
// makes with /paid-queue (root CLAUDE.md, „Working here“; user decisions, 21 November 2026).
describe("paid runs go through the queues and a Claude cloud session", () => {
  const read = (path: string) => readFileSync(path, "utf8");

  it("the paid scripts ask whether the service can be reached before their first request", () => {
    for (const script of ["scripts/gemini-image.mjs", "scripts/elevenlabs-voice.mjs"]) {
      const text = read(script);
      expect(text, script).toContain('import { requireReachable } from "./networkFilter.mjs"');
      // Every function that fetches from the service asks first.
      for (const fn of text.split(/\n(?=(?:async )?function )/).filter((part) => /await fetch\(/.test(part)))
        expect(fn.indexOf("requireReachable("), `${script}: ${fn.slice(0, 60)}`).toBeGreaterThan(-1);
    }
    // The check itself sends no key.
    expect(read("scripts/networkFilter.mjs")).not.toMatch(/api-key|API_KEY/);
  });

  // `bun run paid` as a bare script on another computer (the user's Windows PC) is deprecated: nobody looks at what came
  // there, redoes it or finishes the work round it. A text may name it only to say so.
  it("no instruction sends the paid run to another computer", () => {
    const files = [
      "CLAUDE.md",
      ".claude/skills/paid-queue/SKILL.md",
      ".claude/skills/bild-erzeugen/SKILL.md",
      "scripts/paid-queue.mjs",
      "src/content/voiceQueue.ts",
      "src/content/soundQueue.ts",
      "src/lib/sounds/README.md",
      "src/components/CloudQueueStatus.tsx",
    ];
    for (const file of files) {
      const text = read(file).replace(/\s+/g, " ");
      for (const match of text.matchAll(/(?:an)?other computer|anderen (?:Rechner|Computer)/gi)) {
        const around = text.slice(Math.max(0, (match.index ?? 0) - 120), (match.index ?? 0) + 220);
        expect(around, `${file}: „${around}“`).toMatch(/deprecated|nicht mehr|never/i);
      }
    }
  });
});
