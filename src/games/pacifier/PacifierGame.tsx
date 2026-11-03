import { GameShell } from "@/components/GameShell";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { FAREWELLS, type Farewell, GIFTS } from "./content";
import { PacifierPlay } from "./PacifierPlay";
import { DEFAULT_PACIFIER_SETTINGS, PACIFIER_SETTINGS_KEY } from "./settings";
import "./pacifier.css";

/** The game's name, on the shelf and in the browser tab. */
export const PACIFIER_TITLE: Localized = {
  de: "Die Schnullerfee",
  en: "The Pacifier Fairy",
  zh: "奶嘴仙子",
  hi: "चुसनी परी",
  es: "El hada del chupete",
  ar: "جنّية اللهّاية",
  ru: "Фея пустышек",
};

export function PacifierGame() {
  const t = useT();
  const [settings, update] = useGameSettings(PACIFIER_SETTINGS_KEY, DEFAULT_PACIFIER_SETTINGS);

  return (
    <GameShell
      title={t(PACIFIER_TITLE)}
      // One story with nothing to pick first: it plays at once, and ✕ and „Menü“ go back to the shelf (GameShell).
      // How the pacifiers leave and which present waits are the grown-ups' choice, behind ⚙️ while playing.
      startMode="story"
    >
      <PacifierPlay settings={settings} />
      <PlayOptions>
        <Choice<Farewell>
          label={t({
            de: "Abschied der Schnuller",
            en: "Saying goodbye to the pacifiers",
            zh: "和奶嘴告别",
            hi: "चुसनियों की विदाई",
            es: "Despedida de los chupetes",
            ar: "وداع اللهّايات",
            ru: "Прощание с пустышками",
          })}
          value={settings.farewell}
          onChange={(farewell) => update({ farewell })}
          options={FAREWELLS.map((f) => ({ value: f.id, label: `${f.emoji} ${t(f.name)}` }))}
        />
        <Choice<string>
          label={t({
            de: "Geschenk der Fee",
            en: "The fairy’s present",
            zh: "仙子的礼物",
            hi: "परी का तोहफ़ा",
            es: "Regalo del hada",
            ar: "هدية الجنّية",
            ru: "Подарок феи",
          })}
          value={settings.gift}
          onChange={(gift) => update({ gift })}
          options={GIFTS.map((g) => ({ value: g.id, label: `${g.emoji} ${t(g.name)}` }))}
        />
      </PlayOptions>
    </GameShell>
  );
}
