import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "bun:test";
import { LANGUAGE_STATUS } from "@/content/ideas/languageStatus";
import {
  expectedWent,
  NOTHING_STEPS,
  picturesFor,
  POTTY_TEXTS,
  SAID,
  type Said,
  SCENE_MS,
  scenePicture,
  FIRST_SCENES,
  scenesFor,
  STEPS,
  symbolsFor,
  TAPSI,
  THOUGHT_FRAME_MS,
  MOUSE_AGAIN_MS,
  MOUSE_FIRST_MS,
  WAIT_SCENE_MS,
  WAIT_SCENES,
  type Went,
  type Which,
} from "./content";
import { CALL_PICTURE } from "./CallBubble";
import { SYMBOL_EMOJI } from "./StripSymbol";
import { SYMBOL_PICTURE_QUEUE } from "./symbolPictures";
import { addStar } from "./stars";
import { loopPosition, passesEndMs, waitLanguageFor, waitLanguageOf, waitLoopSeconds } from "./waitMusic";

/** What the child can have said: a button each, or nothing yet. */
const SAIDS: Said[] = [...SAID, "unsure"];
const WENTS: Went[] = ["pipi", "kaka", "both"];
const WHICHES: Which[] = [...new Set([...SAIDS, ...WENTS])];
/** The steps of both stories. */
const ALL_STEPS = [...new Set([...STEPS, ...NOTHING_STEPS])];

describe("Aufs Töpfchen", () => {
  it("has steps with their own ids, every one said for pipi, kaka and not knowing, ending with the party and then the stars", () => {
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
    // „Hat geklappt!“ is no mode of its own any more: the week's stars are the story's last step, over the party picture.
    expect(STEPS.slice(-2).map((s) => s.id)).toEqual(["party", "stars"]);
    expect(STEPS.at(-1)?.picture).toBe(STEPS.at(-2)?.picture);
    expect([...SAIDS].sort()).toEqual(["both", "kaka", "pipi", "unsure"]);
    for (const texts of Object.values(POTTY_TEXTS)) {
      for (const which of WHICHES) for (const step of ALL_STEPS) expect(texts.steps[step.id](TAPSI.name.de, which).trim()).not.toBe("");
      expect(texts.nothing.trim()).not.toBe("");
      for (const need of ["pipi", "kaka"] as const) expect(texts.went[need].trim()).not.toBe("");
      // „Was ist im Töpfchen?“ offers pipi and kaka only (the user's choice), and „nichts“ in a word.
      expect(Object.keys(texts.went).sort()).toEqual(["kaka", "pipi"]);
      expect(texts.nothingButton.trim()).not.toBe("");
      for (const id of SAID) expect(texts.said[id].trim()).not.toBe("");
      expect(texts.finish.trim()).not.toBe("");
      // A new thought comes in German first; the game says it in German until it is translated (sayScene).
      for (const scene of WAIT_SCENES) if (texts === POTTY_TEXTS.de || scene.id in texts.scenes) expect(texts.scenes[scene.id]?.trim()).toBeTruthy();
      expect(texts.star.trim()).not.toBe("");
    }
  });

  it("asks what the child said with one button each for pipi, kaka and both, and no ❓, since not knowing is both", () => {
    // ❓ was the same as 💧💩 to the user: a button that means what another one means only makes a grown-up think.
    expect(SAID).toEqual(["pipi", "kaka", "both"]);
    expect(expectedWent("unsure")).toBe("both");
    const fixed = () => 0.5;
    expect(scenesFor("unsure", fixed)).toEqual(scenesFor("both", fixed));
  });

  it("goes from sitting to washing hands and playing when nothing came, ending there", () => {
    const sit = STEPS.findIndex((s) => s.id === "sit");
    expect(NOTHING_STEPS.slice(0, sit + 1)).toEqual(STEPS.slice(0, sit + 1));
    expect(NOTHING_STEPS.slice(sit + 1).map((s) => s.id)).toEqual(["wash", "play"]);
    // Tapsi plays until Mama and Papa ask: nothing goes on by itself there.
    expect(NOTHING_STEPS.at(-1)?.auto).toBeUndefined();
  });

  it("brings only the waiting scenes of what was said, the best ones first, then the others in a random order", () => {
    for (const said of SAIDS) {
      const scenes = scenesFor(said);
      const fits = (s: (typeof WAIT_SCENES)[number]) => s.need === said || ((said === "both" || said === "unsure") && s.need !== "silly");
      expect(new Set(scenes.map((s) => s.id))).toEqual(new Set(WAIT_SCENES.filter(fits).map((s) => s.id)));
      // Never the same scene twice in a row, also when the round starts again.
      expect(scenes.filter((s, i) => s.id === scenes[(i + 1) % scenes.length].id)).toEqual([]);
    }
    // The hen, the whale, the mole, the hourglass and the funnel always come first (the user's choice), as far as they fit.
    expect(FIRST_SCENES.every((id) => WAIT_SCENES.some((s) => s.id === id))).toBe(true);
    expect(
      scenesFor("unsure")
        .slice(0, 5)
        .map((s) => s.id),
    ).toEqual(["huhn", "wal", "maulwurf", "sanduhr", "trichter"]);
    expect(
      scenesFor("pipi")
        .slice(0, 3)
        .map((s) => s.id),
    ).toEqual(["wal", "sanduhr", "trichter"]);
    expect(
      scenesFor("kaka")
        .slice(0, 2)
        .map((s) => s.id),
    ).toEqual(["huhn", "maulwurf"]);
    // The rest are shuffled.
    expect(scenesFor("unsure", () => 0).slice(5)).not.toEqual(scenesFor("unsure", () => 0.99).slice(5));
  });

  it("goes on by itself only where nothing real has to happen, and the waiting scenes stay longer than their sounds", () => {
    const auto = (id: string) => STEPS.find((s) => s.id === id)?.auto;
    // The child takes its trousers down, wipes, pulls them up, flushes and washes itself: that waits for a tap or „Weiter“.
    for (const id of ["down", "wipe", "up", "flush", "wash", "party", "stars"]) expect(auto(id)).toBeUndefined();
    // A grown-up tells the first steps at their own pace: only „Weiter“ goes on there, and it calls for attention.
    expect(STEPS.filter((s) => s.nudge).map((s) => s.id)).toEqual(["eat", "need", "call", "go"]);
    for (const step of STEPS) if (step.nudge) expect(step.auto).toBeUndefined();
    for (const id of ["sit", "done"]) expect(auto(id)).toBeGreaterThan(0);
    for (const step of ALL_STEPS) if (step.auto !== undefined) expect(step.auto).toBeGreaterThan(step.ms);
    // The trousers go down again and again until the story goes on, after a pause longer than a frame.
    for (const step of ALL_STEPS) if (step.again !== undefined) expect(step.moves?.length).toBeGreaterThan(0);
    expect(WAIT_SCENE_MS).toBeGreaterThan(SCENE_MS);
    // Long enough for a toddler to look at a thought: 2.6 s was far too short for the user, and so was 8 s.
    expect(WAIT_SCENE_MS).toBeGreaterThan(8000);
    // A thought's before and after each stay long enough to be seen, at least twice in a thought.
    expect(THOUGHT_FRAME_MS).toBeGreaterThanOrEqual(3000);
    expect(WAIT_SCENE_MS).toBeGreaterThanOrEqual(2 * 2 * THOUGHT_FRAME_MS - 500);
    // The mouse comes only after a while, and never again before the last one ran off (its run takes 10 s, potty.css).
    expect(MOUSE_FIRST_MS).toBeGreaterThanOrEqual(10000);
    expect(MOUSE_AGAIN_MS).toBeGreaterThan(10000);
  });

  it("left out the thoughts the user didn't want, and centres a thought only on a point inside its picture", () => {
    // User feedback, November 2026: the watering can, water wheel, sandcastle bucket, chick, tunnel and butterfly.
    for (const id of ["giesskanne", "wasserrad", "eimer", "kueken", "tunnel", "schmetterling"]) {
      expect(WAIT_SCENES.some((s) => s.id === id)).toBe(false);
      for (const lang of Object.values(POTTY_TEXTS)) expect(lang.scenes[id]).toBeUndefined();
    }
    for (const { focus } of WAIT_SCENES) {
      if (!focus) continue;
      for (const v of [focus.x, focus.y]) {
        expect(v).toBeGreaterThan(0);
        expect(v).toBeLessThan(1);
      }
      // Zoomed in, never out: the bubble is filled by the picture.
      expect(focus.zoom).toBeGreaterThanOrEqual(1);
    }
    // The tortoise's head comes out at the bottom left: the bubble centres there.
    expect(WAIT_SCENES.find((s) => s.id === "schildkroete")?.focus?.x).toBeLessThan(0.5);
  });

  it("goes on with the waiting song where it was paused, inside its repeating part", () => {
    const part = { loopStart: 1, loopEnd: 11 };
    expect(loopPosition(1, 0, 4000, part)).toBe(5);
    // Past the end it wraps to the loop's start: 1 + 14 s is 15, 4 s past the end, so 1 + 4.
    expect(loopPosition(1, 0, 14000, part)).toBe(5);
    expect(loopPosition(9, 1000, 3000, part)).toBe(1);
  });

  it("shows both need pictures in turn and ❓ in the row while nobody knows", () => {
    const need = STEPS.find((s) => s.id === "need")!;
    expect(picturesFor(need, "unsure")).toEqual(["blase", "bauch"]);
    expect(picturesFor(need, "kaka")).toEqual(["bauch"]);
    // Not knowing is both, so the row shows both symbols, never a ❓.
    expect(symbolsFor(need, "unsure")).toEqual(["pipi", "kaka"]);
    expect(symbolsFor(need, "pipi")).toEqual(["pipi"]);
  });

  it("starts with eating and drinking taking turns in one step, and shows both endings when both came", () => {
    expect(STEPS[0].id).toBe("eat");
    expect(picturesFor(STEPS[0], "unsure")).toEqual(["essen", "trinken"]);
    const done = STEPS.find((s) => s.id === "done")!;
    expect(picturesFor(done, "both")).toEqual(["fertig-pipi", "fertig-kaka"]);
    expect(symbolsFor(done, "both")).toEqual(["pipi", "kaka"]);
    for (const texts of Object.values(POTTY_TEXTS)) expect(texts.steps.done(TAPSI.name.de, "both")).not.toBe(texts.steps.done(TAPSI.name.de, "pipi"));
  });

  /** Every line said or shown in a language, with Tapsi's name in it. */
  const linesIn = (id: keyof typeof POTTY_TEXTS) => {
    const texts = POTTY_TEXTS[id];
    const name = TAPSI.name[id];
    if (!texts || !name) throw new Error(`${id}: texts and Tapsi's name expected`);
    return [
      name,
      ...ALL_STEPS.flatMap((step) => WHICHES.map((which) => texts.steps[step.id](name, which))),
      ...Object.values(texts.scenes),
      ...Object.values(texts.said),
      ...Object.values(texts.went),
      texts.next,
      texts.askSaid,
      texts.askWent,
      texts.finish,
      texts.nothing,
      texts.nothingButton,
      texts.star,
    ];
  };

  it("says everything in Russian in Cyrillic, Tapsi's name too", () => {
    for (const line of linesIn("ru")) expect(line, line).not.toMatch(/[A-Za-zÄÖÜäöüß]/);
  });

  it("says everything in en, zh, hi, es and ar, Chinese, Hindi and Arabic without Latin letters, Tapsi's name too", () => {
    const scripts = { zh: /\p{Script=Han}/u, hi: /\p{Script=Devanagari}/u, ar: /\p{Script=Arabic}/u };
    for (const id of ["en", "zh", "hi", "es", "ar"] as const) {
      const texts = POTTY_TEXTS[id];
      // A translated line belongs to a thought (new ones wait in German, see sayScene), and no line is left without words.
      for (const scene of Object.keys(texts?.scenes ?? {}))
        expect(
          WAIT_SCENES.map((s) => s.id),
          id,
        ).toContain(scene);
      for (const line of linesIn(id)) {
        expect(line.trim(), id).not.toBe("");
        if (id in scripts) {
          expect(line, `${id}: ${line}`).not.toMatch(/[A-Za-zÄÖÜäöüß]/);
          expect(line, `${id}: ${line}`).toMatch(scripts[id as keyof typeof scripts]);
        }
      }
    }
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
    // The potty in Tapsi's speech bubble while it calls, cut out of the bathroom picture.
    expect(files).toContain(`${CALL_PICTURE}.webp`);
    // Only Tapsi goes to the potty: pictures of other animals would only be downloaded for nothing.
    expect(files.filter((f) => !f.startsWith(`${TAPSI.pictures}-`))).toEqual([]);
    // A thought taken out of the bubble takes its pictures with it (the user removed seven, November 2026).
    const thinking = new Set(WAIT_SCENES.map((s) => `${TAPSI.pictures}-${scenePicture(s)}`));
    expect(files.filter((f) => f.includes("-denken-") && !thinking.has(f.replace(/(-b)?\.webp$/, "")))).toEqual([]);
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

  it("lets the waiting song play alone while sitting: no line and no sound with the thoughts, none as sitting begins", () => {
    // The user wants to listen to the song: a voice or sound over it (even with the song hushed) is in the way.
    const play = readFileSync("src/games/potty/PottyPlay.tsx", "utf8");
    const nextScene = play.match(/const nextScene = \(\) => \{([\s\S]*?)\n {2}\};/)?.[1];
    expect(nextScene).toBeDefined();
    expect(nextScene).not.toMatch(/\bsay\(|\bplay[A-Z]\w*\(|\bsound\(/);
    // No thought's line nor what the ✓ is for is said anywhere: both were said over the song.
    expect(play).not.toMatch(/texts\.(scenes|finish)\b/);
    // Sitting down hushes what is still said and says nothing of its own.
    expect(play).toMatch(/if \(id === "sit"\) hush\(\);\n\s*else /);
    const sitCase = play.match(/case "sit":([\s\S]*?)(case|default)/)?.[1] ?? "";
    expect(sitCase).not.toMatch(/sound\(|say\(/);
  });

  it("keeps the thought bubble's stand-ins for pipi and kaka out of the waiting song", () => {
    // Every block of lyrics in the Suno sheet; the song is about the waiting, the bubble shows the rest.
    const sheet = readFileSync("src/games/potty/musik/suno-lied.md", "utf8");
    const lyrics = [...sheet.matchAll(/Lyrics:\s*```text\n([\s\S]*?)```/g)].map((m) => m[1].toLowerCase());
    expect(lyrics.length).toBeGreaterThan(0);
    const banned = ["regen", "wasser", "brunnen", "gieß", "schlauch", "ballon", "ketchup", "huhn", "ei!", "knete", "drück", "plitsch", "platsch", "plopp"];
    // The same in Russian (whole stems: „дожд“ alone is in „подождём“): water, rain, fountain, watering can, hose, balloon, ketchup, hen, egg, play dough, pushing, splashing.
    banned.push(
      "вода",
      "воду",
      "водичк",
      "дождь",
      "дождик",
      "дожди",
      "фонтан",
      "лейк",
      "шланг",
      "шарик",
      "кетчуп",
      "куриц",
      "яйц",
      "пластилин",
      "туж",
      "плюх",
      "буль",
      "кап-",
    );
    // And in English (" hen" and " hose" with the space, since „then“ and „those“ hold them): water, rain, fountain,
    // hose, balloon, ketchup, hen, egg, play dough, pushing, splashing.
    banned.push("water", " rain", "fountain", " hose", "balloon", "ketchup", " hen", "chicken", " egg", "dough", "push", "squeez", "splash", "drip");
    // And in Spanish: water, rain, fountain, watering can, hose, balloon, ketchup, hen, egg, play dough, pushing, splashing, drops.
    banned.push(
      "agua",
      "lluvi",
      "fuente",
      "regadera",
      "manguera",
      "globo",
      "kétchup",
      "gallina",
      "huevo",
      "plastilina",
      "empuj",
      "apriet",
      "puj",
      "chapot",
      "salpic",
      "gota",
    );
    // And in Chinese, Hindi and Arabic: water, rain, fountain, watering, hose, balloon, ketchup, hen, egg, play dough,
    // pushing, squeezing, splashing, drops.
    banned.push("水", "雨", "喷泉", "浇", "气球", "番茄酱", "鸡", "蛋", "橡皮泥", "用力", "挤");
    banned.push("पानी", "बारिश", "फव्वारा", "फ़व्वारा", "पाइप", "गुब्बारा", "केचप", "मुर्गी", "अंड", "ज़ोर", "जोर", "छपाक", "बूँद");
    banned.push("ماء", "مطر", "نافورة", "خرطوم", "بالون", "كاتشب", "دجاج", "بيض", "صلصال", "ضغط", "اضغط", "رذاذ", "قطرة");
    for (const text of lyrics) expect(banned.filter((word) => text.includes(word))).toEqual([]);
  });

  it("ends a video's waiting only at the end of a whole pass of the song, never inside a verse (Y-21, Y-22)", () => {
    const part = { loopStart: 0.4, loopEnd: 100.4 };
    expect(passesEndMs(0.4, part, 1)).toBeCloseTo(100_000);
    expect(passesEndMs(0.4, part, 3)).toBeCloseTo(300_000);
    // Going on after a pause in the middle of a pass ends at that pass's end, then whole passes.
    expect(passesEndMs(60.4, part, 2)).toBeCloseTo(140_000);
    // Every sung language knows its pass, so the video page can say how long Tapsi sits.
    for (const language of ["de", "en", "zh", "hi", "es", "ar", "ru"]) expect(waitLoopSeconds(language)).toBeGreaterThan(60);
  });

  it("shows nothing but the picture in a video: no row of steps, buttons, stars or GameEnd", () => {
    const play = readFileSync(new URL("./PottyPlay.tsx", import.meta.url), "utf8");
    expect(play).toMatch(/\{!video && \(\s*<div className="pt-bottom">/);
    // The parents' video (`demo`) shows no GameEnd either.
    expect(play).toMatch(/\{last && !video(?: && !demo)? && <GameEnd/);
    expect(play).toContain("if (video) return;");
  });
});

describe("Symbols of the strips (Aufs Töpfchen, Zähne putzen)", () => {
  const queued = new Set(SYMBOL_PICTURE_QUEUE.map((picture) => picture.file));
  const has = (file: string) => existsSync(file) || queued.has(file);

  it("every symbol of the potty's strip has its picture or waits for it in the queue", () => {
    for (const name of Object.keys(SYMBOL_EMOJI)) expect(has(`src/games/potty/bilder/symbole/${name}.webp`), name).toBe(true);
  });

  it("every picture of the teeth's bar has its picture or waits for it in the queue", () => {
    for (const name of ["bonbon", "zahnbuerste", "zahn"]) expect(has(`src/games/teeth/bilder/symbole/${name}.webp`), name).toBe(true);
  });

  it("every step of the story shows a symbol there is", () => {
    for (const step of [...STEPS, ...NOTHING_STEPS]) {
      for (const name of symbolsFor(step, "both")) expect(name in SYMBOL_EMOJI, `${step.id}: ${name}`).toBe(true);
    }
  });
});
