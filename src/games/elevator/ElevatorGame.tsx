import { Suspense, use, useState } from "react";
import { GameShell, useLevelOnScreen } from "@/components/GameShell";
import { PageLoading } from "@/components/PageLoading";
import { useGameSettings } from "@/lib/common";
import { useFigurePictures } from "@/lib/figurePictures";
import { useAppLanguage, useT } from "@/lib/language";
import { CARDS, type CardEntry, cardOf, loadCard, type PlayProps } from "./catalog";
import { titleIn } from "./phrases";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY, type ElevatorSettings } from "./settings";
import "./elevator.css";
import previews from "./vorschau/*.webp?glob";
import girlPreviews from "./vorschau-maedchen/*.webp?glob";

/** The names of the card groups: which levels ride the lift in the house, which walk through the world, which are films. */
const LIFT = { de: "🛗 Aufzug", ru: "🛗 Лифт", en: "🛗 Elevator", zh: "🛗 电梯", hi: "🛗 लिफ़्ट", es: "🛗 Ascensor", ar: "🛗 المصعد" };
const TRAIL = { de: "🚶 Laufen", ru: "🚶 Пешком", en: "🚶 Walking", zh: "🚶 走路", hi: "🚶 पैदल", es: "🚶 A pie", ar: "🚶 مشيا" };
const FILM = { de: "🎬 Filme", ru: "🎬 Фильмы", en: "🎬 Films", zh: "🎬 电影", hi: "🎬 फ़िल्में", es: "🎬 Películas", ar: "🎬 أفلام" };
const KINDS = { lift: LIFT, trail: TRAIL, film: FILM };

/** "Kleine Abenteuer": the lift stories in the house and the trail levels through the world. */
export function ElevatorGame() {
  const [settings, update] = useGameSettings(ELEVATOR_SETTINGS_KEY, DEFAULT_ELEVATOR_SETTINGS);
  const t = useT();
  const { id: language } = useAppLanguage();
  // The cards show the child as a boy or a girl, as chosen on the home page.
  const pictures = useFigurePictures(previews, girlPreviews);

  return (
    <GameShell
      previews={pictures}
      title={t({
        de: "Kleine Abenteuer",
        ru: "Маленькие приключения",
        en: "Little Adventures",
        zh: "小小冒险",
        hi: "छोटे-छोटे रोमांच",
        es: "Pequeñas aventuras",
        ar: "مغامرات صغيرة",
      })}
      modes={CARDS.map((card) => ({ id: card.id, emoji: card.emoji, title: titleIn(card.title, language, card.first), kind: t(KINDS[card.kind]) }))}
      mode={settings.story}
      onMode={(story) => update({ story })}
      // A tap on a card waits a moment for its code, so the level is drawn before the page turns to it; nothing is fetched before a card is pressed.
      prepare={(id) => loadCard(cardOf(id ?? settings.story))}
    >
      <Stories settings={settings} />
    </GameShell>
  );
}

/** Plays the story picked on the start screen, and after it the one „Nochmal“ or „Weiter“ starts. */
function Stories({ settings }: { settings: ElevatorSettings }) {
  const language = useAppLanguage();
  const [run, setRun] = useState({ story: settings.story, n: 0 });
  // „Weiter“ plays the next story without changing the card picked: the address names the one on screen.
  useLevelOnScreen(run.story);
  const pick = (story: string) => setRun((r) => ({ story, n: r.n + 1 }));
  return (
    // The paper with the paw track while the level's code still loads – never a dark screen.
    <Suspense fallback={<PageLoading />}>
      <Played key={run.n} card={cardOf(run.story)} language={language} onPick={pick} />
    </Suspense>
  );
}

/** One story, level or film played: waits (suspends) for its code, then plays it. */
function Played({ card, ...props }: PlayProps & { card: CardEntry }) {
  const Play = use(loadCard(card));
  return <Play {...props} />;
}
