import { expect, test } from "bun:test";
import { FALL, LEAN, SPIT_CUES, SPIT_MS } from "./spit";

// Idea X-18: after the cheer the child spits the foam into the basin – only spits, never rinses its mouth with a cup of
// water – in two bars with a soft „ptü“, as still pictures with moving HTML layers like the rest of the game.

const css = await Bun.file("src/games/teeth/teeth.css").text();
const spit = await Bun.file("src/games/teeth/spit.tsx").text();
const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();
const BEAT_MS = 60_000 / 112;
const keyframes = (name: string) => css.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";

test("the spitting lasts two bars, and its „ptü“ falls on a beat as the dab leaves the lips", () => {
  expect(Math.abs(SPIT_MS - 8 * BEAT_MS)).toBeLessThan(5);
  expect(SPIT_CUES).toHaveLength(1);
  const at = SPIT_CUES[0].at;
  expect(Math.abs(at / BEAT_MS - Math.round(at / BEAT_MS))).toBeLessThan(0.01);
  // The dab leaves the lips at the keyframe that matches the cue.
  const share = `${Math.round((at / SPIT_MS) * 1000) / 10}%`;
  expect(keyframes("teeth-spit-blob")).toContain(`${share} {`);
  // Every one of its animations lasts as long as the part, so the clock and the picture agree after a jump.
  for (const rule of css.matchAll(/animation: (teeth-spit-[a-z-]+) ([\d.]+)s/g))
    expect({ rule: rule[1], s: Number(rule[2]) }).toEqual({ rule: rule[1], s: SPIT_MS / 1000 });
});

test("the child leans and the dab drops as far as the picture says, moved only by transform and opacity", () => {
  expect(keyframes("teeth-spit-lean")).toContain(`translateY(${LEAN}px)`);
  expect(keyframes("teeth-spit-blob")).toContain(`translateY(${FALL}px)`);
  for (const name of css.matchAll(/@keyframes (teeth-spit-[a-z-]+)/g)) {
    const body = keyframes(name[1]);
    expect({ name: name[1], other: body.replace(/(transform|opacity|animation-timing-function):[^;]*;/g, "").match(/[a-z-]+:/g) }).toEqual({
      name: name[1],
      other: null,
    });
  }
  // What moves is an HTML layer of its own (`Piece`), never something inside an svg.
  for (const layer of ["spit-child", "spit-smile", "spit-lip-foam", "spit-pucker", "spit-blob"])
    expect(spit).toMatch(new RegExp(`<Piece[^>]*className="${layer}"`));
});

test("it comes between the cheer and rinsing the brush, with no words on the picture", () => {
  expect(play).toMatch(/const TIDY_FROM = CHEER_MS \+ SPIT_MS;/);
  expect(play).toMatch(/after < CHEER_MS \? "cheer" : after < TIDY_FROM \? "spit"/);
  expect(spit).not.toMatch(/<text\b/);
});
