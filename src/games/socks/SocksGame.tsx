import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { SOCK_TEXTS } from "./content";
import { SocksPlay } from "./SocksPlay";
import { DEFAULT_SOCKS_SETTINGS, SOCKS_SETTINGS_KEY, type SockMode, type StartPairs } from "./settings";
import "./socks.css";

/** The game's name, on its start screen and in the browser tab. */
export const SOCKS_TITLE: Localized = { de: "Socken-Paare", ru: "Пары носочков" };

export function SocksGame() {
  const t = useT();
  const { pairs } = t(SOCK_TEXTS);
  const [settings, update] = useGameSettings(SOCKS_SETTINGS_KEY, DEFAULT_SOCKS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title={t(SOCKS_TITLE)}
      emoji="🧦"
      modes={[
        { id: "colors", emoji: "🌈", title: t({ de: "Farben", ru: "Цвета" }) },
        { id: "patterns", emoji: "⭐", title: t({ de: "Muster", ru: "Узоры" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as SockMode })}
      level={
        <Choice<StartPairs>
          label={t({ de: "Am Anfang", ru: "Для начала" })}
          value={settings.pairs}
          onChange={(pairs) => update({ pairs })}
          options={[
            { value: "2", label: pairs(2) },
            { value: "3", label: pairs(3) },
            { value: "4", label: pairs(4) },
          ]}
        />
      }
      info={
        <>
          <p>
            {t({
              de: "Die Waschmaschine ist voll. Ein Tipp startet sie, dann purzeln die Socken auf den Boden. Eine Socke antippen hebt sie hoch und lässt ihren Ton klingen; ihre Partnerin dazu, und beide hüpfen an die Wäscheleine. Eine andere Socke ist nie falsch: Die erste geht einfach zurück.",
              ru: "Стиральная машина полна. Одно касание запускает её, и носочки высыпаются на пол. Касание носочка поднимает его, и звучит его нота; к нему его пару – и оба прыгают на верёвку. Другой носочек никогда не ошибка: первый просто возвращается обратно.",
            })}
          </p>
          <p>
            {t({
              de: "„Farben“: jedes Paar hat seine Farbe. „Muster“: jedes Paar hat sein Muster in nur drei Farben. „Weiter“ bringt ein Paar mehr.",
              ru: "«Цвета»: у каждой пары свой цвет. «Узоры»: у каждой пары свой узор всего в трёх цветах. «Дальше» добавляет ещё одну пару.",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Mit der Tastatur: jede Taste startet die Waschmaschine. Dann wählen Pfeiltasten eine Socke, Leertaste oder Enter nimmt sie, 1–9 direkt.",
                ru: "С клавиатуры: любая клавиша запускает стиральную машину. Потом стрелки выбирают носочек, пробел или Enter берёт его, 1–9 сразу.",
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
