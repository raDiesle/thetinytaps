import { NIGHT_MILK_TITLE } from "@/games/nightmilk/names";
import { NightMilkGame } from "@/games/nightmilk/NightMilkGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function NightMilkPage() {
  const t = useT();
  useTitle(t(NIGHT_MILK_TITLE));
  return <NightMilkGame />;
}
