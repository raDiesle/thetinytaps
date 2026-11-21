import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

// The management page starts with whether anything paid is open for Claude Cloud (user request, 21 November 2026):
// the status stands right under the title and build date, before the table of contents and every other panel.
describe("Claude Cloud status on /management/", () => {
  it("comes first, before the contents", () => {
    const page = readFileSync(new URL("../pages/ManagementPage.tsx", import.meta.url), "utf8");
    const status = page.indexOf("<CloudQueueStatus />");
    expect(status).toBeGreaterThan(page.indexOf('className="ideas-build"'));
    expect(status).toBeLessThan(page.indexOf("<Contents"));
    expect(status).toBeLessThan(page.indexOf("<NextPanel"));
  });
});
