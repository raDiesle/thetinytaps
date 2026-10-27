import { readdirSync } from "node:fs";
import { describe, expect, it } from "@rstest/core";
import { LANGUAGE_STATUS } from "@/content/ideas/languageStatus";
import { iconFor, type Need, picturesFor, POTTY_TEXTS, SAID, type Said, scenePicture, scenesFor, STEPS, TAPSI, WAIT_SCENES } from "./content";
import { addStar } from "./stars";
import { waitLanguageFor, waitLanguageOf } from "./waitMusic";

const NEEDS: Need[] = ["pipi", "kaka"];
const SAIDS: Said[] = SAID.map((s) => s.id);

describe("Aufs Töpfchen", () => {
  it("has steps with their own ids, every one said for pipi, kaka and not knowing, ending with the party", () => {
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
    expect(STEPS.at(-1)?.id).toBe("party");
    expect(SAIDS.sort()).toEqual(["kaka", "pipi", "unsure"]);
    for (const texts of Object.values(POTTY_TEXTS)) {
      for (const said of SAIDS) for (const step of STEPS) expect(texts.steps[step.id](TAPSI.name, said).trim()).not.toBe("");
      for (const need of NEEDS) expect(texts.went[need].trim()).not.toBe("");
      expect(texts.finish.trim()).not.toBe("");
      for (const scene of WAIT_SCENES) expect(texts.scenes[scene.id]?.trim()).toBeTruthy();
      expect(texts.star.trim()).not.toBe("");
    }
  });

  it("brings every waiting scene of what was said, its own and the silly ones taking turns, both needs when nobody knows", () => {
    for (const said of SAIDS) {
      const scenes = scenesFor(said);
      const fits = (s: (typeof WAIT_SCENES)[number]) => s.need === "both" || said === "unsure" || s.need === said;
      expect(new Set(scenes.map((s) => s.id))).toEqual(new Set(WAIT_SCENES.filter(fits).map((s) => s.id)));
      // Never the same scene twice in a row, also when the round starts again.
      expect(scenes.filter((s, i) => s.id === scenes[(i + 1) % scenes.length].id)).toEqual([]);
      expect(scenes[1].need).toBe("both");
    }
    expect(
      scenesFor("unsure")
        .map((s) => s.need)
        .slice(0, 4),
    ).toEqual(["pipi", "both", "kaka", "both"]);
  });

  it("shows both need pictures in turn and ❓ in the row while nobody knows", () => {
    const need = STEPS.find((s) => s.id === "need")!;
    expect(picturesFor(need, "unsure")).toEqual(["blase", "bauch"]);
    expect(picturesFor(need, "kaka")).toEqual(["bauch"]);
    expect(iconFor(need, "unsure")).toBe("❓");
    expect(iconFor(need, "pipi")).toBe("💦");
  });

  it("has every picture of the story, the waiting scenes moving (with a second frame), and no pictures of anybody else", () => {
    const files = readdirSync("src/games/potty/bilder").filter((f) => f.endsWith(".webp"));
    const names = new Set([
      ...STEPS.flatMap((s) => SAIDS.flatMap((said) => picturesFor(s, said))),
      ...WAIT_SCENES.flatMap((s) => [scenePicture(s), `${scenePicture(s)}-b`]),
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
});
