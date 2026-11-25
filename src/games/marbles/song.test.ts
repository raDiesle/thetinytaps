import { expect, test } from "bun:test";
import { APP_LANGUAGES } from "@/lib/language";
import { SONG_BEATS, SONGS, songBeat, songFor } from "./song";
import { BAR_STEP, BARS, buildRoutes, ROW1A, ROW1B, SONG_BARS, SONG_SPEED } from "./track";
import { STRETCHES } from "./trackStretches";

// „Kugel-Lied“ (K-11): each thing over row 1 plays the next line of a song, one beat per bar.

test("row 1 has a bar for every beat of a line, and every line starts on a note", () => {
  expect(BARS.filter((bar) => bar.row === ROW1A || bar.row === ROW1B)).toHaveLength(SONG_BARS);
  expect(SONG_BEATS).toBe(SONG_BARS);
  BARS.slice(0, SONG_BARS).forEach((bar) => expect(bar.row === ROW1A || bar.row === ROW1B).toBe(true));
  for (const song of SONGS) {
    expect(song.lines.length, song.name).toBeGreaterThanOrEqual(4);
    for (const line of song.lines) {
      expect(line, song.name).toHaveLength(SONG_BEATS);
      expect(line[0], song.name).not.toBeNull();
    }
  }
});

test("German children hear „Alle meine Entchen“, every other app language „Twinkle, Twinkle“", () => {
  expect(songFor("de").name).toBe("Alle meine Entchen");
  for (const language of APP_LANGUAGES.filter((l) => l !== "de")) expect(songFor(language).name).toBe("Twinkle, Twinkle, Little Star");
});

test("a note rings on through the held beats after it, and a held beat strikes nothing", () => {
  const line = songFor("de").lines[0];
  expect(songBeat(line, 0)).toEqual({ freq: line[0] as number, beats: 1 });
  expect(songBeat(line, 4)).toEqual({ freq: line[4] as number, beats: 2 });
  expect(songBeat(line, 5)).toBeNull();
  expect(songBeat(line, 6)?.beats).toBe(2);
});

test("over the song's bars a thing rolls at the even speed, so each half line keeps a steady beat", () => {
  const routes = buildRoutes(STRETCHES.wood);
  const songBars = (route: { events: { s: number; event: { kind: string } }[]; zones: { s0: number; s1: number; speed?: number }[] }) =>
    route.events.filter((e) => e.event.kind === "note");
  const halves = routes.sections.flatMap((sec) => (sec.kind === "fixed" && songBars(sec.route).length ? [sec.route] : [])).slice(0, 2);
  expect(halves).toHaveLength(2);
  for (const route of halves) {
    const notes = songBars(route);
    expect(notes).toHaveLength(4);
    notes.slice(1).forEach((note, i) => expect(note.s - notes[i].s).toBeCloseTo(BAR_STEP * Math.hypot(1, 0.05), -1));
    // From its first bar to the row's end the thing rolls at the song's speed.
    for (const note of notes) expect(route.zones.find((z) => note.s >= z.s0 && note.s < z.s1)?.speed).toBe(SONG_SPEED);
  }
  // About a quarter of a second a beat: slow enough to hear the tune, quick enough to keep rolling.
  expect(BAR_STEP / SONG_SPEED).toBeGreaterThan(0.2);
  expect(BAR_STEP / SONG_SPEED).toBeLessThan(0.35);
});
