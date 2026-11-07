import { memo } from "react";
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

/**
 * A picture card on the start screen: the picture as it looks when its time is up (user request, November 2026: the
 * picture is the button, no words on it) – the cart full of apples, the train at the station, the flower in bloom. It
 * is the very drawing of a run in its end state (`.tm-done`), standing still: the CSS stops every animation in it and
 * puts what an animation would leave at its end in place (`.tm-card-art`), so the menu stays still and light.
 * „Abwechseln“, which never ends, shows the fox child's lamp on, the toy on its cushion, and the hourglass between;
 * Tennis the fox child's side in the light with the ball on its racket, the board's lights all on.
 */
export const TimerCardArt = memo(function TimerCardArt({ picture, toy }: { picture: TimerPicture; toy: SwapToy }) {
  return (
    <span className="tm-card-art" aria-hidden>
      {picture === "swap" ? (
        <span className="tm-stage tm-done">
          <SwapBackdrop />
          <SwapLight kind="fox" on />
          <SwapCushions />
          <SwapShade kind="bear" on />
          <SwapHourglass ms={CARD_MS} startedAt={0} flip={false} waiting glow={0} />
          <Toy toy={toy} place="fox" />
        </span>
      ) : picture === "tennis" ? (
        <span className="tm-stage" style={tennisStyle()}>
          <TennisBackdrop />
          <Racket kind="fox" bouncing={false} swing={0} />
          <Racket kind="bear" bouncing={false} swing={0} />
          <TennisPlayers />
          <SwapShade kind="bear" on edge={COURT.net} />
          <TennisBoard ms={CARD_MS} startedAt={0} waiting glow={0} />
          <Ball place="fox" hop={0} />
        </span>
      ) : (
        <span className="tm-stage tm-done" style={stageStyle(picture, CARD_MS, pieceCount(CARD_MS, MAX_STOPS))}>
          <SceneParts picture={picture} phase="done" total={CARD_MS} set={CARD_MS} poke={0} startedAt={0} />
        </span>
      )}
    </span>
  );
});
