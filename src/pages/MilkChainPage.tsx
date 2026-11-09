import { MilkChainGame } from "@/games/milkchain/MilkChainGame";
import { MILK_CHAIN_TITLE } from "@/games/milkchain/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function MilkChainPage() {
  const t = useT();
  useTitle(t(MILK_CHAIN_TITLE));
  return <MilkChainGame />;
}
