import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { SOUND_QUEUE } from "./soundQueue";

// Sound effects wait here for a Claude cloud session, since this Mac's Zscaler blocks ElevenLabs (root CLAUDE.md).
test("queued sounds are unique, dated and go into the sounds folder", () => {
  expect(new Set(SOUND_QUEUE.map((sound) => sound.id)).size).toBe(SOUND_QUEUE.length);
  for (const sound of SOUND_QUEUE) {
    expect(sound.date, sound.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(sound.file, sound.id).toMatch(/^src\/lib\/sounds\/[a-z0-9-]+\.mp3$/);
    expect(sound.seconds, sound.id).toBeGreaterThan(0);
    expect(sound.seconds, sound.id).toBeLessThanOrEqual(5);
    expect(sound.influence, sound.id).toBeGreaterThanOrEqual(0);
    expect(sound.influence, sound.id).toBeLessThanOrEqual(1);
  }
});

// A made sound leaves the queue in the commit that brings its file, or the next cloud session would pay for it again.
test("a made sound is no longer queued", () => {
  for (const sound of SOUND_QUEUE) expect(existsSync(sound.file), `${sound.id}: made – take it out of soundQueue.ts`).toBe(false);
});
