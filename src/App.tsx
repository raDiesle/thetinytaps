import { lazy, Suspense, type ComponentType } from "react";
import { Navigate, Route, Routes } from "react-router";
import { CategoryPage } from "@/pages/CategoryPage";
import { Home } from "@/pages/Home";

/**
 * A page loaded only when it is opened, so the first visit doesn't download every
 * game (three.js, all pictures). Offline the service worker has them all anyway.
 */
function page<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(() => load().then((module) => ({ default: module[name] })));
}

const AdventurePage = page(() => import("@/pages/AdventurePage"), "AdventurePage");
const AnimalsPage = page(() => import("@/pages/AnimalsPage"), "AnimalsPage");
const ElevatorPage = page(() => import("@/pages/ElevatorPage"), "ElevatorPage");
const FeelingsPage = page(() => import("@/pages/FeelingsPage"), "FeelingsPage");
const IdeasPage = page(() => import("@/pages/IdeasPage"), "IdeasPage");
const LettersPage = page(() => import("@/pages/LettersPage"), "LettersPage");
const LoudPage = page(() => import("@/pages/LoudPage"), "LoudPage");
const MarblePage = page(() => import("@/pages/MarblePage"), "MarblePage");
const MarbleRunPage = page(() => import("@/pages/MarbleRunPage"), "MarbleRunPage");
const ScenePage = page(() => import("@/pages/ScenePage"), "ScenePage");
const ScenesMenu = page(() => import("@/pages/ScenesMenu"), "ScenesMenu");
const ShadowsPage = page(() => import("@/pages/ShadowsPage"), "ShadowsPage");
const TeethPage = page(() => import("@/pages/TeethPage"), "TeethPage");
const WordsPage = page(() => import("@/pages/WordsPage"), "WordsPage");

export function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="spiele/:category" element={<CategoryPage />} />
        <Route path="buchstaben" element={<LettersPage />} />
        <Route path="woerter" element={<WordsPage />} />
        <Route path="tiere" element={<AnimalsPage />} />
        <Route path="bilder" element={<ScenesMenu />} />
        <Route path="bilder/:scene" element={<ScenePage />} />
        <Route path="zaehne" element={<TeethPage />} />
        <Route path="gefuehle" element={<FeelingsPage />} />
        <Route path="schatten" element={<ShadowsPage />} />
        <Route path="laut-leise" element={<LoudPage />} />
        <Route path="kettenreaktion" element={<MarblePage />} />
        {/* Kettenreaktion's old address; the marble run is a game of its own there now. */}
        <Route path="kugelbahn" element={<MarbleRunPage />} />
        <Route path="kleine-abenteuer" element={<ElevatorPage />} />
        {/* Its old name and address, for bookmarks and the home screen. */}
        <Route path="aufzug" element={<Navigate to="/kleine-abenteuer/" replace />} />
        <Route path="abenteuer" element={<AdventurePage />} />
        <Route path="ideen" element={<IdeasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
