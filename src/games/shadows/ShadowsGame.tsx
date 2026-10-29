import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { ShadowsPlay } from "./ShadowsPlay";
import { DEFAULT_SHADOWS_SETTINGS, SHADOWS_SETTINGS_KEY } from "./settings";
import "./shadows.css";

/** The game's name, on its start screen and in the browser tab. */
export const SHADOWS_TITLE: Localized = {
  de: "Schatten finden",
  ru: "Найди тень",
  en: "Find the Shadow",
  zh: "找影子",
  hi: "परछाईं ढूँढो",
  es: "Busca la sombra",
  ar: "أين الظل؟",
};

export function ShadowsGame() {
  const t = useT();
  const [settings] = useGameSettings(SHADOWS_SETTINGS_KEY, DEFAULT_SHADOWS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title={t(SHADOWS_TITLE)}
      emoji="👤"
      // Nothing to choose: the game finds the right difficulty by itself and the pictures are picked while playing, so
      // its card plays at once; after ✕ the start screen has only „Los geht’s!“ and the info.
      startMode="play"
      info={
        <>
          <p>
            {t({
              de: "Ein Bild sucht seinen Schatten unter mehreren schwarzen. Das Kind tippt auf den passenden Schatten oder zieht das Bild darauf. Ein anderer Schatten zeigt kurz seine Farben und ist nie falsch. Ist der Schatten gefunden, kommt gleich das nächste Bild.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel fängt leicht an, mit zwei Schatten von ganz verschiedenen Dingen. Findet Ihr Kind die Schatten schnell und sicher, kommen mehr dazu (bis zu sechs) und dann ähnliche, etwa nur Tiere; dauert es lange oder geht vieles daneben, wird es wieder leichter.",
            })}
          </p>
          <p>
            {t({
              de: "Am Anfang sind die Bilder gemischt. Der Knopf oben links öffnet die Auswahl: nur Tiere, Fahrzeuge, Essen oder Dinge, oder wieder gemischt.",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Mit der Tastatur: Pfeiltasten wählen ein Bild, Leertaste oder Enter nimmt es, 1–6 direkt.",
                ru: "С клавиатуры: стрелки выбирают картинку, пробел или Enter берёт её, 1–6 – сразу.",
                en: "With the keyboard: the arrow keys pick a picture, Space or Enter takes it, 1–6 directly.",
                zh: "用键盘：方向键选图，空格或回车键确定，也可以直接按 1–6。",
                hi: "कीबोर्ड से: तीर वाली कुंजियाँ तस्वीर चुनती हैं, स्पेस या एंटर उसे लेता है, 1–6 सीधे।",
                es: "Con el teclado: las flechas eligen una imagen, Espacio o Intro la toma, 1–6 directamente.",
                ar: "بلوحة المفاتيح: تختار مفاتيح الأسهم صورة، ومفتاح المسافة أو الإدخال يأخذها، و1–6 مباشرة.",
              })}
            </p>
          )}
        </>
      }
    >
      <ShadowsPlay settings={settings} />
    </GameShell>
  );
}
