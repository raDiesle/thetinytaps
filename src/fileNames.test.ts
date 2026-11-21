import { expect, test } from "bun:test";

// macOS (where the app is written) finds files without minding case, Linux (CI) minds it: a module
// `parentsVideo.ts` beside `ParentsVideo.tsx` made `import "./parentsVideo"` load the component here (November 2026),
// and the two would differ on CI. So no two modules of one folder may share a name apart from case and extension.
test("no two modules share a name apart from case", () => {
  const seen = new Map<string, string>();
  // Git's list, not a scan of the folders: those hold about 25,000 recordings.
  const files = Bun.spawnSync(["git", "ls-files", "--cached", "--others", "--exclude-standard", "src/*.ts", "src/*.tsx"])
    .stdout.toString()
    .split("\n")
    .filter(Boolean);
  expect(files.length).toBeGreaterThan(100);
  for (const file of files) {
    const key = file.replace(/\.tsx?$/, "").toLowerCase();
    expect(seen.get(key), `${file} and ${seen.get(key)} differ only in case`).toBeUndefined();
    seen.set(key, file);
  }
});
