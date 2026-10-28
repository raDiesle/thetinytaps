import { plugin } from "bun";
import { appPlugin } from "../tools/appPlugin";

// Loaded before every `bun test` (bunfig.toml): the app's own imports (`…?glob` for sounds, songs,
// pictures and voice lines) work in the tests as in the build. src/lib/buildInfo.ts stays as written.
plugin(appPlugin());

// The app downloads only the texts of the language it plays in (src/content/texts); the tests check every language.
const { loadTexts, TEXTS_LANGUAGES } = await import("./content/texts");
await Promise.all(TEXTS_LANGUAGES.map(loadTexts));
