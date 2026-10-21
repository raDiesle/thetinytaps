import type { Metadata } from "next";
import { WordsGame } from "@/games/words/WordsGame";

export const metadata: Metadata = {
  title: "Wörter tippen – The Tiny Taps",
};

export default function WordsPage() {
  return <WordsGame />;
}
