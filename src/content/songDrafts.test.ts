import { expect, test } from "bun:test";
import { IDEA_AREAS } from "@/content/ideas";
import { DRAFT_LANGUAGES, lyricsOf, SONG_DRAFTS } from "./songDrafts";

const IDEAS = new Set(IDEA_AREAS.flatMap((area) => area.ideas.map((idea) => idea.id)));

test("every song draft has unique ids, real ideas and both styles", () => {
  expect(new Set(SONG_DRAFTS.map((song) => song.id)).size).toBe(SONG_DRAFTS.length);
  for (const song of SONG_DRAFTS) {
    for (const id of song.ideas) expect(IDEAS.has(id), `${song.id}: ${id}`).toBe(true);
    expect(song.styles.filter((style) => style.recommended).length, song.id).toBe(1);
    for (const style of song.styles) expect(style.style, `${song.id} ${style.label}`).toContain(`${style.bpm} BPM`);
  }
});

// A shorter timer plays the start and then the last blocks, so the minutes left must be sung five down to one, each in
// its own chorus, in every language.
test("the choruses sing the minutes left from five down to one", () => {
  for (const song of SONG_DRAFTS)
    for (const { id } of DRAFT_LANGUAGES) {
      const words = song.words[id];
      const lyrics = lyricsOf(words);
      let from = 0;
      for (const left of words.left) {
        const at = lyrics.indexOf(`[Chorus – ${left}]`, from);
        expect(at, `${song.id} ${id}: ${left}`).toBeGreaterThan(from - 1);
        expect(words.chorus(left).join(" ").toLowerCase(), `${song.id} ${id}`).toContain(left.toLowerCase());
        from = at + 1;
      }
      expect(lyrics.indexOf("[Countdown]"), `${song.id} ${id}`).toBeGreaterThan(from);
      expect(lyrics.endsWith("[End]"), `${song.id} ${id}`).toBe(true);
    }
});

// Nobody knows what lies in a child's room (user feedback, 26 November 2026): the songs sing of things and their place,
// never of kinds of toys a child may not have.
test("the songs name no kinds of toys", () => {
  const toys =
    /\b(blocks?|bricks?|lego|cars?|trucks?|balls?|books?|teddy|teddies|dolls?|puzzles?|crayons?|bausteine?|klötze|autos?|bälle|ball|bücher|buch|kuscheltier\w*|teddys?|puppen?|puzzles?|stifte?)\b/i;
  for (const song of SONG_DRAFTS) for (const { id } of DRAFT_LANGUAGES) expect(lyricsOf(song.words[id]), `${song.id} ${id}`).not.toMatch(toys);
});

// One tidying song for now, where the child tidies quickly (user decision, 26 November 2026); the calm versions are
// postponed, not turned down: they stay as drafts with the words that bring them back (H-152), and nothing calm is made.
test("only fast songs are to be made, the calm ones wait", () => {
  const made = SONG_DRAFTS.filter((song) => !song.postponed);
  expect(made.filter((song) => song.ideas.includes("H-119")).length).toBe(1);
  for (const song of made) {
    const styles = song.styles.filter((style) => !style.postponed);
    expect(styles.length, song.id).toBe(1);
    expect(styles[0].bpm, song.id).toBeGreaterThanOrEqual(120);
  }
  for (const reason of SONG_DRAFTS.flatMap((song) => [song.postponed, ...song.styles.map((style) => style.postponed)]).filter(Boolean))
    expect(reason).toContain("H-152");
});
