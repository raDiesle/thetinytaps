import { describe, expect, test } from "bun:test";
import { allPictures, type GalleryPicture, PICTURE_SOURCES, setsOf, shelvesOf, storiesOf } from "./pictureGallery";

const picture = (stem: string): GalleryPicture => ({ path: `src/games/x/bilder/${stem}.webp`, url: stem, source: "x", kind: "bilder", stem });

describe("the page of all pictures (/management/bilder/)", () => {
  // Every picture file of the app is on it, so nothing has to be looked for by playing.
  test("finds every picture file below src", () => {
    const files = [...new Bun.Glob("**/*.{webp,png,jpg,jpeg,gif}").scanSync({ cwd: "src" })].map((file) => `src/${file}`).sort();
    expect(allPictures().map((p) => p.path)).toEqual(files);
  });

  test("names every folder with pictures", () => {
    for (const { source } of allPictures()) expect(PICTURE_SOURCES[source], source).toBeDefined();
  });

  test("joins frames and variants with their first picture", () => {
    const sets = setsOf(["angry-1", "angry-1-b", "angry-2", "aufgabe-bett", "aufgabe-bett-linie", "ball", "ball-grund", "ball-anders", "nein-b"].map(picture));
    expect(sets.map((s) => [s.base, s.members.map((m) => m.role)])).toEqual([
      ["angry-1", ["", "2. Frame"]],
      ["angry-2", [""]],
      ["aufgabe-bett", ["", "Linie zum Ausmalen"]],
      ["ball", ["", "Was nicht passiert ist", "Was passiert ist"]],
      // No „nein“ to fade over: a picture of its own.
      ["nein-b", [""]],
    ]);
  });

  test("takes numbered pictures as before and after only where the game paints them so", () => {
    const pictures = ["koch-1", "koch-2", "angry-1"].map(picture);
    expect(setsOf(pictures, true).map((s) => [s.base, s.members.map((m) => m.role)])).toEqual([
      ["koch", ["Vorher", "Nachher"]],
      ["angry-1", [""]],
    ]);
    expect(setsOf(pictures).map((s) => s.base)).toEqual(["koch-1", "koch-2", "angry-1"]);
  });

  test("groups sets by story, past a word all of them share", () => {
    const stories = storiesOf(setsOf(["kette-abend-ab", "kette-abend-buch", "kette-auch", "kette-tag-ab", "kette-tag-dose"].map(picture)));
    expect(stories.map((s) => [s.key, s.sets.map((set) => set.base)])).toEqual([
      ["abend", ["kette-abend-ab", "kette-abend-buch"]],
      ["tag", ["kette-tag-ab", "kette-tag-dose"]],
      ["", ["kette-auch"]],
    ]);
  });

  test("keeps every picture exactly once", () => {
    const pictures = allPictures();
    const shown = shelvesOf(pictures).flatMap((shelf) => shelf.stories.flatMap((s) => s.sets.flatMap((set) => set.members.map((m) => m.picture.path))));
    expect(shown.sort()).toEqual(pictures.map((p) => p.path).sort());
  });
});
