import { memo, useLayoutEffect, useRef, useState } from "react";
import { MARBLE_COLORS, MarbleScene } from "./marbleRun";
import { RaceScene } from "./race";
import { DEFAULT_TIMER_SETTINGS, type Players, type TimerPicture, type TurnCount } from "./settings";
import { SAW, Seesaw, SeesawBackdrop, SeesawStand, SeesawSun } from "./seesaw";
import { STAGE_W } from "./scenes";
import { SwapBackdrop, SwapCushions, SwapHourglass, SwapLights, SwapShade, SwapShades, swapPlaces, TURN_CHILDREN } from "./swap";
import { SceneParts, stageStyle } from "./TimerPlay";

/**
 * The card's picture is cut as for this long a run, so it shows the pieces a usual timer has (the apples in the cart,
 * the train's posts); the length set in the row doesn't redraw every card.
 */
const CARD_MS = 5 * 60_000;

/** The moment a card shows: halfway through its run (user feedback, November 2026: the end showed too little of it). */
const MIDDLE = 0.5;

/**
 * Pictures whose middle shows little take another moment, as a share of the run: the Sonnenaufgang's moon has set at
 * the middle and its sun not yet risen, and the Wippe lies nearly level there, so its card shows the fox child's seat
 * still well up; the Block House's middle has a block just landed, so its card shows the next one carried by the beam;
 * Up to the Moon's middle is the lift in the skyscraper's side with sky round it, so its card shows the fox in the cable
 * car's basket between the treehouse and the skyscraper's window; the Marble Jar's middle has a marble just landed, so
 * its card shows the next one bouncing down the nails; the Kerze's middle has a candle just burnt down, so its card shows
 * the spark running along the fuse to the next one; the Rennstrecke's middle has the kart far off on the back loop, so
 * its card shows the fox child's kart crossing the bridge.
 */
const LATER: Partial<Record<TimerPicture, number>> = { sunset: 0.68, seesaw: 0.25, blocks: 0.53, jump: 0.23, jar: 0.509, candle: 0.506, race: 0.82 };

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
 * child's lamp on, its cushion puffed up with its ears pricked and the hourglass half run; the Wippe the fox child's side
 * in the sun, its seat on its way down with the chick walking over to it; the Kugelbahn the fox child's strip lit, a
 * marble in its cup and the next one halfway down the run to the bear child's cup; the Rennstrecke the fox child's kart
 * – each with as many children as set (`kids`, two by default) and their names or photos (`players`).
 */
export const TimerCardArt = memo(function TimerCardArt({
  picture,
  kids = DEFAULT_TIMER_SETTINGS.kids,
  players = DEFAULT_TIMER_SETTINGS.players,
}: {
  picture: TimerPicture;
  kids?: TurnCount;
  players?: Players;
}) {
  const children = TURN_CHILDREN.slice(0, kids);
  const firstLit = children.map((_, i) => i === 0);
  const at = CARD_MS * (LATER[picture] ?? MIDDLE);
  const [startedAt] = useState(() => Date.now() - at);
  const card = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => holdAt(card.current, at), [at]);
  return (
    <span className="tm-card-art" aria-hidden ref={card}>
      {picture === "swap" ? (
        <span className="tm-stage">
          <SwapBackdrop kids={children} />
          <SwapLights count={kids} lit={firstLit} />
          <SwapCushions kids={children} lit={firstLit} players={players} />
          <SwapShades count={kids} lit={firstLit} />
          <SwapHourglass ms={CARD_MS} startedAt={startedAt + at} flip={false} waiting={false} glow={0} glass={swapPlaces(kids).glass} />
        </span>
      ) : picture === "seesaw" ? (
        <span className="tm-stage">
          <SeesawBackdrop />
          <SeesawSun kind="fox" on />
          <SwapShade from={SAW.x} to={STAGE_W} on />
          <SeesawStand />
          <Seesaw
            holder="fox"
            running
            first="fox"
            turnMs={CARD_MS}
            startedAt={startedAt + at}
            round={0}
            seats={{ fox: children[0], bear: children[1] }}
            players={players}
          />
        </span>
      ) : picture === "race" ? (
        <span className="tm-stage">
          <RaceScene
            kids={children}
            holder="fox"
            prev={null}
            turn={{ name: "tm-race-card", startedAt: startedAt + at, ms: CARD_MS, handover: false }}
            done={false}
            poke={0}
            elapsed={at}
            quiet
            players={players}
          />
        </span>
      ) : picture === "marblerun" ? (
        <span className="tm-stage">
          <MarbleScene
            kids={children}
            lit={firstLit}
            held={children.map((_, i) => (i === 0 ? MARBLE_COLORS[0] : null))}
            open={1}
            rolling={{ name: `tm-mr-card-${kids}`, to: 1, startedAt: startedAt + at, ms: CARD_MS, color: MARBLE_COLORS[1] }}
            poke={0}
            quiet
            players={players}
          />
        </span>
      ) : (
        <span className="tm-stage" style={stageStyle(picture, CARD_MS)}>
          <SceneParts picture={picture} phase="running" total={CARD_MS} set={CARD_MS} poke={0} startedAt={startedAt} still />
        </span>
      )}
    </span>
  );
});
