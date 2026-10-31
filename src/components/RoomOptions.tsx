import { AppLanguageOptions, MenuButton, useMusicSwitch } from "@/components/HomeOptions";
import { PlaytimeOptions } from "@/components/PlaytimeOptions";
import { type Figure, useCommonSettings } from "@/lib/common";
import { OWN_NAMES, useAppLanguage, useT } from "@/lib/language";

/*
 * The grown-ups' options on the home page in the book look, as things in the room with the bookshelf (Bookshelf.tsx)
 * instead of buttons: a loudspeaker hanging from the ceiling (music), an hourglass on the shelf (play time), the heads
 * of a fox girl and a bear boy on the wall (the child's figure) and a light switch (the language, kept out of the way).
 * Each opens the same menu as the toy look's buttons (HomeOptions), or switches with one tap where that has none.
 */

/** The loudspeaker hanging on its cable from the ceiling: one tap switches the music of all games on or off. */
export function RoomSpeaker() {
  const music = useMusicSwitch();
  return (
    <button type="button" className="room-thing room-speaker" aria-pressed={music.on} aria-label={music.label} title={music.title} onClick={music.toggle}>
      <svg viewBox="0 0 84 120" aria-hidden>
        {/* The cable from the ceiling, and the bracket it holds. */}
        <path className="room-cable" d="M34 -400 V40" />
        <path className="room-metal" d="M26 40 H42 V46 H26 Z" />
        <rect className="room-speaker-box" x="8" y="46" width="52" height="68" rx="8" />
        <rect className="room-speaker-side" x="52" y="48" width="8" height="64" rx="3" />
        <circle className="room-speaker-cloth" cx="30" cy="60" r="7" />
        <circle className="room-speaker-cloth" cx="30" cy="89" r="17" />
        <circle className="room-speaker-cone" cx="30" cy="89" r="7" />
        <circle className={`room-speaker-light${music.on ? " on" : ""}`} cx="49" cy="106" r="2.6" />
        {music.on ? (
          // Sound coming out, printed still: the waves don't move by themselves.
          <g className="room-speaker-waves">
            <path d="M66 78 Q72 89 66 100" />
            <path d="M73 72 Q82 89 73 106" />
          </g>
        ) : (
          <path className="room-speaker-off" d="M66 82 L80 96 M80 82 L66 96" />
        )}
      </svg>
    </button>
  );
}

/** The hourglass standing on top of the shelf: the play time for all games (PlaytimeOptions). */
export function RoomHourglass() {
  const t = useT();
  return (
    <MenuButton
      icon="⏳"
      label={t({ de: "Spielzeit", ru: "Время игры", en: "Play time", zh: "游戏时间", hi: "खेलने का समय", es: "Tiempo de juego", ar: "وقت اللعب" })}
      className="room-thing room-hourglass"
      art={
        <svg viewBox="0 0 52 84" aria-hidden>
          <path className="room-glass" d="M13 10 C13 30 22 36 26 42 C30 36 39 30 39 10 Z M13 74 C13 54 22 48 26 42 C30 48 39 54 39 74 Z" />
          <path className="room-sand" d="M18 24 C20 31 24 35 26 38 C28 35 32 31 34 24 Z M15 74 C16 64 22 60 26 58 C30 60 36 64 37 74 Z" />
          <path className="room-sand-thread" d="M26 38 V58" />
          <path className="room-glass-shine" d="M17 14 C17 24 19 29 22 33 M17 70 C17 62 19 57 22 54" />
          <rect className="room-wood" x="4" y="3" width="44" height="8" rx="3" />
          <rect className="room-wood" x="4" y="73" width="44" height="8" rx="3" />
          <path className="room-post" d="M9 11 V73 M43 11 V73" />
        </svg>
      }
    >
      <PlaytimeOptions />
    </MenuButton>
  );
}

/**
 * The child's figure (`useFigure`): the heads of a fox girl and a bear boy on the wall, one tap on either chooses it
 * (user decision, October 2026) – the chosen one is lit, the other one pale.
 */
export function RoomFigures() {
  const t = useT();
  const [common, update] = useCommonSettings();
  const heads: { id: Figure; name: string; Head: () => React.JSX.Element }[] = [
    { id: "girl", name: t({ de: "Mädchen" }), Head: FoxGirlHead },
    { id: "boy", name: t({ de: "Junge" }), Head: BearBoyHead },
  ];
  return (
    <div className="room-figures" role="group" aria-label={t({ de: "Junge oder Mädchen" })}>
      {heads.map(({ id, name, Head }) => (
        <button
          key={id}
          type="button"
          className="room-thing room-head"
          aria-pressed={common.figure === id}
          aria-label={name}
          title={name}
          onClick={(e) => {
            // Not left focused: a child's space bar would choose it again.
            e.currentTarget.blur();
            update({ figure: id });
          }}
        >
          <Head />
        </button>
      ))}
    </div>
  );
}

/** The light switch on the wall beside the shelf: the app's language, out of the way, with a little globe on it. */
export function RoomSwitch() {
  const language = useAppLanguage();
  return (
    <MenuButton
      icon="🌐"
      label={OWN_NAMES[language.id].split(" ")[1]}
      className="room-thing room-switch"
      art={
        <svg viewBox="0 0 40 60" aria-hidden>
          <rect className="room-switch-plate" x="3" y="3" width="34" height="54" rx="6" />
          <rect className="room-switch-rocker" x="11" y="10" width="18" height="26" rx="3" />
          <path className="room-switch-lit" d="M11 13 Q11 10 14 10 H26 Q29 10 29 13 V23 H11 Z" />
          {/* The globe: what it switches is the language. */}
          <g className="room-switch-globe">
            <circle cx="20" cy="47" r="6" />
            <ellipse cx="20" cy="47" rx="2.6" ry="6" />
            <path d="M14 47 H26" />
          </g>
        </svg>
      }
    >
      <AppLanguageOptions />
    </MenuButton>
  );
}

/** A fox girl's head: orange, a white muzzle, lashes and a pink bow on her ear. */
function FoxGirlHead() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path className="head-fox" d="M17 50 L21 9 L45 29 Z M83 50 L79 9 L55 29 Z" />
      <path className="head-ear-in" d="M24 39 L26 18 L38 30 Z M76 39 L74 18 L62 30 Z" />
      <path className="head-fox" d="M13 52 C13 31 31 24 50 24 C69 24 87 31 87 52 C87 72 69 90 50 92 C31 90 13 72 13 52 Z" />
      <path className="head-muzzle" d="M21 61 C33 58 44 63 50 73 C56 63 67 58 79 61 C75 78 63 90 50 92 C37 90 25 78 21 61 Z" />
      <circle className="head-cheek" cx="27" cy="66" r="5" />
      <circle className="head-cheek" cx="73" cy="66" r="5" />
      <circle className="head-eye" cx="37" cy="52" r="4.6" />
      <circle className="head-eye" cx="63" cy="52" r="4.6" />
      <path className="head-lash" d="M33 47 L30 44 M36 46 L35 42 M67 47 L70 44 M64 46 L65 42" />
      <ellipse className="head-eye" cx="50" cy="72" rx="5.4" ry="3.8" />
      <path className="head-line" d="M50 76 V79 M45 81 Q50 84 55 81" />
      <path className="head-bow" d="M64 22 L76 15 L75 30 Z M64 22 L54 12 L52 27 Z" />
      <circle className="head-bow" cx="64" cy="22" r="4" />
    </svg>
  );
}

/** A bear boy's head: brown, round ears and a blue cap. */
function BearBoyHead() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <circle className="head-bear" cx="22" cy="32" r="12" />
      <circle className="head-bear" cx="78" cy="32" r="12" />
      <circle className="head-ear-bear" cx="22" cy="32" r="6" />
      <circle className="head-ear-bear" cx="78" cy="32" r="6" />
      <circle className="head-bear" cx="50" cy="57" r="35" />
      <ellipse className="head-snout" cx="50" cy="71" rx="16" ry="12" />
      <circle className="head-cheek" cx="27" cy="68" r="5" />
      <circle className="head-cheek" cx="73" cy="68" r="5" />
      <circle className="head-eye" cx="37" cy="53" r="4.4" />
      <circle className="head-eye" cx="63" cy="53" r="4.4" />
      <ellipse className="head-eye" cx="50" cy="65" rx="6" ry="4.4" />
      <path className="head-line" d="M50 69 V73 M44 75 Q50 79 56 75" />
      <path className="head-cap" d="M17 42 C17 14 83 14 83 42 Z" />
      <path className="head-cap-brim" d="M14 43 Q50 34 86 43 Q50 50 14 43 Z" />
      <circle className="head-cap-brim" cx="50" cy="19" r="3.4" />
    </svg>
  );
}
