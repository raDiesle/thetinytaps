import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocation } from "react-router";
import { useDevice } from "@/lib/device";
import { canFullscreen, enterFullscreen, useFullscreen } from "@/lib/fullscreen";
import { useT } from "@/lib/language";
import { isStandalone } from "@/lib/pwa";

const PORTRAIT = "(orientation: portrait)";

const TURN = {
  de: "Bitte quer halten",
  ru: "Поверните экран горизонтально",
  en: "Please hold sideways",
  zh: "请横过来拿",
  hi: "कृपया आड़ा पकड़ें",
  es: "Por favor, gire el dispositivo",
  ar: "يرجى تدوير الجهاز أفقيًا",
};
const ASK = {
  de: "Im Vollbild spielen?",
  ru: "Играть в полноэкранном режиме?",
  en: "Play in full screen?",
  zh: "全屏玩吗？",
  hi: "फ़ुल स्क्रीन में खेलें?",
  es: "¿Jugar en pantalla completa?",
  ar: "اللعب بملء الشاشة؟",
};

function subscribePortrait(onChange: () => void) {
  const query = matchMedia(PORTRAIT);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Whether the screen is taller than wide, updated when the device turns. */
function usePortrait(): boolean {
  return useSyncExternalStore(subscribePortrait, () => matchMedia(PORTRAIT).matches);
}

/**
 * For the grown-up on phones and tablets, over menus and games: a note to hold
 * the device sideways while it stands upright, and once per visit the question
 * whether to play in fullscreen (a browser only allows fullscreen after a tap).
 * „Trotzdem hochkant“ dismisses both for the visit, for grown-ups who keep the device upright.
 * Computers get neither: a game goes into fullscreen when it starts anyway.
 */
export function ScreenHint() {
  const device = useDevice();
  const t = useT();
  const portrait = usePortrait();
  const fullscreen = useFullscreen();
  const { pathname } = useLocation();
  const [asked, setAsked] = useState(false);
  // The grown-up may choose to play upright anyway; then neither note comes back during this visit.
  const [upright, setUpright] = useState(false);
  const fullscreenPossible = canFullscreen() && !fullscreen && !isStandalone();

  // Once the page has been in fullscreen (a game started), leaving it isn't a reason to ask.
  useEffect(() => {
    if (fullscreen) setAsked(true);
  }, [fullscreen]);

  // The management page, Impressum and Datenschutz are for grown-ups reading, not a menu or a game.
  if (
    !device.touchOnly ||
    pathname.startsWith("/management") ||
    pathname.startsWith("/ideen") ||
    pathname.startsWith("/impressum") ||
    pathname.startsWith("/datenschutz")
  )
    return null;

  const goFullscreen = () => {
    setAsked(true);
    void enterFullscreen();
  };

  const playUpright = () => {
    setUpright(true);
    setAsked(true);
  };

  if (portrait && !upright) {
    return (
      <div className="screen-hint" role="dialog" aria-modal aria-label={t(TURN)}>
        <svg className="screen-hint-phone" viewBox="0 0 120 120" aria-hidden>
          <path className="screen-hint-arrow" d="M28 30 A44 44 0 0 1 92 28 M84 18 L93 28 L80 34" />
          <g className="screen-hint-turn">
            <rect x="38" y="30" width="44" height="76" rx="8" />
            <circle cx="60" cy="98" r="3" />
          </g>
        </svg>
        <p className="screen-hint-title">{t(TURN)}</p>
        <div className="screen-hint-buttons">
          {fullscreenPossible && (
            <button type="button" className="screen-hint-button" onClick={goFullscreen}>
              <FullscreenIcon />{" "}
              {t({ de: "Vollbild", ru: "Полный экран", en: "Full screen", zh: "全屏", hi: "फ़ुल स्क्रीन", es: "Pantalla completa", ar: "ملء الشاشة" })}
            </button>
          )}
          <button type="button" className="screen-hint-button secondary" onClick={playUpright}>
            {t({
              de: "Trotzdem hochkant",
              ru: "Всё равно вертикально",
              en: "Upright anyway",
              zh: "仍然竖着玩",
              hi: "फिर भी खड़ा रखें",
              es: "Vertical de todos modos",
              ar: "عموديًا على أي حال",
            })}
          </button>
        </div>
      </div>
    );
  }

  if (fullscreenPossible && !asked) {
    return (
      <div className="screen-hint" role="dialog" aria-modal aria-label={t(ASK)}>
        <p className="screen-hint-title">{t(ASK)}</p>
        <div className="screen-hint-buttons">
          <button type="button" className="screen-hint-button" onClick={goFullscreen}>
            <FullscreenIcon />{" "}
            {t({ de: "Vollbild", ru: "Полный экран", en: "Full screen", zh: "全屏", hi: "फ़ुल स्क्रीन", es: "Pantalla completa", ar: "ملء الشاشة" })}
          </button>
          <button type="button" className="screen-hint-button secondary" onClick={() => setAsked(true)}>
            {t({ de: "Nein", ru: "Нет", en: "No", zh: "不用", hi: "नहीं", es: "No", ar: "لا" })}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/** The four corners of the fullscreen button on the home page. */
function FullscreenIcon() {
  return (
    <svg className="fullscreen-icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
    </svg>
  );
}
