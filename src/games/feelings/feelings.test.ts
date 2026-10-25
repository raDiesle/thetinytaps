import { expect, test } from "@rstest/core";
import { COMFORTS, FEELINGS } from "./bear";
import { bearImages, imageFor, moodImages, storyImages } from "./images";
import { SITUATIONS } from "./kita";
import { MOOD_ID, WEATHERS } from "./mood";
import { STORIES } from "./stories";

// Every picture the game asks for is in bilder/; a missing one shows an empty card.

test("every kindergarten story has its pictures", () => {
  for (const { id, steps } of SITUATIONS) {
    const names = [storyImages.problem(id), storyImages.end(id), ...steps.flatMap((_, i) => [storyImages.step(id, i), storyImages.instead(id, i)])];
    for (const name of names) expect(imageFor(name), name).toBeDefined();
  }
});

test("the bear has a picture for every feeling and every comfort", () => {
  for (const { id } of FEELINGS) {
    expect(imageFor(bearImages.feeling(id)), bearImages.feeling(id)).toBeDefined();
    expect(imageFor(bearImages.happy(id)), bearImages.happy(id)).toBeDefined();
    expect(imageFor(bearImages.instead(id)), bearImages.instead(id)).toBeDefined();
  }
  for (const id of Object.keys(COMFORTS)) expect(imageFor(bearImages.comfort(id)), bearImages.comfort(id)).toBeDefined();
});

test("every story on the start screen has its own id", () => {
  const ids = STORIES.map((s) => s.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).not.toContain("all");
  expect(ids).not.toContain(MOOD_ID);
});

test("every weather has its card and leads to a feeling of the bear", () => {
  for (const { id, feeling } of WEATHERS) {
    expect(imageFor(moodImages.weather(id)), moodImages.weather(id)).toBeDefined();
    expect(FEELINGS.map((f) => f.id)).toContain(feeling);
  }
});
