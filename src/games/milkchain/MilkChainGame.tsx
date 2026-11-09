import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { MilkChainPlay } from "./MilkChainPlay";
import { MILK_CHAIN_TITLE } from "./names";
import "./milkchain.css";

export function MilkChainGame() {
  const t = useT();
  return (
    <GameShell
      title={t(MILK_CHAIN_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ goes back to the page before it.
      startMode="story"
    >
      <MilkChainPlay />
    </GameShell>
  );
}
