import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useAppLanguage, useT } from "@/lib/language";
import { ElevatorPlay } from "./ElevatorPlay";
import { FilmPlay } from "./film/FilmPlay";
import { FILMS } from "./film/films";
import { titleIn } from "./phrases";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY, type ElevatorSettings } from "./settings";
import { TRAIL_LEVELS } from "./trail/levels";
import { TrailPlay } from "./trail/TrailPlay";
import "./elevator.css";

/** The names of the card groups: which levels ride the lift in the house, which walk through the world, which are films. */
const LIFT = { de: "🛗 Aufzug", ru: "🛗 Лифт", en: "🛗 Elevator", zh: "🛗 电梯", hi: "🛗 लिफ़्ट", es: "🛗 Ascensor", ar: "🛗 المصعد" };
const TRAIL = { de: "🚶 Laufen", ru: "🚶 Пешком", en: "🚶 Walking", zh: "🚶 走路", hi: "🚶 पैदल", es: "🚶 A pie", ar: "🚶 مشيا" };
const FILM = { de: "🎬 Filme", ru: "🎬 Фильмы", en: "🎬 Films", zh: "🎬 电影", hi: "🎬 फ़िल्में", es: "🎬 Películas", ar: "🎬 أفلام" };

/** "Kleine Abenteuer": the lift stories in the house and the trail levels through the world. */
export function ElevatorGame() {
  const [settings, update] = useGameSettings(ELEVATOR_SETTINGS_KEY, DEFAULT_ELEVATOR_SETTINGS);
  const t = useT();
  const { id: language } = useAppLanguage();
  // The story titles are German in the data and come in the app language from its phrasebook (`phrases.ts`).
  const title = (german: string) => titleIn(german, language);

  return (
    <GameShell
      title={t({
        de: "Kleine Abenteuer",
        ru: "Маленькие приключения",
        en: "Little Adventures",
        zh: "小小冒险",
        hi: "छोटे-छोटे रोमांच",
        es: "Pequeñas aventuras",
        ar: "مغامرات صغيرة",
      })}
      emoji="🧭"
      modes={[
        { id: "hunger", emoji: "🥞", title: title("Pfannkuchen"), kind: t(LIFT) },
        { id: "gutenacht", emoji: "🌙", title: title("Gute Nacht"), kind: t(LIFT) },
        { id: "pfuetzen", emoji: "🌧️", title: title("Pfützen"), kind: t(LIFT) },
        { id: "drachen", emoji: "🪁", title: title("Der Drachen"), kind: t(TRAIL) },
        { id: "ball", emoji: "⚽", title: title("Der Ball rollt weg"), kind: t(TRAIL) },
        { id: "ballon", emoji: "🎈", title: title("Der Luftballon"), kind: t(TRAIL) },
        { id: "lok", emoji: "🚂", title: title("Die kleine Lok"), kind: t(TRAIL) },
        { id: "floss", emoji: "⛵", title: title("Das Floß"), kind: t(TRAIL) },
        { id: "sandburg", emoji: "🏖️", title: title("Die Sandburg"), kind: t(TRAIL) },
        { id: "picknick", emoji: "🧺", title: title("Picknick im Wald"), kind: t(TRAIL) },
        { id: "katze", emoji: "🐈", title: title("Wo ist die Katze?"), kind: t(TRAIL) },
        { id: "schneemann", emoji: "⛄", title: title("Der Schneemann"), kind: t(TRAIL) },
        { id: "feuerwehr", emoji: "🚒", title: title("Die Feuerwehr"), kind: t(FILM) },
      ]}
      mode={settings.story}
      onMode={(story) => update({ story })}
    >
      <Stories settings={settings} />
    </GameShell>
  );
}

/** Plays the story picked on the start screen, and after it the one „Nochmal“ or „Weiter“ starts. */
function Stories({ settings }: { settings: ElevatorSettings }) {
  const language = useAppLanguage();
  const [run, setRun] = useState({ story: settings.story, n: 0 });
  const pick = (story: string) => setRun((r) => ({ story, n: r.n + 1 }));
  const level = TRAIL_LEVELS.find((l) => l.id === run.story);
  const film = FILMS.find((f) => f.id === run.story);
  if (film) return <FilmPlay key={run.n} language={language} settings={settings} film={film} onPick={pick} />;
  return level ? (
    <TrailPlay key={run.n} language={language} settings={settings} level={level} onPick={pick} />
  ) : (
    <ElevatorPlay key={run.n} language={language} settings={settings} story={run.story} onPick={pick} />
  );
}
