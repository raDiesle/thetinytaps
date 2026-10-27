import { expect, test } from "bun:test";
import { colourName } from "./colourParts";

test("colour questions name the paints of the pictures as a child would", () => {
  const named = (colours: string[]) => colours.map(colourName);
  expect(named(["#e63946", "#e03131", "#c1121f", "#ff6b6b", "rgb(230, 57, 70)"])).toEqual(["red", "red", "red", "red", "red"]);
  expect(named(["#ffd60a", "#ffd43b", "#ffd166", "#fab005", "#ffe066"])).toEqual(["yellow", "yellow", "yellow", "yellow", "yellow"]);
  expect(named(["#52b788", "#40c057", "#69db7c", "#40916c"])).toEqual(["green", "green", "green", "green"]);
  expect(named(["#4dabf7", "#3a86ff", "#74c0fc", "#1d3557"])).toEqual(["blue", "blue", "blue", "blue"]);
  // Pink, orange, brown, sand, grey, the pale blue of windows and see-through paint are none of them.
  const none = ["#ff8fa3", "#f783ac", "#ff922b", "#f77f00", "#7f5539", "#e9c46a", "#adb5bd", "#2b2d42", "#d0ebff", "#a5d8ff", "rgba(230, 57, 70, 0.2)", "none"];
  expect(named(none)).toEqual(none.map(() => undefined));
});
