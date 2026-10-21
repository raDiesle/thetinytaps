import { Navigate, Route, Routes } from "react-router";
import { AnimalsPage } from "@/pages/AnimalsPage";
import { FeelingsPage } from "@/pages/FeelingsPage";
import { Home } from "@/pages/Home";
import { IdeasPage } from "@/pages/IdeasPage";
import { LettersPage } from "@/pages/LettersPage";
import { ScenePage } from "@/pages/ScenePage";
import { ScenesMenu } from "@/pages/ScenesMenu";
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
      <Route path="ideen" element={<IdeasPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
