import { SOCKS_TITLE, SocksGame } from "@/games/socks/SocksGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function SocksPage() {
  const t = useT();
  useTitle(t(SOCKS_TITLE));
  return <SocksGame />;
}
