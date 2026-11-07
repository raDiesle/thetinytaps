import { memo } from "react";
import { pieceCount, MAX_STOPS } from "./pieces";
import type { SwapToy, TimerPicture } from "./settings";
import { SwapBackdrop, SwapHourglass, Toy } from "./swap";
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
 * „Abwechseln“, which never ends, shows the two children's cushions with the toy and the hourglass.
 */
export const TimerCardArt = memo(function TimerCardArt({ picture, toy }: { picture: TimerPicture; toy: SwapToy }) {
  return (
    <span className="tm-card-art" aria-hidden>
      {picture === "swap" ? (
        <span className="tm-stage tm-done">
          <SwapBackdrop />
          <SwapHourglass ms={CARD_MS} startedAt={0} flip={false} running={false} glow={0} />
          <Toy toy={toy} bear={false} />
        </span>
      ) : (
        <span className="tm-stage tm-done" style={stageStyle(picture, CARD_MS, pieceCount(CARD_MS, MAX_STOPS))}>
          <SceneParts picture={picture} phase="done" total={CARD_MS} set={CARD_MS} poke={0} startedAt={0} />
        </span>
      )}
    </span>
  );
});
