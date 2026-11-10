import { lazy, Suspense, type ComponentType } from "react";
import { Navigate, Route, Routes } from "react-router";
import { PageLoading } from "@/components/PageLoading";
import { CategoryPage } from "@/pages/CategoryPage";
import { useHistoryTrail } from "@/lib/goBack";
import { registerPage } from "@/lib/preloadPages";
import { Home } from "@/pages/Home";

/**
 * A page loaded only when it is opened, so the first visit doesn't download every
 * game (three.js, all pictures). Offline the service worker has them all anyway.
 * `paths` are the addresses it opens at, so a menu can load it before its card is tapped (`usePreloadPages`).
 */
function page<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K, ...paths: string[]) {
  registerPage(paths, load);
  return lazy(() => load().then((module) => ({ default: module[name] })));
}

const AdventurePage = page(() => import("@/pages/AdventurePage"), "AdventurePage", "/abenteuer/");
const AnimalsPage = page(() => import("@/pages/AnimalsPage"), "AnimalsPage", "/tiere/");
const ElevatorPage = page(() => import("@/pages/ElevatorPage"), "ElevatorPage", "/kleine-abenteuer/");
const FeelingsPage = page(() => import("@/pages/FeelingsPage"), "FeelingsPage", "/gefuehle/");
const LettersPage = page(() => import("@/pages/LettersPage"), "LettersPage", "/buchstaben/");
const CountingPage = page(() => import("@/pages/LettersPage"), "CountingPage", "/zaehlen/");
const MovePage = page(() => import("@/pages/LettersPage"), "MovePage", "/mitmachen/");
const WordsPage = page(() => import("@/pages/LettersPage"), "WordsPage", "/woerter/");
const ImprintPage = page(() => import("@/pages/LegalPage"), "ImprintPage");
const PrivacyPage = page(() => import("@/pages/LegalPage"), "PrivacyPage");
const ManagementPage = page(() => import("@/pages/ManagementPage"), "ManagementPage");
const MoodPage = page(() => import("@/pages/MoodPage"), "MoodPage", "/wie-gehts-dir/");
const CausePage = page(() => import("@/pages/CausePage"), "CausePage", "/was-ist-passiert/");
const MarblePage = page(() => import("@/pages/MarblePage"), "MarblePage", "/kettenreaktion/");
const PacifierStoryPage = page(() => import("@/pages/PacifierStoryPage"), "PacifierStoryPage", "/schnullerfee/");
const PottyPage = page(() => import("@/pages/PottyPage"), "PottyPage", "/toepfchen/");
const RewardsPage = page(() => import("@/pages/RewardsPage"), "RewardsPage", "/belohnungstafel/");
const PlannerPage = page(() => import("@/pages/RewardsPage"), "PlannerPage", "/tagesplan/");
const WaitPage = page(() => import("@/pages/RewardsPage"), "WaitPage", "/wie-lange-warten/");
const ScenePage = page(() => import("@/pages/ScenePage"), "ScenePage");
const ScenesMenu = page(() => import("@/pages/ScenesMenu"), "ScenesMenu", "/bilder/");
const ShadowsPage = page(() => import("@/pages/ShadowsPage"), "ShadowsPage", "/schatten/");
const SocksPage = page(() => import("@/pages/SocksPage"), "SocksPage", "/socken/");
const TeethPage = page(() => import("@/pages/TeethPage"), "TeethPage", "/zaehne/");
const TogetherPage = page(() => import("@/pages/TogetherPage"), "TogetherPage", "/zusammen/");
const TimerPage = page(() => import("@/pages/TimerPage"), "TimerPage", "/timer/");
const MilkChainPage = page(() => import("@/pages/MilkChainPage"), "MilkChainPage", "/abstillen/");

export function App() {
  // Where each way back can step back in the history (goBack.ts).
  useHistoryTrail();
  return (
    // While a page's code still loads, a sheet of paper with a paw track, never an empty screen (PageLoading).
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="spiele/:category" element={<CategoryPage />} />
        <Route path="buchstaben" element={<LettersPage />} />
        <Route path="zaehlen" element={<CountingPage />} />
        <Route path="mitmachen" element={<MovePage />} />
        <Route path="woerter" element={<WordsPage />} />
        <Route path="tiere" element={<AnimalsPage />} />
        <Route path="zusammen" element={<TogetherPage />} />
        <Route path="bilder" element={<ScenesMenu />} />
        <Route path="bilder/:scene" element={<ScenePage />} />
        <Route path="zaehne" element={<TeethPage />} />
        <Route path="toepfchen" element={<PottyPage />} />
        <Route path="abstillen" element={<MilkChainPage />} />
        <Route path="schnullerfee" element={<PacifierStoryPage />} />
        <Route path="belohnungstafel" element={<RewardsPage />} />
        {/* The Tagesplan shares the Belohnungstafel's page; its own address opens it on a plan (and keeps its search entry). */}
        <Route path="tagesplan" element={<PlannerPage />} />
        <Route path="wie-lange-warten" element={<WaitPage />} />
        <Route path="timer" element={<TimerPage />} />
        <Route path="gefuehle" element={<FeelingsPage />} />
        <Route path="wie-gehts-dir" element={<MoodPage />} />
        {/* „Was brauche ich?“ is one of the two games of „Wie geht's dir?“ now (its card on the start screen). */}
        <Route path="was-brauche-ich" element={<Navigate to="/wie-gehts-dir/" replace />} />
        <Route path="was-ist-passiert" element={<CausePage />} />
        {/* Zu Hause and Kindergarten had pages of their own; all stories are on one start screen now. */}
        <Route path="gefuehle/:place" element={<Navigate to="/gefuehle/" replace />} />
        <Route path="schatten" element={<ShadowsPage />} />
        <Route path="socken" element={<SocksPage />} />
        <Route path="kettenreaktion" element={<MarblePage />} />
        {/* Kettenreaktion's old address, then the Klingende Kugelbahn's; the marble run is a level of Kettenreaktion now. */}
        <Route path="kugelbahn" element={<Navigate to="/kettenreaktion/" replace />} />
        <Route path="kleine-abenteuer" element={<ElevatorPage />} />
        {/* Its old name and address, for bookmarks and the home screen. */}
        <Route path="aufzug" element={<Navigate to="/kleine-abenteuer/" replace />} />
        <Route path="abenteuer" element={<AdventurePage />} />
        <Route path="impressum" element={<ImprintPage />} />
        <Route path="datenschutz" element={<PrivacyPage />} />
        <Route path="management" element={<ManagementPage />} />
        {/* Its old name and address, for bookmarks. */}
        <Route path="ideen" element={<Navigate to="/management/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
