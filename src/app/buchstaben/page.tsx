import type { Metadata } from "next";
import { LettersGame } from "@/games/letters/LettersGame";

export const metadata: Metadata = {
  title: "Buchstaben & Zahlen – The Tiny Taps",
};

export default function LettersPage() {
  return <LettersGame />;
}
