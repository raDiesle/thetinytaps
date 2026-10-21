import { Navigate, Route, Routes } from "react-router";
import { Home } from "@/pages/Home";
import { LettersPage } from "@/pages/LettersPage";
import { ScenePage } from "@/pages/ScenePage";
import { ScenesMenu } from "@/pages/ScenesMenu";
import { WordsPage } from "@/pages/WordsPage";

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="buchstaben" element={<LettersPage />} />
      <Route path="woerter" element={<WordsPage />} />
      <Route path="bilder" element={<ScenesMenu />} />
      <Route path="bilder/:scene" element={<ScenePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
