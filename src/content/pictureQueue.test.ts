import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { PICTURE_QUEUE, type QueuedPicture } from "./pictureQueue";
import { BOOK_STYLE, CUTOUT_STYLE, jobOf, PICTURE_1K, planQueue } from "./pictureQueuePlan";

const picture = (id: string, more: Partial<QueuedPicture> = {}): QueuedPicture => ({
  id,
  file: `src/games/x/bilder/${id}.webp`,
  use: id,
  prompt: `A ${id}`,
  aspect: "1:1",
  size: "512",
  transparent: true,
  date: "2026-11-02",
  ...more,
});

describe("picture queue", () => {
  test("ids and files are unique", () => {
    expect(new Set(PICTURE_QUEUE.map((p) => p.id)).size).toBe(PICTURE_QUEUE.length);
    expect(new Set(PICTURE_QUEUE.map((p) => p.file)).size).toBe(PICTURE_QUEUE.length);
  });

  // The management page shows every queued picture as still to make, so a made one must leave the queue.
  test("a queued picture is not made yet", () => {
    for (const p of PICTURE_QUEUE) expect(existsSync(p.file), `${p.id}: ${p.file} exists – take it out of the queue`).toBe(false);
  });

  test("options are ones `bun run image` takes", () => {
    for (const p of PICTURE_QUEUE) {
      expect(p.file, p.id).toMatch(/\.(webp|png|jpe?g)$/);
      expect(p.date, p.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (p.aspect) expect(Object.keys(PICTURE_1K), p.id).toContain(p.aspect);
      if (p.size) expect(p.size, p.id).toMatch(/^\d+(x\d+)?$/);
      if (p.key) expect(p.key, p.id).toMatch(/^[0-9a-f]{6}$/i);
      for (const ref of p.ref ?? []) expect(existsSync(ref) || PICTURE_QUEUE.some((q) => q.file === ref), `${p.id}: --ref ${ref}`).toBe(true);
    }
  });
});

describe("queue plan", () => {
  test("four small pictures alike share one sheet, made now", () => {
    const plan = planQueue(["a", "b", "c", "d"].map((id) => picture(id)));
    expect(plan.now).toHaveLength(1);
    expect(plan.now[0].grid).toBe("2x2");
    expect(plan.waiting).toHaveLength(0);
  });

  test("what doesn't fill a sheet waits, the full part goes now", () => {
    const plan = planQueue(["a", "b", "c", "d", "e"].map((id) => picture(id)));
    expect(plan.now.map((s) => s.pictures.length)).toEqual([4]);
    expect(plan.waiting).toEqual([expect.objectContaining({ grid: "2x2", missing: 3 })]);
  });

  test("a picture too big for a sheet, or one drawn alone, goes now", () => {
    const big = picture("card", { aspect: "4:3", size: "1200x900", transparent: false });
    const frame = picture("frame", { alone: "second frame" });
    const plan = planQueue([big, frame]);
    expect(plan.now.map((s) => [s.grid, s.pictures[0].id])).toEqual([
      [undefined, "card"],
      [undefined, "frame"],
    ]);
  });

  test("pictures that differ in style, size or references never share a sheet", () => {
    const plan = planQueue([picture("a"), picture("b", { size: "400" }), picture("c", { ref: ["r.webp"] }), picture("d", { transparent: false })]);
    expect(plan.waiting).toHaveLength(4);
  });

  test("forced, a short sheet comes now with variants in its spare panels", () => {
    const plan = planQueue([picture("a"), picture("b"), picture("c")], ["b"]);
    expect(plan.waiting).toHaveLength(0);
    const job = jobOf(plan.now[0]);
    expect(job.grid).toBe("2x2");
    expect(job.out).toEqual(["a", "b", "c"].map((id) => `src/games/x/bilder/${id}.webp`).concat(".image-raw/variants/a-2.webp"));
    expect(job.panels).toHaveLength(4);
  });

  test("forced alone, a picture gets the whole request", () => {
    const job = jobOf(planQueue([picture("a")], "all").now[0]);
    expect(job.grid).toBeUndefined();
    expect(job.prompt).toEndWith("A a");
  });

  test("a picture waits for its reference still in the queue", () => {
    const first = picture("first", { transparent: false, size: undefined });
    const plan = planQueue([first, picture("second", { ref: [first.file] })]);
    expect(plan.blocked.map((b) => b.picture.id)).toEqual(["second"]);
    expect(jobOf(plan.now[0]).prompt.startsWith(BOOK_STYLE)).toBe(true);
  });
});

// The skill /bild-erzeugen shows the style block to write by hand; the queue adds BOOK_STYLE itself. Both must say the same.
test("the skill's style block is the queue's", () => {
  const skill = readFileSync(".claude/skills/bild-erzeugen/SKILL.md", "utf8");
  const block = /## Style[\s\S]*?```\n([\s\S]*?)```/.exec(skill)?.[1] ?? "";
  expect(block.replace(/\s+/g, " ").trim()).toBe(BOOK_STYLE);
});

// Every fox and bear wears clothes (user feedback, November 2026): both style blocks say so, so no picture forgets it.
test("both style blocks dress the fox and the bear", () => {
  for (const style of [BOOK_STYLE, CUTOUT_STYLE]) expect(style).toContain("Every fox and bear wears clothes.");
});

// The user only wants to know how many pictures wait, never to read and approve prompts there (November 2026).
test("the management page shows how many pictures wait, and no prompts to review", () => {
  const page = readFileSync("src/pages/ManagementPage.tsx", "utf8");
  const queue = readFileSync("src/components/PictureQueue.tsx", "utf8");
  expect(page).toContain("<PictureQueue />");
  expect(queue).toMatch(/<h2>[\s\S]*?PICTURE_QUEUE\.length[\s\S]*?<\/h2>/);
  for (const source of [page, queue]) {
    expect(source).not.toMatch(/picturePrompts|PICTURE_PROMPTS|Bildvorschl/);
  }
});
