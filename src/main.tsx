import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { PlaytimeLock } from "./components/PlaytimeLock";
import { ScreenHint } from "./components/ScreenHint";
import { SeoHead } from "./components/SeoHead";
import { downloadMusicIfOn } from "./lib/musicFile";
import { BASE_URL } from "@/lib/buildInfo";

// The app itself, started by src/index.tsx once the app language's texts are there.

downloadMusicIfOn();

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
