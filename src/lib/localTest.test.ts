import { expect, test } from "bun:test";
import { canTestUnfinished } from "./localTest";

// A part still being built („in Bearbeitung“) plays only on this computer, never on the real site (user decision, November 2026).
test("unfinished parts start on localhost only", () => {
  for (const host of ["localhost", "127.0.0.1", "[::1]", "app.localhost"]) expect(canTestUnfinished(host)).toBe(true);
  for (const host of ["www.funforboth.com", "funforboth.com", "raDiesle.github.io", ""]) expect(canTestUnfinished(host)).toBe(false);
});
