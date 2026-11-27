import { useId } from "react";
import { AppLanguageOptions, LeaveOptions, MenuButton, useMusicSwitch } from "@/components/HomeOptions";
import { ContactLink } from "@/components/ContactLink";
import { InstallHint } from "@/components/InstallHint";
import { MascotHead } from "@/components/Mascot";
import { OfflineOptions } from "@/components/OfflineOptions";
import { ParentsNote } from "@/components/ParentsNote";
import { PlaytimeOptions } from "@/components/PlaytimeOptions";
import { SeoWords } from "@/components/SeoText";
import { CONTACT_EMAIL } from "@/content/legal";
import { type Figure, useCommonSettings } from "@/lib/common";
import { OWN_NAMES, useAppLanguage, useT } from "@/lib/language";

/*
 * The grown-ups' options on the home page, as things standing in the bookshelf's own compartments (Bookshelf.tsx)
 * instead of buttons: a wooden loudspeaker (music), an hourglass (play time), a globe (the language), stickers of a fox
 * girl and a bear boy stuck on the shelf's right inner side (the child's figure), and „mehr …“ in the words carved beside
 * the everyday helpers with what grown-ups read about the app (RoomNotes), and a sign „Offline spielen“ hanging under the
 * shelf (RoomOffline). Each opens its menu (HomeOptions.tsx), or switches with one tap where that has none.
 */

/** The wooden loudspeaker standing in the shelf: one tap switches the music of all games on or off. */
export function RoomSpeaker() {
  const music = useMusicSwitch();
  const id = useId();
  return (
    <button type="button" className="room-thing room-speaker" aria-pressed={music.on} aria-label={music.label} title={music.title} onClick={music.toggle}>
      {/*
       * Seen from the middle of the room on a wide shelf: its front, its left side and its top going back towards the
       * eye's point, and its right side against the shelf's right wall, the front's right edge right at the svg's edge.
       */}
      <svg viewBox="0 0 80 100" aria-hidden>
        <defs>
          {/* The lamp's light on the box's front. */}
          <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.18" />
          </linearGradient>
          {/* The side, darker towards the back. */}
          <linearGradient id={`${id}d`} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.3" />
          </linearGradient>
          {/* Polished metal rings round the cones, lit from above left. */}
          <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1ece4" />
            <stop offset="0.45" stopColor="#a69c93" />
            <stop offset="1" stopColor="#4d453f" />
          </linearGradient>
          {/* The cone's hollow, deepest round its cap. */}
          <radialGradient id={`${id}c`} cx="0.42" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#7a686e" />
            <stop offset="0.55" stopColor="#4a3c41" />
            <stop offset="1" stopColor="#231b1f" />
          </radialGradient>
          {/* Domes: the cap and the tweeter, round with a light on them. */}
          <radialGradient id={`${id}h`} cx="0.36" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#e6dde0" />
            <stop offset="0.4" stopColor="#8c7b81" />
            <stop offset="1" stopColor="#3a2f33" />
          </radialGradient>
        </defs>
        <ellipse className="room-shade" cx="45" cy="97" rx="35" ry="2.8" />
        <path className="room-speaker-foot" d="M28 92 h7 v5 h-7 Z M70 92 h7 v5 h-7 Z M13 85.5 h5 v3.5 h-5 Z" />
        {/* Its left side and its top, going back. */}
        <path className="room-speaker-side" d="M24 34 L11 27 V86 L24 93 Z" />
        <path d="M24 34 L11 27 V86 L24 93 Z" fill={`url(#${id}d)`} />
        <path className="room-speaker-grain" d="M14 38 Q17 52 15 66 M19 36 Q21 58 20 84" />
        <path className="room-speaker-top" d="M24 34 L11 27 H65.8 L78.8 34 Z" />
        <rect className="room-speaker-box" x="24" y="34" width="54.8" height="59" rx="2" />
        <rect x="24" y="34" width="54.8" height="59" rx="2" fill={`url(#${id}f)`} />
        <path className="room-speaker-edge" d="M26.5 36.4 H76.3" />
        {/* The dark baffle with the tweeter above and the woofer below, their rings held by little screws. */}
        <rect className="room-speaker-baffle" x="29" y="39" width="44.8" height="49" rx="2" />
        <circle cx="51.4" cy="50" r="6.6" fill={`url(#${id}m)`} className="room-speaker-ring" />
        <circle cx="51.4" cy="50" r="3.8" fill={`url(#${id}h)`} />
        <circle cx="51.4" cy="71.5" r="14.6" fill={`url(#${id}m)`} className="room-speaker-ring" />
        <circle className="room-speaker-surround" cx="51.4" cy="71.5" r="12.4" />
        <circle cx="51.4" cy="71.5" r="10.8" fill={`url(#${id}c)`} />
        <circle cx="51.4" cy="71.5" r="4.4" fill={`url(#${id}h)`} className="room-speaker-cap" />
        <g className="room-speaker-screw">
          <circle cx="41.6" cy="61.7" r="0.9" />
          <circle cx="61.2" cy="61.7" r="0.9" />
          <circle cx="41.6" cy="81.3" r="0.9" />
          <circle cx="61.2" cy="81.3" r="0.9" />
        </g>
        <circle className={`room-speaker-light${music.on ? " on" : ""}`} cx="70" cy="84.6" r="1.9" />
        {music.on ? (
          // Notes coming out, printed still: they don't move by themselves.
          <g className="room-speaker-notes">
            <ellipse cx="52" cy="20" rx="4.2" ry="3.2" transform="rotate(-20 52 20)" />
            <path d="M55.8 19 V4 Q62 6 62 12" />
            <ellipse cx="65" cy="15" rx="3.2" ry="2.5" transform="rotate(-20 65 15)" />
            <path d="M68 14 V3" />
          </g>
        ) : (
          <path className="room-speaker-off" d="M53 6 L65 18 M65 6 L53 18" />
        )}
      </svg>
    </button>
  );
}

/**
 * The hourglass standing in the shelf, turned wood and glass with sand running: the play time for all games
 * (PlaytimeOptions) and how a game is left (LeaveOptions).
 */
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
      <LeaveOptions />
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
              <circle cx="42" cy="42" r="29" />
            </clipPath>
            {/* The ball lit from the lamp above left: bright there, its far side and rim in deep shadow. */}
            <radialGradient id={`${id}s`} cx="0.34" cy="0.28" r="0.8">
              <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
              <stop offset="0.28" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.62" stopColor="#06233a" stopOpacity="0.12" />
              <stop offset="0.86" stopColor="#06233a" stopOpacity="0.45" />
              <stop offset="1" stopColor="#06233a" stopOpacity="0.7" />
            </radialGradient>
            {/* The lamp's gleam on the varnish. */}
            <radialGradient id={`${id}g`}>
              <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            {/* Brass and turned wood, round: light where they face the lamp, dark where they turn away. */}
            <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8a6420" />
              <stop offset="0.3" stopColor="#f6dc8c" />
              <stop offset="0.6" stopColor="#c99a3e" />
              <stop offset="1" stopColor="#7a5418" />
            </linearGradient>
            <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#6e3f1f" />
              <stop offset="0.28" stopColor="#c08a55" />
              <stop offset="0.55" stopColor="#94592f" />
              <stop offset="1" stopColor="#5a321a" />
            </linearGradient>
          </defs>
          <ellipse className="room-shade" cx="44" cy="108.6" rx="31" ry="3" />
          {/* The turned wooden foot, a low round box seen from a little above, the language's name on its front. */}
          <path className="room-globe-foot" d="M16 95 V103.5 A26 5 0 0 0 68 103.5 V95 Z" fill={`url(#${id}w)`} />
          <ellipse className="room-globe-foot-top" cx="42" cy="95" rx="26" ry="5" />
          <path className="room-globe-foot" d="M37 95.5 C37 92 39.5 90.5 40 86 H44 C44.5 90.5 47 92 47 95.5 A5 1.6 0 0 1 37 95.5 Z" fill={`url(#${id}w)`} />
          <rect className="room-globe-plate" x="23" y="99.6" width="38" height="7.6" rx="1.5" />
          <text className="room-globe-name" x="42" y="105.4" textAnchor="middle">
            {name}
          </text>
          {/* The brass arm from the foot up to the axis' lower end. */}
          <path className="room-globe-arm" d="M42 88 C42 81 48 77.5 55.4 74.6" />
          <circle cx="42" cy="42" r="29" className="room-globe-sea" />
          <g transform="rotate(-23 42 42)">
            {/* Seen a little from above, so the parallels curve down in front and the north pole tips towards the eye. */}
            <g clipPath={`url(#${id}c)`}>
              <path
                className="room-globe-land"
                d="M15 24 C18 18 25 15 30 17 C33 19 31 23 28 26 C26 29 27 33 24 36 C21 38 18 37 16 34 C14 31 13 27 15 24 Z M36 22 C38 17 46 15 52 16 C58 15 64 18 68 24 C70 28 66 31 62 30 C58 30 56 33 52 32 C50 34 47 33 46 30 C43 31 40 29 39 27 C37 26 35 25 36 22 Z M42 34 C46 32 52 33 55 36 C58 39 60 43 58 47 C56 51 55 56 52 61 C50 64 47 63 46 59 C45 55 44 51 42 47 C39 44 38 38 42 34 Z M18 44 C21 42 25 44 26 48 C27 53 24 58 22 63 C20 66 18 64 17 60 C15 55 15 48 18 44 Z M60 52 C63 50 67 51 68 54 C68 57 65 59 62 58 C60 57 59 54 60 52 Z"
              />
              <g className="room-globe-lines">
                <ellipse cx="42" cy="42" rx="16.6" ry="27.6" />
                <ellipse cx="42" cy="42" rx="27.3" ry="27.6" />
                <path d="M42 14.4 V69.6 M13 42 A29 9 0 0 0 71 42 M19.8 24.3 A22.2 6.9 0 0 0 64.2 24.3 M19.8 59.7 A22.2 6.9 0 0 0 64.2 59.7" />
              </g>
            </g>
          </g>
          <circle cx="42" cy="42" r="29" fill={`url(#${id}s)`} />
          {/* Light thrown back from the shelf on its lower right rim, and the lamp's gleam. */}
          <path className="room-globe-rim" d="M57 66.5 A29 29 0 0 0 69.5 50" />
          <ellipse cx="31" cy="27" rx="9" ry="5.5" transform="rotate(-38 31 27)" fill={`url(#${id}g)`} />
          <circle className="room-globe-outline" cx="42" cy="42" r="29" />
          <g transform="rotate(-23 42 42)">
            {/* The brass half ring round it, holding it at its poles: a band with its thickness, lit like the arm. */}
            <path className="room-globe-ring" d="M42 6.5 A35.5 35.5 0 0 1 42 77.5 L42 73.6 A31.6 31.6 0 0 0 42 10.4 Z" fill={`url(#${id}b)`} />
            <rect className="room-globe-pin" x="40.6" y="9" width="2.8" height="5.4" rx="1" />
            <rect className="room-globe-pin" x="40.6" y="69.6" width="2.8" height="5.4" rx="1" />
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
 * either chooses it (user decision, October 2026) – the chosen one bright, the other one pale. A little ♀ or ♂ beside
 * each makes plain what is chosen (user feedback, November 2026).
 */
export function RoomStickers() {
  const t = useT();
  const [common, update] = useCommonSettings();
  // The signs in their text form (U+FE0E), never as an emoji.
  const heads: { id: Figure; name: string; sign: string; Head: () => React.JSX.Element }[] = [
    {
      id: "girl",
      name: t({ de: "Mädchen", ru: "Девочка", en: "Girl", zh: "女孩", hi: "लड़की", es: "Niña", ar: "بنت" }),
      sign: "\u2640\uFE0E",
      Head: FoxGirlHead,
    },
    { id: "boy", name: t({ de: "Junge", ru: "Мальчик", en: "Boy", zh: "男孩", hi: "लड़का", es: "Niño", ar: "ولد" }), sign: "\u2642\uFE0E", Head: BearBoyHead },
  ];
  return (
    <div
      className="room-stickers"
      role="group"
      aria-label={t({
        de: "Junge oder Mädchen",
        ru: "Мальчик или девочка",
        en: "Boy or girl",
        zh: "男孩还是女孩",
        hi: "लड़का या लड़की",
        es: "Niño o niña",
        ar: "ولد أم بنت",
      })}
    >
      {heads.map(({ id, name, sign, Head }) => (
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
          <span className="room-sticker-sign" data-figure={id} aria-hidden>
            {sign}
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * „mehr …“ at the end of the words carved beside the everyday helpers (Bookshelf.tsx), for grown-ups: it opens what the
 * app is (the page's words for search engines, SeoWords) and a few words from us as parents (ParentsNote) – the shelf's
 * page has nothing below its first screen; installing and playing offline have a sign of their own (RoomOffline). It
 * took the place of a little „i“ book in the shelf, which grown-ups had to find (user feedback, November 2026). While
 * closed the text stays in the page unseen (`keep`), so search engines still read it.
 */
export function RoomNotes() {
  const t = useT();
  return (
    <MenuButton
      icon="ℹ️"
      label={t({
        de: "Über Little Steps to Grow",
        ru: "О Little Steps to Grow",
        en: "About Little Steps to Grow",
        zh: "关于 Little Steps to Grow",
        hi: "Little Steps to Grow के बारे में",
        es: "Acerca de Little Steps to Grow",
        ar: "عن Little Steps to Grow",
      })}
      className="room-thing shelf-carving-more"
      keep
      art={<span aria-hidden>{t({ de: "mehr …", ru: "ещё …", en: "more …", zh: "更多 …", hi: "और …", es: "más …", ar: "المزيد …" })}</span>}
    >
      <SeoWords />
      <ParentsNote />
      <p className="room-notes-contact">
        <ContactLink />
      </p>
    </MenuButton>
  );
}

/**
 * „Offline spielen“, a little sign hanging on two short chains from the shelf's underside below the globe (on an upright
 * screen, which has no legs, from the top board into the top left compartment): it opens installing the app and which
 * games are kept to play without internet (user request, November 2026: behind „mehr …“ among the texts they were hard
 * to find).
 */
export function RoomOffline() {
  const t = useT();
  const label = t({
    de: "Offline spielen",
    ru: "Играть офлайн",
    en: "Play offline",
    zh: "离线玩",
    hi: "ऑफ़लाइन खेलें",
    es: "Jugar sin conexión",
    ar: "اللعب دون اتصال",
  });
  return (
    <MenuButton
      icon="📲"
      label={label}
      className="room-offline"
      art={
        <span className="room-offline-board">
          {/* An arrow down into a tray: what is fetched stays on the device. */}
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 3.5v11M7 10l5 5 5-5M4.5 16.5v3.5h15v-3.5" />
          </svg>
          <span>{label}</span>
        </span>
      }
    >
      <InstallHint />
      <OfflineOptions />
    </MenuButton>
  );
}

/**
 * „Feedback“, a small paper slip in the room's bottom left corner, mirroring Impressum and Datenschutz on the right: it
 * opens a few words from us asking for feedback, ideas and wishes, and only there the button that opens the grown-up's
 * mail app (user request, November 2026: not the bare address, whose tap went straight to writing a mail). The mail app
 * sends nothing by itself either. Its sign is an envelope, never a speech bubble, which looked like a chat (user feedback,
 * November 2026).
 */
export function RoomFeedback() {
  const t = useT();
  const label = t({
    de: "Feedback & Wünsche",
    ru: "Отзывы и пожелания",
    en: "Feedback & wishes",
    zh: "反馈与心愿",
    hi: "सुझाव और इच्छाएँ",
    es: "Comentarios y deseos",
    ar: "ملاحظات وأمنيات",
  });
  return (
    <MenuButton
      icon="✉️"
      label={label}
      className="room-feedback"
      art={
        <>
          <span aria-hidden>✉️</span> {t({ de: "Feedback", ru: "Отзыв", en: "Feedback", zh: "反馈", hi: "सुझाव", es: "Opiniones", ar: "ملاحظات" })}
        </>
      }
    >
      <section className="seo-text feedback-note">
        <h2>
          {t({
            de: "Schreiben Sie uns",
            ru: "Напишите нам",
            en: "Write to us",
            zh: "给我们写信",
            hi: "हमें लिखिए",
            es: "Escríbanos",
            ar: "اكتبوا لنا",
          })}
        </h2>
        <p>
          {t({
            de: "Little Steps to Grow wächst mit jeder Rückmeldung. Was gefällt Ihrem Kind, wo hakt es, und welches Spiel würden Sie sich noch wünschen? Erzählen Sie es uns gern – über ein Lob freuen wir uns, über Kritik und neue Ideen genauso.",
            ru: "Little Steps to Grow растёт с каждым отзывом. Что нравится вашему ребёнку, где что-то не получается и какую игру вам бы ещё хотелось? Расскажите нам – похвале мы рады, а критике и новым идеям ничуть не меньше.",
            en: "Little Steps to Grow grows with every message we get. What does your child love, where does something get stuck, and which game would you still like to see? Do tell us – we are glad of praise, and just as glad of criticism and new ideas.",
            zh: "Little Steps to Grow 因每一条反馈而成长。您的孩子喜欢什么，哪里不太顺，您还希望有什么游戏？欢迎告诉我们——我们喜欢听到夸奖，也同样欢迎批评和新点子。",
            hi: "Little Steps to Grow हर सुझाव के साथ बढ़ता है। आपके बच्चे को क्या अच्छा लगता है, कहाँ अटकता है, और आप कौन-सा खेल और चाहेंगे? हमें ज़रूर बताइए – तारीफ़ से हमें ख़ुशी होती है, और आलोचना व नए विचारों से भी उतनी ही।",
            es: "Little Steps to Grow crece con cada mensaje que recibimos. ¿Qué le gusta a su peque, dónde se atasca algo y qué juego le gustaría ver todavía? Cuéntenoslo: un elogio nos alegra, y las críticas y las ideas nuevas, igual.",
            ar: "ينمو Little Steps to Grow مع كل رسالة تصلنا. ما الذي يحبّه طفلكم، وأين يتعثّر شيء ما، وأيّ لعبة تتمنّون أن تروها بعد؟ أخبرونا – يسعدنا المديح، وتسعدنا الملاحظات والأفكار الجديدة بالقدر نفسه.",
          })}
        </p>
        <p>
          {t({
            de: "Jede Nachricht lesen wir selbst.",
            ru: "Каждое письмо мы читаем сами.",
            en: "We read every message ourselves.",
            zh: "每一条消息我们都会亲自阅读。",
            hi: "हर संदेश हम ख़ुद पढ़ते हैं।",
            es: "Leemos cada mensaje nosotros mismos.",
            ar: "نقرأ كل رسالة بأنفسنا.",
          })}
        </p>
        <p className="feedback-mail">
          <a
            className="install-button"
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
              t({
                de: "Feedback zu Little Steps to Grow",
                ru: "Отзыв о Little Steps to Grow",
                en: "Feedback on Little Steps to Grow",
                zh: "关于 Little Steps to Grow 的反馈",
                hi: "Little Steps to Grow के बारे में सुझाव",
                es: "Comentarios sobre Little Steps to Grow",
                ar: "ملاحظات حول Little Steps to Grow",
              }),
            )}`}
          >
            <span aria-hidden>✉️</span>{" "}
            {t({
              de: "E-Mail schreiben",
              ru: "Написать письмо",
              en: "Write an email",
              zh: "写邮件",
              hi: "ईमेल लिखिए",
              es: "Escribir un correo",
              ar: "اكتبوا رسالة",
            })}
          </a>
          {/* The address to copy, for a device without a mail app. */}
          <span className="feedback-address">{CONTACT_EMAIL}</span>
        </p>
      </section>
    </MenuButton>
  );
}

/** A fox girl's head (the app's fox, `MascotHead`): lashes and a pink bow on her ear. */
function FoxGirlHead() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <MascotHead kind="fox" child lashes>
        <path className="head-bow" d="M66 20 L78 13 L77 28 Z M66 20 L56 10 L54 25 Z" />
        <circle className="head-bow" cx="66" cy="20" r="4" />
      </MascotHead>
    </svg>
  );
}

/** A bear boy's head (the app's bear, `MascotHead`) with a blue cap. */
function BearBoyHead() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <MascotHead kind="bear" child>
        <path className="head-cap" d="M19 38 C19 10 81 10 81 38 Z" />
        <path className="head-cap-brim" d="M16 39 Q50 30 84 39 Q50 46 16 39 Z" />
        <circle className="head-cap-brim" cx="50" cy="15" r="3.4" />
      </MascotHead>
    </svg>
  );
}
