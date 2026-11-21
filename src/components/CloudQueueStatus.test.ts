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

  // User request, 21 November 2026: voices, sounds and pictures are one short line each in the status, folded open to
  // their whole lists there – no section of their own further down the page any more.
  it("holds each queue folded, and the page no second section for them", () => {
    const status = readFileSync(new URL("./CloudQueueStatus.tsx", import.meta.url), "utf8");
    for (const id of ["stimmen", "geraeusche", "offene-bilder"]) expect(status).toContain(`id="${id}"`);
    expect(status).toMatch(/<details id=\{id\}/);
    expect(status).not.toMatch(/<details[^>]*\bopen\b(?!=)/);
    const page = readFileSync(new URL("../pages/ManagementPage.tsx", import.meta.url), "utf8");
    for (const part of ["<PictureQueue", "<VoiceQueue", "<VoiceList", "<SoundQueue", 'id="stimmen"', 'id: "offene-bilder"', 'id: "stimmen"'])
      expect(page).not.toContain(part);
  });
});
