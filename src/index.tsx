import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { PlaytimeLock } from "./components/PlaytimeLock";
import { ScreenHint } from "./components/ScreenHint";
import { SeoHead } from "./components/SeoHead";
import { applySavedFigure } from "./lib/common";
import { loadAppLanguage } from "./lib/language";
import { downloadMusicIfOn } from "./lib/musicFile";
import { setUpPwa } from "./lib/pwa";
import "@fontsource-variable/fredoka";
import "./globals.css";
import { BASE_URL } from "@/lib/buildInfo";

setUpPwa();
downloadMusicIfOn();
applySavedFigure();

// Only the app language's texts are downloaded, and they are there before the first screen (src/content/texts).
await loadAppLanguage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={BASE_URL}>
      <App />
      <PlaytimeLock />
      <ScreenHint />
      <SeoHead />
      <BackgroundMusic />
    </BrowserRouter>
  </StrictMode>,
);
