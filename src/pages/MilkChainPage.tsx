import { useLocation } from "react-router";
import { MilkChainGame, titleAt } from "@/games/milkchain/MilkChainGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** The book „Abstillen“ with its stories: the long one at `/abstillen/`, the others below it (`/abstillen/nachts/` …). */
export function MilkChainPage() {
  const t = useT();
  useTitle(t(titleAt(useLocation().pathname)));
  return <MilkChainGame />;
}
