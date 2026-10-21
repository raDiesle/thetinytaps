import { Navigate, Route, Routes } from "react-router";
import { AnimalsPage } from "@/pages/AnimalsPage";
import { FeelingsPage } from "@/pages/FeelingsPage";
import { Home } from "@/pages/Home";
import { IdeasPage } from "@/pages/IdeasPage";
import { KidHome } from "@/pages/KidHome";
import { LettersPage } from "@/pages/LettersPage";
import { LoudPage } from "@/pages/LoudPage";
import { ScenePage } from "@/pages/ScenePage";
import { ScenesMenu } from "@/pages/ScenesMenu";
import { ShadowsPage } from "@/pages/ShadowsPage";
import { TeethPage } from "@/pages/TeethPage";
import { WordsPage } from "@/pages/WordsPage";

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="buchstaben" element={<LettersPage />} />
      <Route path="woerter" element={<WordsPage />} />
      <Route path="tiere" element={<AnimalsPage />} />
      <Route path="bilder" element={<ScenesMenu />} />
      <Route path="bilder/:scene" element={<ScenePage />} />
      <Route path="zaehne" element={<TeethPage />} />
      <Route path="gefuehle" element={<FeelingsPage />} />
      <Route path="schatten" element={<ShadowsPage />} />
      <Route path="laut-leise" element={<LoudPage />} />
      <Route path="kinder" element={<KidHome />} />
      <Route path="ideen" element={<IdeasPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
