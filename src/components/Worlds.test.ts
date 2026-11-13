import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WorldGround } from "./Worlds";

// Behind the menu's cards Lebendige Welten shows only its meadow's hills: the barn, fence and trees there were clutter
// (user feedback, November 2026).
test("Lebendige Welten's menus draw no farm on the meadow", () => {
  expect(renderToStaticMarkup(createElement(WorldGround, { world: "lebendige-welten" }))).toBe("");
});
