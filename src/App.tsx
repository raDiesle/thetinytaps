import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AnimalsPage } from "@/pages/AnimalsPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { ElevatorPage } from "@/pages/ElevatorPage";
import { FeelingsPage } from "@/pages/FeelingsPage";
import { Home } from "@/pages/Home";
import { IdeasPage } from "@/pages/IdeasPage";
import { KidHome } from "@/pages/KidHome";
import { LettersPage } from "@/pages/LettersPage";
import { LoudPage } from "@/pages/LoudPage";
import { MarblePage } from "@/pages/MarblePage";
import { ScenePage } from "@/pages/ScenePage";
import { ScenesMenu } from "@/pages/ScenesMenu";
import { ShadowsPage } from "@/pages/ShadowsPage";
import { TeethPage } from "@/pages/TeethPage";
import { WordsPage } from "@/pages/WordsPage";

// The 3D game brings three.js along; loaded only when it is opened.
const AdventurePage = lazy(() => import("@/pages/AdventurePage").then((m) => ({ default: m.AdventurePage })));

export function App() {
  return (
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
      <Route path="kugelbahn" element={<MarblePage />} />
      <Route path="aufzug" element={<ElevatorPage />} />
      <Route
        path="abenteuer"
        element={
          <Suspense fallback={null}>
            <AdventurePage />
          </Suspense>
        }
      />
      <Route path="kinder" element={<KidHome />} />
      <Route path="ideen" element={<IdeasPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
