import { useId } from "react";
import { AppLanguageOptions, MenuButton, useMusicSwitch } from "@/components/HomeOptions";
import { PlaytimeOptions } from "@/components/PlaytimeOptions";
import { type Figure, useCommonSettings } from "@/lib/common";
import { OWN_NAMES, useAppLanguage, useT } from "@/lib/language";

/*
 * The grown-ups' options on the home page in the book look, as things standing in the bookshelf's own compartments
 * (Bookshelf.tsx) instead of buttons: a wooden loudspeaker (music), an hourglass (play time), a globe (the language),
 * and stickers of a fox girl and a bear boy stuck on the shelf's back wall (the child's figure). Each opens the same
 * menu as the toy look's buttons (HomeOptions), or switches with one tap where that has none.
 */

/** The wooden loudspeaker standing in the shelf: one tap switches the music of all games on or off. */
export function RoomSpeaker() {
  const music = useMusicSwitch();
  const id = useId();
  return (
    <button type="button" className="room-thing room-speaker" aria-pressed={music.on} aria-label={music.label} title={music.title} onClick={music.toggle}>
      <svg viewBox="0 0 72 100" aria-hidden>
        <defs>
          {/* The lamp's light on the box's front, and the cones' hollows. */}
          <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id={`${id}h`} cx="0.42" cy="0.38" r="0.65">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.7" stopColor="#000" stopOpacity="0.15" />
            <stop offset="1" stopColor="#000" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <ellipse className="room-shade" cx="33" cy="97" rx="30" ry="3" />
        {/* Its side, seen from the middle of the shelf, and its little feet. */}
        <path className="room-speaker-side" d="M56 30 L62 33 V90 L56 94 Z" />
        <path className="room-speaker-foot" d="M10 93 h8 v4 h-8 Z M44 93 h8 v4 h-8 Z" />
        <rect className="room-speaker-box" x="6" y="28" width="50" height="66" rx="5" />
        <rect x="6" y="28" width="50" height="66" rx="5" fill={`url(#${id}f)`} />
        <path className="room-speaker-edge" d="M10 31 H52" />
        <circle className="room-speaker-ring" cx="31" cy="43" r="7" />
        <circle className="room-speaker-cone" cx="31" cy="43" r="3" />
        <circle className="room-speaker-ring" cx="31" cy="72" r="17" />
        <circle className="room-speaker-cone" cx="31" cy="72" r="11.5" />
        <circle cx="31" cy="72" r="11.5" fill={`url(#${id}h)`} />
        <circle className="room-speaker-cap" cx="31" cy="72" r="4.5" />
        <circle className={`room-speaker-light${music.on ? " on" : ""}`} cx="49" cy="88" r="2.4" />
        {music.on ? (
          // Notes coming out, printed still: they don't move by themselves.
          <g className="room-speaker-notes">
            <ellipse cx="49" cy="20" rx="4.2" ry="3.2" transform="rotate(-20 49 20)" />
            <path d="M52.8 19 V4 Q59 6 59 12" />
            <ellipse cx="62" cy="15" rx="3.2" ry="2.5" transform="rotate(-20 62 15)" />
            <path d="M65 14 V3" />
          </g>
        ) : (
          <path className="room-speaker-off" d="M50 6 L62 18 M62 6 L50 18" />
        )}
      </svg>
    </button>
  );
}

/** The hourglass standing in the shelf, turned wood and glass with sand running: the play time for all games (PlaytimeOptions). */
export function RoomHourglass() {
  const t = useT();
  const id = useId();
  return (
    <MenuButton
      icon="⏳"
      label={t({ de: "Spielzeit", ru: "Время игры", en: "Play time", zh: "游戏时间", hi: "खेलने का समय", es: "Tiempo de juego", ar: "وقت اللعب" })}
      className="room-thing room-hourglass"
      art={
        <svg viewBox="0 0 64 100" aria-hidden>
          <defs>
            <linearGradient id={`${id}w`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#b9773f" />
              <stop offset="1" stopColor="#7a4521" />
            </linearGradient>
            <linearGradient id={`${id}g`} x1="0" x2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="0.45" stopColor="#dcefff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#9cc4e0" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <ellipse className="room-shade" cx="32" cy="97" rx="30" ry="3" />
          <rect className="room-post-back" x="30" y="12" width="4" height="76" />
          <path
            fill={`url(#${id}g)`}
            className="room-glass"
            d="M15 13 C15 34 26 40 29.5 48 L29.5 52 C26 60 15 66 15 87 L49 87 C49 66 38 60 34.5 52 L34.5 48 C38 40 49 34 49 13 Z"
          />
          <path className="room-sand" d="M19.5 31 C22 38 27 43 30 47 L34 47 C37 43 42 38 44.5 31 Q32 36 19.5 31 Z" />
          <path className="room-sand-thread" d="M32 47 V75" />
          <path className="room-sand" d="M16.5 87 C18 77 26 72 32 70 C38 72 46 77 47.5 87 Z" />
          <path className="room-glass-shine" d="M19 17 C19 28 22 34 26 39 M19 83 C19 75 21.5 69 25 64" />
          {/* The two turned posts in front, each with three beads. */}
          {[10, 54].map((x) => (
            <g key={x} fill={`url(#${id}w)`} className="room-spindle">
              <rect x={x - 2} y="12" width="4" height="76" />
              <ellipse cx={x} cy="21" rx="3.4" ry="2.6" />
              <ellipse cx={x} cy="50" rx="3.6" ry="3" />
              <ellipse cx={x} cy="79" rx="3.4" ry="2.6" />
            </g>
          ))}
          <g fill={`url(#${id}w)`} className="room-wood">
            <rect x="6" y="2" width="52" height="5" rx="2.5" />
            <rect x="3" y="6" width="58" height="8" rx="3" />
            <rect x="3" y="86" width="58" height="8" rx="3" />
            <rect x="6" y="93" width="52" height="4" rx="2" />
          </g>
          <path className="room-wood-shine" d="M7 8.5 H57 M7 88.5 H57" />
        </svg>
      }
    >
      <PlaytimeOptions />
    </MenuButton>
  );
}

/**
 * The globe standing in the shelf, the language's sign (🌐) with its lines on the sea: the app's language
 * (AppLanguageOptions). Its foot's plate names the language chosen, in its own words, so a grown-up finds theirs.
 */
export function RoomGlobe() {
  const language = useAppLanguage();
  const name = OWN_NAMES[language.id].split(" ")[1];
  const id = useId();
  return (
    <MenuButton
      icon="🌐"
      label={name}
      className="room-thing room-globe"
      art={
        <svg viewBox="0 0 84 112" aria-hidden>
          <defs>
            <clipPath id={`${id}c`}>
              <circle cx="42" cy="44" r="31" />
            </clipPath>
            <radialGradient id={`${id}s`} cx="0.36" cy="0.3" r="0.75">
              <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.8" stopColor="#0b2a40" stopOpacity="0.22" />
              <stop offset="1" stopColor="#0b2a40" stopOpacity="0.5" />
            </radialGradient>
          </defs>
          <ellipse className="room-shade" cx="42" cy="109" rx="30" ry="3" />
          <path className="room-wood" d="M38 82 L36 95 H48 L46 82 Z" />
          <rect className="room-wood" x="16" y="94" width="52" height="14" rx="3" />
          <rect className="room-globe-plate" x="23" y="97" width="38" height="8" rx="1.5" />
          <text className="room-globe-name" x="42" y="103.2" textAnchor="middle">
            {name}
          </text>
          <g transform="rotate(-20 42 44)">
            <circle className="room-globe-sea" cx="42" cy="44" r="31" />
            <g clipPath={`url(#${id}c)`}>
              <path
                className="room-globe-land"
                d="M14 26 C20 18 34 18 36 27 C38 33 30 36 29 42 C27 49 21 52 16 46 C12 40 10 32 14 26 Z M47 15 C55 13 66 19 69 28 C72 37 61 38 59 44 C57 52 63 58 59 66 C55 71 50 63 50 55 C50 47 44 42 46 34 C47 28 43 20 47 15 Z M22 60 C27 56 36 58 36 65 C36 71 28 75 23 71 C19 68 19 63 22 60 Z"
              />
              <g className="room-globe-lines">
                <ellipse cx="42" cy="44" rx="13" ry="31" />
                <ellipse cx="42" cy="44" rx="25" ry="31" />
                <path d="M11 44 H73 M14 28 Q42 34 70 28 M14 60 Q42 54 70 60" />
              </g>
            </g>
            {/* Round: lit from the lamp above left, its far side in shadow. */}
            <circle cx="42" cy="44" r="31" fill={`url(#${id}s)`} />
            <path className="room-globe-shine" d="M22 26 Q28 16 40 14" />
            <circle className="room-globe-outline" cx="42" cy="44" r="31" />
            {/* The brass half ring holding it at its poles. */}
            <path className="room-globe-ring" d="M42 7 A37 37 0 0 1 42 81" />
            <circle className="room-globe-pin" cx="42" cy="9" r="2.4" />
            <circle className="room-globe-pin" cx="42" cy="79" r="2.4" />
          </g>
        </svg>
      }
    >
      <AppLanguageOptions />
    </MenuButton>
  );
}

/**
 * The child's figure (`useFigure`): stickers of a fox girl and a bear boy stuck on the shelf's back wall, one tap on
 * either chooses it (user decision, October 2026) – the chosen one bright, the other one pale.
 */
export function RoomStickers() {
  const t = useT();
  const [common, update] = useCommonSettings();
  const heads: { id: Figure; name: string; Head: () => React.JSX.Element }[] = [
    { id: "girl", name: t({ de: "Mädchen" }), Head: FoxGirlHead },
    { id: "boy", name: t({ de: "Junge" }), Head: BearBoyHead },
  ];
  return (
    <div className="room-stickers" role="group" aria-label={t({ de: "Junge oder Mädchen" })}>
      {heads.map(({ id, name, Head }) => (
        <button
          key={id}
          type="button"
          className="room-thing room-sticker"
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
