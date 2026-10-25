import { SocksGame } from "@/games/socks/SocksGame";
import { useTitle } from "@/lib/title";

export function SocksPage() {
  useTitle("Socken-Paare");
  return <SocksGame />;
}
