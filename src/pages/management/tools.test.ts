import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { NO_INDEX_PATHS } from "@/content/seo";
import { TOOL_GROUPS } from "./tools";

// Every page of its own under /management/ is found from the management page's contents (user request, November 2026:
// everything should be easy to find), and stays out of search results.
test("every page under /management/ is in the management page's contents", () => {
  const app = readFileSync(new URL("../../App.tsx", import.meta.url), "utf8");
  const routes = [...app.matchAll(/path="(management\/[^"]+)"/g)].map((m) => `/${m[1]}/`);
  expect(routes.length).toBeGreaterThan(3);
  const listed = TOOL_GROUPS.flatMap((group) => group.pages.map((page) => page.to));
  for (const route of routes) {
    expect(listed, route).toContain(route);
    expect(NO_INDEX_PATHS, route).toContain(route);
  }
});
