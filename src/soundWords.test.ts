import { expect, test } from "bun:test";
import { join } from "node:path";

// Games show nothing to read: a sound or a call is heard, never written into the picture („Muh!“, „Krah!“,
// „Danke!“). Floating notes stay music signs (♪ ♫); signs that belong to the drawn world (FEUERWEHR, TAXI) may stay.

const GAMES = join(import.meta.dir, "games");

/** Every drawing's floating words (`texts={["Hui!"]}`) and every svg `<text>` that is a call ending in „!“. */
async function soundWords() {
  const found: string[] = [];
  for (const file of new Bun.Glob("**/*.tsx").scanSync({ cwd: GAMES })) {
    const code = await Bun.file(join(GAMES, file)).text();
    for (const [, list] of code.matchAll(/texts=\{\[([^\]]*)\]\}/g)) if (/\p{L}/u.test(list)) found.push(`${file}: ${list}`);
    for (const [, inner] of code.matchAll(/<text\b[^>]*>([^<{]*)<\/text>/g)) if (/\p{L}[^!]*!/u.test(inner)) found.push(`${file}: ${inner.trim()}`);
  }
  return found;
}

test("no sound or call is written into a picture", async () => {
  expect(await soundWords()).toEqual([]);
});
