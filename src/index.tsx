import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { ScreenHint } from "./components/ScreenHint";
import { SeoHead } from "./components/SeoHead";
import { downloadMusicIfOn } from "./lib/musicFile";
import { setUpPwa } from "./lib/pwa";
import "@fontsource-variable/fredoka";
import "./globals.css";

setUpPwa();
downloadMusicIfOn();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
      <ScreenHint />
      <SeoHead />
      <BackgroundMusic />
    </BrowserRouter>
  </StrictMode>,
);
