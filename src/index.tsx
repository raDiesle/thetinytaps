import "@fontsource-variable/fredoka";
import "./globals.css";
import { loadAppLanguage } from "./lib/language";
import { setUpPwa } from "./lib/pwa";

// The start of the page. The app's code (src/main.tsx) runs only once the app language's texts are loaded:
// the texts written inline in it are made in that language as its modules run (src/content/texts), and so is
// everything else, which never switches language later. Only this file and what it imports run before.

setUpPwa();
await loadAppLanguage();
await import("./main");
