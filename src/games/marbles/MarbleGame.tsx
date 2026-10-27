import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { GAME_TITLE, LEVEL_TEXTS } from "./content";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevel } from "./settings";

/** The mode cards in menu order, one per level; „Weiter“ at a level's end goes on with the next. */
const MODES: { id: MarbleLevel; emoji: string }[] = [
  { id: "track", emoji: "🎢" },
  { id: "machine", emoji: "⚙️" },
  { id: "sneeze", emoji: "🤧" },
  { id: "kitchen", emoji: "🍳" },
  { id: "garden", emoji: "🌻" },
  { id: "pegs", emoji: "📍" },
  { id: "topple", emoji: "📚" },
  { id: "building", emoji: "🚧" },
  { id: "water", emoji: "🦆" },
  { id: "circus", emoji: "🎪" },
  { id: "space", emoji: "🚀" },
  { id: "light", emoji: "🔦" },
];

export function MarbleGame() {
  const t = useT();
  const [settings, update] = useGameSettings(MARBLE_SETTINGS_KEY, DEFAULT_MARBLE_SETTINGS);
  // Older saves may hold a choice that is gone ("all", "both", "machines"): those begin with the first level.
  const mode = MODES.some((m) => m.id === settings.levels) ? settings.levels : MODES[0].id;
  const modes = MODES.map((m) => ({ ...m, title: t(LEVEL_TEXTS[m.id].name) }));

  return (
    <GameShell
      title={t(GAME_TITLE)}
      emoji="🎳"
      modes={modes}
      mode={mode}
      onMode={(levels) => update({ levels: levels as MarbleLevel })}
      info={
        <p>
          {t({
            de: "Ein Tipp, und dann stößt eins das nächste an: Jedes Level läuft bis zum Ende, und das Bild fährt mit. Auf der Klingenden Kugelbahn rollen die Kugeln über Xylophon, Wippe, Looping, Trommeln und Klangröhren bis in den Korb.",
            ru: "Одно касание — и одно толкает другое: каждый уровень идёт до конца, а картинка едет следом. В «Звонких шариках» шарики катятся по ксилофону, качелям, мёртвой петле, барабанам и колокольчикам прямо в корзину.",
          })}
        </p>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Kugelbahn: Was rollt denn da?", ru: "Звонкие шарики: что там катится?" })}>
            <Toggle
              label={t({
                de: "Oben liegen drei Dinge zur Wahl, ein Tipp lässt genau dieses los",
                ru: "Наверху лежат три вещи на выбор, касание отпускает именно эту",
              })}
              checked={settings.pick}
              onChange={(pick) => update({ pick })}
            />
            <p className="setting-note">
              {t({
                de: "Murmel, Tennisball, Eisenkugel, Apfel und Seifenblase rollen jedes anders; am Computer lassen die Tasten 1, 2 und 3 sie los. Ausgeschaltet öffnet ein Tipp den Trichter, und sechs Kugeln rollen von selbst.",
                ru: "Шарик, теннисный мяч, железный шар, яблоко и мыльный пузырь катятся каждый по-своему; на компьютере их отпускают клавиши 1, 2 и 3. Если выключено, касание открывает воронку, и шесть шариков катятся сами.",
              })}
            </p>
          </SettingsGroup>
          <SettingsGroup title={t({ de: "Kugelbahn: Umbauen", ru: "Звонкие шарики: перестройка" })}>
            <Toggle
              label={t({ de: "Tippen auf einen der sechs Plätze mit 🔧 wechselt das Teil", ru: "Касание одного из шести мест с 🔧 меняет деталь" })}
              checked={settings.rebuild}
              onChange={(rebuild) => update({ rebuild })}
            />
            <p className="setting-note">
              {t({
                de: "Glocke, Trampolin, Trichter und Wasserrad gehen reihum; die nächste Kugel nimmt den neuen Weg. Am Computer baut die Leertaste die Bahn Schritt für Schritt um. Ausgeschaltet bleibt die Bahn wie immer.",
                ru: "Колокольчик, батут, воронка и водяное колесо сменяют друг друга; следующий шарик едет по новому пути. На компьютере пробел перестраивает горку шаг за шагом. Если выключено, горка остаётся как всегда.",
              })}
            </p>
          </SettingsGroup>
        </>
      }
    >
      <MarblePlay settings={settings} />
    </GameShell>
  );
}
