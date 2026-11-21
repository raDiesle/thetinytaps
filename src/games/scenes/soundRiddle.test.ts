import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { SOUND_QUEUE } from "@/content/soundQueue";
import { read, sourceFiles } from "@/testSources";
import { SCENES } from "./index";
import { questsFor } from "./quests";
import { BORROWED_SOUNDS, RIDDLE_SOUNDS, riddleSoundsOf } from "./soundRiddle";

// The „Geräusch-Rätsel“ (idea B-02): what it asks, and that its ElevenLabs recordings load only while it is on.

const folder = new URL("./geraeusche/", import.meta.url);

test("every borrowed sound names an item that makes a sound of the riddle", () => {
  for (const id of BORROWED_SOUNDS) {
    const [sceneId, itemId] = id.split(":");
    const item = SCENES.find((scene) => scene.id === sceneId)?.items.find((i) => i.id === itemId);
    expect(item, id).toBeDefined();
    expect(RIDDLE_SOUNDS, id).toContain(item!.sound);
  }
});

test("every picture asks at least two sounds (so they take turns), each with an item of its own that makes it", () => {
  for (const scene of SCENES) {
    const sounds = riddleSoundsOf(scene);
    expect(sounds.length, scene.id).toBeGreaterThanOrEqual(2);
    for (const quest of questsFor("sound", scene)) {
      expect(quest.answers.length, `${scene.id}: ${quest.id}`).toBeGreaterThan(0);
      expect(quest.answers.every((item) => item.sound === quest.sound)).toBe(true);
    }
  }
});

test("every sound of the riddle is used, and has its recording or waits for it in the sound queue", () => {
  const used = new Set(SCENES.flatMap(riddleSoundsOf));
  for (const sound of RIDDLE_SOUNDS) {
    expect(used.has(sound), `${sound} is asked in no picture`).toBe(true);
    const file = `src/games/scenes/geraeusche/${sound}.mp3`;
    expect(existsSync(new URL(`${sound}.mp3`, folder)) || SOUND_QUEUE.some((queued) => queued.file === file), sound).toBe(true);
  }
});

test("the riddle's recordings are riddle sounds, listed in its README and small: mono, 44.1 kHz, 64 kbit/s", () => {
  const readme = readFileSync(new URL("README.md", folder), "utf8");
  for (const file of readdirSync(folder).filter((f) => f.endsWith(".mp3"))) {
    expect(RIDDLE_SOUNDS as readonly string[], file).toContain(file.replace(/\.mp3$/, ""));
    expect(readme, file).toContain(`| \`${file}\``);
    const bytes = new Uint8Array(readFileSync(new URL(file, folder)));
    // 2.5 s at 64 kbit/s is 20 KB.
    expect(bytes.length, file).toBeLessThan(22_000);
  }
});

// User request (November 2026): the ElevenLabs sounds are fetched only while the mode is on. Only ScenePlay may use
// the module that fetches them, and only in the effect that runs for the sound mode.
test("the riddle's recordings load only in its mode", () => {
  const users = sourceFiles("src")
    .map((file) => `src/${file}`)
    .filter((file) => /\.tsx?$/.test(file) && !file.includes(".test.") && /from "\.\/riddleSounds"|riddleSounds"/.test(read(file)));
  expect(users).toEqual(["src/games/scenes/ScenePlay.tsx"]);
  const play = read("src/games/scenes/ScenePlay.tsx");
  expect(play.match(/loadRiddleSounds\(/g)?.length).toBe(1);
  expect(play).toMatch(/if \(!riddle\) \{\s*newQuestion\(\);\s*return;\s*\}[^}]*loadRiddleSounds\(/);
});
