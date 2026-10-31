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
import { applyLook } from "./lib/look";
import { routerBase } from "./lib/pageAddress";
import { downloadMusicIfOn } from "./lib/musicFile";
import { setUpPwa } from "./lib/pwa";
import "./globals.css";

setUpPwa();
downloadMusicIfOn();
applySavedFigure();
applyLook();

// Only the app language's texts are downloaded, and they are there before the first screen (src/content/texts).
await loadAppLanguage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={routerBase()}>
      <App />
      <PlaytimeLock />
      <ScreenHint />
      <SeoHead />
      <BackgroundMusic />
    </BrowserRouter>
  </StrictMode>,
);
