import { expect, test } from "bun:test";
import { CARDS } from "./cards";

test("the start screen shows the cards in play order, so „Weiter“ goes on to the card beside it", async () => {
  // The modes are written out in the JSX of the start screen; their ids there must run as `CARDS` does.
  const source = await Bun.file(new URL("./ElevatorGame.tsx", import.meta.url)).text();
  const ids = [...source.matchAll(/\{ id: "([a-z]+)", emoji:/g)].map((m) => m[1]);
  expect(ids).toEqual(CARDS.map((card) => card.id));
});
