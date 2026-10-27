import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "bun:test";
import { LANGUAGE_STATUS } from "@/content/ideas/languageStatus";
import {
  iconFor,
  NOTHING_STEPS,
  picturesFor,
  POTTY_TEXTS,
  SAID,
  type Said,
  SCENE_MS,
  scenePicture,
  scenesFor,
  STEPS,
  TAPSI,
  WAIT_SCENE_MS,
  WAIT_SCENES,
  type Went,
  type Which,
} from "./content";
import { addStar } from "./stars";
import { waitLanguageFor, waitLanguageOf } from "./waitMusic";

const SAIDS: Said[] = SAID.map((s) => s.id);
const WENTS: Went[] = ["pipi", "kaka", "both"];
const WHICHES: Which[] = [...new Set([...SAIDS, ...WENTS])];
/** The steps of both stories. */
const ALL_STEPS = [...new Set([...STEPS, ...NOTHING_STEPS])];

describe("Aufs Töpfchen", () => {
  it("has steps with their own ids, every one said for pipi, kaka and not knowing, ending with the party", () => {
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
    expect(STEPS.at(-1)?.id).toBe("party");
    expect([...SAIDS].sort()).toEqual(["both", "kaka", "pipi", "unsure"]);
    for (const texts of Object.values(POTTY_TEXTS)) {
      for (const which of WHICHES) for (const step of ALL_STEPS) expect(texts.steps[step.id](TAPSI.name, which).trim()).not.toBe("");
      expect(texts.nothing.trim()).not.toBe("");
      for (const went of WENTS) expect(texts.went[went].trim()).not.toBe("");
      for (const said of SAIDS) expect(texts.said[said].trim()).not.toBe("");
      expect(texts.finish.trim()).not.toBe("");
      for (const scene of WAIT_SCENES) expect(texts.scenes[scene.id]?.trim()).toBeTruthy();
      expect(texts.star.trim()).not.toBe("");
    }
  });

  it("goes from sitting to washing hands and playing when nothing came, ending there", () => {
    const sit = STEPS.findIndex((s) => s.id === "sit");
    expect(NOTHING_STEPS.slice(0, sit + 1)).toEqual(STEPS.slice(0, sit + 1));
    expect(NOTHING_STEPS.slice(sit + 1).map((s) => s.id)).toEqual(["wash", "play"]);
    // Tapsi plays until Mama and Papa ask: nothing goes on by itself there.
    expect(NOTHING_STEPS.at(-1)?.auto).toBeUndefined();
  });

  it("brings only the waiting scenes of what was said, pipi and kaka taking turns for both or when nobody knows", () => {
    for (const said of SAIDS) {
      const scenes = scenesFor(said);
      const fits = (s: (typeof WAIT_SCENES)[number]) => s.need === said || ((said === "both" || said === "unsure") && s.need !== "silly");
      expect(new Set(scenes.map((s) => s.id))).toEqual(new Set(WAIT_SCENES.filter(fits).map((s) => s.id)));
      // Never the same scene twice in a row, also when the round starts again.
      expect(scenes.filter((s, i) => s.id === scenes[(i + 1) % scenes.length].id)).toEqual([]);
    }
    expect(
      scenesFor("unsure")
        .map((s) => s.need)
        .slice(0, 4),
    ).toEqual(["pipi", "kaka", "pipi", "kaka"]);
  });

  it("goes on by itself only where nothing real has to happen, and the waiting scenes stay longer than their sounds", () => {
    const auto = (id: string) => STEPS.find((s) => s.id === id)?.auto;
    // The child takes its trousers down, wipes, pulls them up, flushes and washes itself: that waits for a tap or „Weiter“.
    for (const id of ["down", "wipe", "up", "flush", "wash", "party"]) expect(auto(id)).toBeUndefined();
    // A grown-up tells the first steps at their own pace: only „Weiter“ goes on there, and it calls for attention.
    expect(STEPS.filter((s) => s.nudge).map((s) => s.id)).toEqual(["eat", "need", "call", "go"]);
    for (const step of STEPS) if (step.nudge) expect(step.auto).toBeUndefined();
    for (const id of ["sit", "done"]) expect(auto(id)).toBeGreaterThan(0);
    for (const step of ALL_STEPS) if (step.auto !== undefined) expect(step.auto).toBeGreaterThan(step.ms);
    // The trousers go down again and again until the story goes on, after a pause longer than a frame.
    for (const step of ALL_STEPS) if (step.again !== undefined) expect(step.moves?.length).toBeGreaterThan(0);
    expect(WAIT_SCENE_MS).toBeGreaterThan(SCENE_MS);
  });

  it("shows both need pictures in turn and ❓ in the row while nobody knows", () => {
    const need = STEPS.find((s) => s.id === "need")!;
    expect(picturesFor(need, "unsure")).toEqual(["blase", "bauch"]);
    expect(picturesFor(need, "kaka")).toEqual(["bauch"]);
    expect(iconFor(need, "unsure")).toBe("❓");
    expect(iconFor(need, "pipi")).toBe("💦");
  });

  it("starts with eating and drinking taking turns in one step, and shows both endings when both came", () => {
    expect(STEPS[0].id).toBe("eat");
    expect(picturesFor(STEPS[0], "unsure")).toEqual(["essen", "trinken"]);
    const done = STEPS.find((s) => s.id === "done")!;
    expect(picturesFor(done, "both")).toEqual(["fertig-pipi", "fertig-kaka"]);
    expect(iconFor(done, "both")).toBe("💧💩");
    for (const texts of Object.values(POTTY_TEXTS)) expect(texts.steps.done(TAPSI.name, "both")).not.toBe(texts.steps.done(TAPSI.name, "pipi"));
  });

  it("has every picture of the story, a thought bubble's with both frames if at all, and no pictures of anybody else", () => {
    const files = readdirSync("src/games/potty/bilder").filter((f) => f.endsWith(".webp"));
    // A thought bubble shows its emoji until it has a picture; a picture it has moves.
    const thoughts = WAIT_SCENES.map(scenePicture).filter((name) => files.some((f) => f.startsWith(`${TAPSI.pictures}-${name}`)));
    const names = new Set([
      ...ALL_STEPS.flatMap((s) => [...WHICHES.flatMap((which) => picturesFor(s, which)), ...(s.moves ?? [])]),
      ...thoughts.flatMap((name) => [name, `${name}-b`]),
    ]);
    expect([...names].map((name) => `${TAPSI.pictures}-${name}.webp`).filter((f) => !files.includes(f))).toEqual([]);
    // Only Tapsi goes to the potty: pictures of other animals would only be downloaded for nothing.
    expect(files.filter((f) => !f.startsWith(`${TAPSI.pictures}-`))).toEqual([]);
  });

  it("puts one more star on today and forgets days older than two weeks", () => {
    const today = new Date(2026, 9, 26);
    const log = addStar({ "2026-10-26": 2, "2026-10-01": 5, "2026-10-20": 1 }, today);
    expect(log).toEqual({ "2026-10-26": 3, "2026-10-20": 1 });
    expect(addStar({}, today)).toEqual({ "2026-10-26": 1 });
  });

  it("sings the waiting song in the app language, else German, else not at all", () => {
    expect(waitLanguageOf("./musik-toepfchen-warten-ru.mp3")).toBe("ru");
    expect(waitLanguageOf("./musik-zaehneputzen-lied-de.mp3")).toBeNull();
    expect(waitLanguageFor("ru", ["de", "ru"])).toBe("ru");
    expect(waitLanguageFor("en", ["de", "ru"])).toBe("de");
    expect(waitLanguageFor("en", ["ru"])).toBeNull();
  });

  it("lists exactly the waiting songs there are in the language table", () => {
    const sung = readdirSync("src/games/potty/musik").flatMap((f) => waitLanguageOf(f) ?? []);
    const part = LANGUAGE_STATUS.find((row) => row.href === "/toepfchen/")?.parts?.find((p) => p.label.includes("Warte-Lied"));
    const listed = Object.entries(part?.languages ?? {}).flatMap(([lang, state]) => (state === "done" ? [lang] : []));
    expect(listed.sort()).toEqual(sung.sort());
  });

  it("keeps the thought bubble's stand-ins for pipi and kaka out of the waiting song", () => {
    // Every block of lyrics in the Suno sheet; the song is about the waiting, the bubble shows the rest.
    const sheet = readFileSync("src/games/potty/musik/suno-lied.md", "utf8");
    const lyrics = [...sheet.matchAll(/Lyrics:\s*```text\n([\s\S]*?)```/g)].map((m) => m[1].toLowerCase());
    expect(lyrics.length).toBeGreaterThan(0);
    const banned = ["regen", "wasser", "brunnen", "gieß", "schlauch", "ballon", "ketchup", "huhn", "ei!", "knete", "drück", "plitsch", "platsch", "plopp"];
    for (const text of lyrics) expect(banned.filter((word) => text.includes(word))).toEqual([]);
  });
});
