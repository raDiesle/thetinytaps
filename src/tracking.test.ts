import { expect, test } from "bun:test";
import { join } from "node:path";
import { isTest, read, sourceFiles } from "@/testSources";

// Toddlers play here, so visits are counted only by Cloudflare Web Analytics and Umami Cloud, which set no cookies
// and need no consent banner (user decisions, October and November 2026: no Google Analytics, not even in its consent
// mode). This fails when a tracker that sets cookies or follows people across sites is added to the page, the build or the app.

const ROOT = join(import.meta.dir, "..");
const TRACKERS = /googletagmanager|google-analytics|gtag\(|\bfbq\(|connect\.facebook|hotjar|clarity\.ms|segment\.(io|com)|mixpanel|amplitude/i;

/** Every file of the app and its build, without tests (this one names the trackers it looks for). */
function sources(dir: string): string[] {
  return sourceFiles(dir)
    .filter((file) => /\.(tsx?|html|js)$/.test(file) && !isTest(file))
    .map((file) => join(dir, file));
}

test("no tracker but Cloudflare Web Analytics and Umami", () => {
  const files = [join(ROOT, "index.html"), ...sources(join(ROOT, "src")), ...sources(join(ROOT, "tools"))];
  for (const file of files) expect(read(file).match(TRACKERS)?.[0], file).toBeUndefined();
});

// The Datenschutzerklärung (src/pages/LegalPage.tsx) must say what the site really does: each thing the app or the
// build uses that sends or reads something about the visitor has to be named there.
test("the Datenschutzerklärung names what the site uses", () => {
  const privacy = read(join(ROOT, "src/pages/LegalPage.tsx"));
  const code = [join(ROOT, "index.html"), ...sources(join(ROOT, "src")), ...sources(join(ROOT, "tools"))]
    .filter((file) => !file.endsWith("LegalPage.tsx"))
    .map((file) => read(file))
    .join("\n");
  const uses: [RegExp, string][] = [
    [/cloudflareinsights/, "Cloudflare Web Analytics"],
    [/cloud\.umami\.is/, "Umami"],
    [/getUserMedia\(\{[^}]*audio/, "Mikrofon"],
    [/getUserMedia\(\{[^}]*video|capture=/, "Kamera"],
    [/geolocation\./, "Standort"],
    [/speechSynthesis/, "Sprachausgabe"],
    [/localStorage/, "Local Storage"],
    [/serviceWorker/, "Service Worker"],
  ];
  for (const [use, named] of uses) if (use.test(code)) expect(privacy, `${use} is used, so the Datenschutzerklärung names „${named}“`).toContain(named);
});
