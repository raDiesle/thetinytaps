import { memo, useLayoutEffect, useRef, useState } from "react";
import { pieceCount, MAX_STOPS } from "./pieces";
import type { SwapToy, TimerPicture } from "./settings";
import { SwapBackdrop, SwapCushions, SwapHourglass, SwapLight, SwapShade, Toy } from "./swap";
import { Ball, COURT, Racket, TennisBackdrop, TennisBoard, TennisPlayers, tennisStyle } from "./tennis";
import { SceneParts, stageStyle } from "./TimerPlay";

/**
 * The card's picture is cut as for this long a run, so it shows the pieces a usual timer has (the apples in the cart,
 * the train's posts); the length set in the row doesn't redraw every card.
 */
const CARD_MS = 5 * 60_000;

/** The moment a card shows: halfway through its run (user feedback, November 2026: the end showed too little of it). */
const MIDDLE = 0.5;

/**
 * Pictures whose middle shows little take a later moment, as a share of the run: the Sonnenaufgang's moon has set at
 * the middle and its sun not yet risen.
 */
const LATER: Partial<Record<TimerPicture, number>> = { sunset: 0.68 };

/**
 * Stops a card's drawing `at` ms into its run: every animation in it is put at that moment, its look there written into
 * the element (`commitStyles`) and the animation cancelled, then `.tm-still` stops all of them for good, so the menu
 * stands still and light.
 */
function holdAt(card: HTMLElement | null, at: number) {
  if (!card || card.classList.contains("tm-still")) return;
  for (const animation of card.getAnimations?.({ subtree: true }) ?? []) {
    animation.pause();
    animation.currentTime = at;
    try {
      animation.commitStyles();
    } catch {
      // An element not drawn (display: none) keeps its look without the animation.
    }
    animation.cancel();
  }
  card.classList.add("tm-still");
}

/**
 * A picture card on the start screen: the picture as it looks halfway through its run (user request, November 2026:
 * the picture is the button, no words on it; the middle rather than the end, user feedback, November 2026) – the tree
 * full of apples with the cart under them, the train halfway to the station, the leaf half eaten. It is the very drawing
 * of a run (`SceneParts`, started `MIDDLE` of it ago – `LATER` for a few), stopped at that moment by `holdAt`. „Abwechseln“ shows the fox
 * child's lamp on, the toy on its cushion and the hourglass half run; Tennis the fox child's side in the light with the
 * ball on its racket and half the board's lights out.
 */
export const TimerCardArt = memo(function TimerCardArt({ picture, toy }: { picture: TimerPicture; toy: SwapToy }) {
  const at = CARD_MS * (LATER[picture] ?? MIDDLE);
  const [startedAt] = useState(() => Date.now() - at);
  const card = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => holdAt(card.current, at), [at]);
  return (
    <span className="tm-card-art" aria-hidden ref={card}>
      {picture === "swap" ? (
        <span className="tm-stage">
          <SwapBackdrop />
          <SwapLight kind="fox" on />
          <SwapCushions />
          <SwapShade kind="bear" on />
          <SwapHourglass ms={CARD_MS} startedAt={startedAt + at} flip={false} waiting={false} glow={0} />
          <Toy toy={toy} place="fox" />
        </span>
      ) : picture === "tennis" ? (
        <span className="tm-stage" style={tennisStyle()}>
          <TennisBackdrop />
          <Racket kind="fox" bouncing={false} swing={0} />
          <Racket kind="bear" bouncing={false} swing={0} />
          <TennisPlayers />
          <SwapShade kind="bear" on edge={COURT.net} />
          <TennisBoard ms={CARD_MS} startedAt={startedAt + at} waiting={false} glow={0} />
          <Ball place="fox" hop={0} />
        </span>
      ) : (
        <span className="tm-stage" style={stageStyle(picture, CARD_MS, pieceCount(CARD_MS, MAX_STOPS))}>
          <SceneParts picture={picture} phase="running" total={CARD_MS} set={CARD_MS} poke={0} startedAt={startedAt} still />
        </span>
      )}
    </span>
  );
});
