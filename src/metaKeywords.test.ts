import { expect, test } from "bun:test";
import { join } from "node:path";
import { isTest, read, sourceFiles } from "@/testSources";

// No page carries <meta name="keywords">: Google ignores it and Bing takes it as a hint of spam, so the searched words
// go into title, description and text instead (CLAUDE.md, Search engines). Another product's name hidden there would
// moreover use its sign (BGH „Impuls“, study „tinyfingers-marke“ on /management/recherchen/).

const ROOT = join(import.meta.dir, "..");
/** A real tag or a meta element made in code; a comment naming `<meta name="keywords">` (seo.ts says why there is none) is no tag. */
const KEYWORDS_TAG = /<meta[^>]*name=["']keywords["'][^>]*content=|name:\s*["'`]keywords["'`]/i;

/** Every file of the app and its build, without tests (this one names the tag it looks for). */
function sources(dir: string): string[] {
  return sourceFiles(dir)
    .filter((file) => /\.(tsx?|html|js)$/.test(file) && !isTest(file))
    .map((file) => join(dir, file));
}

test("no page has a meta keywords tag", () => {
  const files = [join(ROOT, "index.html"), ...sources(join(ROOT, "src")), ...sources(join(ROOT, "tools"))];
  for (const file of files) expect(read(file).match(KEYWORDS_TAG)?.[0], file).toBeUndefined();
});
