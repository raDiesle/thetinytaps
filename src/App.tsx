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
const LettersPage = page(() => import("@/pages/LettersPage"), "LettersPage");
const LoudPage = page(() => import("@/pages/LoudPage"), "LoudPage");
const ManagementPage = page(() => import("@/pages/ManagementPage"), "ManagementPage");
const MarblePage = page(() => import("@/pages/MarblePage"), "MarblePage");
const PlannerPage = page(() => import("@/pages/PlannerPage"), "PlannerPage");
const PottyPage = page(() => import("@/pages/PottyPage"), "PottyPage");
const RewardsPage = page(() => import("@/pages/RewardsPage"), "RewardsPage");
const ScenePage = page(() => import("@/pages/ScenePage"), "ScenePage");
const ScenesMenu = page(() => import("@/pages/ScenesMenu"), "ScenesMenu");
const ShadowsPage = page(() => import("@/pages/ShadowsPage"), "ShadowsPage");
const SocksPage = page(() => import("@/pages/SocksPage"), "SocksPage");
const TeethPage = page(() => import("@/pages/TeethPage"), "TeethPage");

export function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="spiele/:category" element={<CategoryPage />} />
        <Route path="buchstaben" element={<LettersPage />} />
        {/* „Wörter tippen“ had a page of its own; it is a mode of Buchstaben & Zahlen now. */}
        <Route path="woerter" element={<Navigate to="/buchstaben/" replace />} />
        <Route path="tiere" element={<AnimalsPage />} />
        <Route path="bilder" element={<ScenesMenu />} />
        <Route path="bilder/:scene" element={<ScenePage />} />
        <Route path="zaehne" element={<TeethPage />} />
        <Route path="toepfchen" element={<PottyPage />} />
        <Route path="belohnungstafel" element={<RewardsPage />} />
        <Route path="tagesplan" element={<PlannerPage />} />
        <Route path="gefuehle" element={<FeelingsPage />} />
        {/* Zu Hause and Kindergarten had pages of their own; all stories are on one start screen now. */}
        <Route path="gefuehle/:place" element={<Navigate to="/gefuehle/" replace />} />
        <Route path="schatten" element={<ShadowsPage />} />
        <Route path="socken" element={<SocksPage />} />
        <Route path="laut-leise" element={<LoudPage />} />
        <Route path="kettenreaktion" element={<MarblePage />} />
        {/* Kettenreaktion's old address, then the Klingende Kugelbahn's; the marble run is a level of Kettenreaktion now. */}
        <Route path="kugelbahn" element={<Navigate to="/kettenreaktion/" replace />} />
        <Route path="kleine-abenteuer" element={<ElevatorPage />} />
        {/* Its old name and address, for bookmarks and the home screen. */}
        <Route path="aufzug" element={<Navigate to="/kleine-abenteuer/" replace />} />
        <Route path="abenteuer" element={<AdventurePage />} />
        <Route path="management" element={<ManagementPage />} />
        {/* Its old name and address, for bookmarks. */}
        <Route path="ideen" element={<Navigate to="/management/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
