import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { SocksPlay } from "./SocksPlay";
import { DEFAULT_SOCKS_SETTINGS, SOCKS_SETTINGS_KEY } from "./settings";
import "./socks.css";

/** The game's name, on its start screen and in the browser tab. */
export const SOCKS_TITLE: Localized = {
  de: "Socken-Paare",
  en: "Sock Pairs",
  zh: "袜子配对",
  hi: "मोज़ों के जोड़े",
  es: "Pares de calcetines",
  ar: "أزواج الجوارب",
  ru: "Пары носочков",
};

export function SocksGame() {
  const t = useT();
  const [settings] = useGameSettings(SOCKS_SETTINGS_KEY, DEFAULT_SOCKS_SETTINGS);

  return (
    <GameShell
      title={t(SOCKS_TITLE)}
      emoji="🧦"
      // Nothing to choose: the game finds the right difficulty by itself, so its card plays at once; after ✕ the
      // start screen has only „Los geht’s!“.
      startMode="play"
    >
      <SocksPlay settings={settings} />
    </GameShell>
  );
}
