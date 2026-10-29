import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
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
  const device = useDevice();

  return (
    <GameShell
      title={t(SOCKS_TITLE)}
      emoji="🧦"
      // Nothing to choose: the game finds the right difficulty by itself, so its card plays at once; after ✕ the
      // start screen has only „Los geht’s!“ and the info.
      startMode="play"
      info={
        <>
          <p>
            {t({
              de: "Die Waschmaschine wäscht von selbst, dann purzeln die Socken auf den Boden. Eine Socke antippen hebt sie hoch und lässt ihren Ton klingen; ihre Partnerin dazu, und beide hüpfen an die Wäscheleine. Eine andere Socke ist nie falsch: Die erste geht einfach zurück. Hängen alle, wird die Leine aus dem Bild gezogen, und die nächsten Socken purzeln heraus.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel fängt leicht an, mit zwei Paaren in zwei Farben. Je schneller und sicherer Ihr Kind die Paare findet, desto mehr Paare kommen, dann Muster statt Farben und zuletzt Muster in derselben Farbe; dauert es lange oder geht vieles daneben, wird es wieder leichter. Es gibt keine Uhr: Wer Paare schnell hintereinander findet, hört die Töne höher klettern, und die Socken fliegen flinker an die Leine.",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Mit der Tastatur: Pfeiltasten wählen eine Socke, Leertaste oder Enter nimmt sie, 1–9 direkt.",
                en: "With a keyboard: the arrow keys pick a sock, Space or Enter takes it, 1–9 directly.",
                zh: "用键盘：用方向键选袜子，空格键或回车键拿起它，1–9 直接选。",
                hi: "कीबोर्ड से: तीर वाली कुंजियाँ मोज़ा चुनती हैं, स्पेस या एंटर उसे उठाता है, 1–9 सीधे।",
                es: "Con teclado: las flechas eligen un calcetín, la barra espaciadora o Enter lo toma, 1–9 directamente.",
                ar: "بلوحة المفاتيح: تختار الأسهم جوربًا، ومفتاح المسافة أو Enter يأخذه، و1–9 مباشرة.",
                ru: "С клавиатуры: стрелки выбирают носочек, пробел или Enter берёт его, 1–9 сразу.",
              })}
            </p>
          )}
        </>
      }
    >
      <SocksPlay settings={settings} />
    </GameShell>
  );
}
