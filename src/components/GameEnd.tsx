import { useEffect, useState, type PointerEvent } from "react";
import { useLocation } from "react-router";
import { useCountsPlaytime, useEndShown, useLeaveGame, useLeavesToShelf } from "@/components/GameShell";
import { ShelfLabelArt } from "@/components/PageCornerArt";
import { track } from "@/lib/analytics";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { turnPageWith } from "@/lib/look";
import { countGame, gameEnded, isPlaytimeOver } from "@/lib/playtime";
import { recordedVoice } from "@/lib/voice";
import endFiles from "./stimme/**/*.mp3?glob";

/**
 * Asked once the end is shown, so a child who can't read hears what the two buttons offer (A-24, user wish, November
 * 2026): from its recording in src/components/stimme/ (`bun run voice make --only alle-spiele`), silent until it is
 * made. In the words of the two buttons, in every app language.
 */
export const AGAIN_OR_NEXT: Localized = {
  de: "Nochmal oder weiter?",
  ru: "Ещё раз или дальше?",
  en: "Again or next?",
  zh: "再来一次，还是下一个？",
  hi: "फिर से या आगे?",
  es: "¿Otra vez o siguiente?",
  ar: "مرة أخرى أم التالي؟",
};
/** The same where there is no „Weiter“ (one story only, Aufs Töpfchen). */
export const AGAIN_ONLY: Localized = { de: "Nochmal?", ru: "Ещё раз?", en: "Again?", zh: "再来一次？", hi: "फिर से?", es: "¿Otra vez?", ar: "مرة أخرى؟" };
/** How long the question waits after the buttons came, so the game's own end line comes first. */
const ASK_AFTER_MS = 1500;

const endVoice = recordedVoice(endFiles);

interface GameEndProps {
  /** Plays the same level (picture, story …) once more. Left out with `menu`. */
  onAgain?: () => void;
  /**
   * „Menü“ instead of „Nochmal“: the way back as a button with the shelf's round label on it, the same picture as the
   * ribbon in the corner (Zähne putzen and Aufs Töpfchen, user request, November 2026: once brushed or once on the potty,
   * a child is done, not asking for the same again). Only for those two.
   */
  menu?: boolean;
  /**
   * The next level, after the last one the first again, and its name, read out with „Weiter“. Left out only where there
   * is no other level, so „Weiter“ would just be „Nochmal“.
   */
  next?: { name?: string; onNext: () => void };
  /** Waits this long before showing up, so the party can be watched first. */
  delayMs?: number;
  /**
   * Small buttons in the bottom right corner, so the picture stays free (Aufs Töpfchen, the user's choice there); taps
   * beside them reach the game.
   */
  corners?: boolean;
  /**
   * Lies in the game's own layout instead of over the picture's bottom: where a game places the buttons beside its own
   * end picture (Gefühle's cards' room, Zähne putzen's week chart).
   */
  inline?: boolean;
  /**
   * Writes `next.name` under „Weiter“, where grown-ups should see what comes before they go on (Gefühle: the next
   * feeling, user feedback, November 2026). Elsewhere the name is only read out.
   */
  showNext?: boolean;
}

/**
 * The end of a level: play it again („Nochmal“) or go on to the next („Weiter“, only where there is another). Nothing
 * stands beside them: a fox or bear family cheering there (D-12) was only decoration a child wanted to tap, and was taken
 * out again (user feedback, November 2026). Words only, no emoji or symbols (user feedback, November 2026): „Weiter“ is a big painted label, „Nochmal“ a smaller paper slip beside it. The way back is
 * no button here but the page's corner in the top left, as in every menu – the ✕, or the book's ribbon where the game
 * goes back onto the shelf (GameShell, told by `useEndShown`; a „Menü“ button was one way back too many, user feedback,
 * November 2026). Only Zähne putzen and Aufs Töpfchen, played once and done, show „Menü“ instead of „Nochmal“ (`menu`),
 * drawn with the ribbon's shelf label.
 */
export function GameEnd({ onAgain, menu = false, next, delayMs = 0, corners = false, inline = false, showNext = false }: GameEndProps) {
  const t = useT();
  const language = useAppLanguage();
  const endShown = useEndShown();
  const counts = useCountsPlaytime();
  const leave = useLeaveGame();
  const toShelf = useLeavesToShelf();
  const [shown, setShown] = useState(delayMs <= 0);

  useEffect(() => {
    if (shown) return;
    const timer = setTimeout(() => setShown(true), delayMs);
    return () => clearTimeout(timer);
  }, [shown, delayMs]);

  // Which games are played to their end, and whether the child wants the same once more or goes on (analytics.ts).
  const { pathname } = useLocation();
  useEffect(() => {
    if (shown) track("ende", { spiel: pathname });
  }, [shown, pathname]);

  // With the last game of a game limit, the game says good night instead (GameShell).
  useEffect(() => {
    if (shown && counts) gameEnded();
  }, [shown, counts]);

  // Once, a moment after the buttons came, the question what they offer – queued behind what the game still says, and
  // never when play time is over (the game says good night then, GameShell). With only „Menü“ there is nothing to ask.
  const hasNext = next !== undefined;
  const asks = hasNext || !menu;
  useEffect(() => {
    if (!shown || !asks) return;
    const timer = setTimeout(() => {
      if (isPlaytimeOver()) return;
      const line = hasNext ? AGAIN_OR_NEXT : AGAIN_ONLY;
      endVoice.say(line[language.id] ?? line.de, language.id, { queue: true, english: line.en });
    }, ASK_AFTER_MS);
    return () => clearTimeout(timer);
  }, [shown, asks, hasNext, language.id]);

  // While the end is on screen, the corner in the top left is the way back.
  useEffect(() => {
    if (!shown) return;
    endShown(true);
    return () => endShown(false);
  }, [shown, endShown]);

  if (!shown) return null;

  // Pointer down, not click: it reacts right away, and the game underneath doesn't get the tap.
  // „Nochmal“ and „Weiter“ each start one more game, for a game limit.
  const press = (event: "nochmal" | "weiter", action: () => void) => (e: PointerEvent) => {
    e.stopPropagation();
    track(event, { spiel: pathname });
    if (counts) countGame();
    // The next round comes on a new page.
    turnPageWith("forward", action);
  };

  return (
    <div className={`game-end${corners ? " corners" : ""}${inline ? " inline" : ""}`} data-tap-root onPointerDown={(e) => e.stopPropagation()}>
      <div className="game-end-small">
        {menu ? (
          <button
            type="button"
            className={`game-end-button menu${toShelf ? " to-shelf" : ""}`}
            aria-label={
              toShelf
                ? t({
                    de: "Zurück zum Bücherregal",
                    ru: "Назад к книжной полке",
                    en: "Back to the bookshelf",
                    zh: "返回书架",
                    hi: "किताबों की अलमारी पर वापस",
                    es: "Volver a la estantería",
                    ar: "العودة إلى رف الكتب",
                  })
                : undefined
            }
            onPointerDown={(e) => e.stopPropagation()}
            // A click, not pointer down, like the corner: leaving on the way down would let the lifted finger tap the shelf.
            onClick={leave}
          >
            {toShelf && <ShelfLabelArt />}
            {t({ de: "Menü", ru: "Меню", en: "Menu", zh: "菜单", hi: "मेनू", es: "Menú", ar: "القائمة" })}
          </button>
        ) : (
          onAgain && (
            <button type="button" className="game-end-button again" onPointerDown={press("nochmal", onAgain)}>
              {t({ de: "Nochmal", ru: "Ещё раз", en: "Again", zh: "再来一次", hi: "फिर से", es: "Otra vez", ar: "مرة أخرى" })}
            </button>
          )
        )}
      </div>
      {next && (
        <button
          type="button"
          className="game-end-button next"
          aria-label={[t({ de: "Weiter", ru: "Дальше", en: "Next", zh: "下一个", hi: "आगे", es: "Siguiente", ar: "التالي" }), next.name]
            .filter(Boolean)
            .join(": ")}
          onPointerDown={press("weiter", next.onNext)}
        >
          {t({ de: "Weiter", ru: "Дальше", en: "Next", zh: "下一个", hi: "आगे", es: "Siguiente", ar: "التالي" })}
          {showNext && next.name && <span className="game-end-next-name">{next.name}</span>}
        </button>
      )}
    </div>
  );
}
