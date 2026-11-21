import { useState } from "react";

/**
 * The play page's colour, changing with each letter, number or word: two screen-sized layers of one colour each, the
 * new one fading in over the one before by its opacity. A `background` transition on the page itself made the phone
 * paint and raster the whole screen, keys and all, in every frame of the fade – and with a new letter every ¼ s the
 * page was fading nearly all the time (`bun run perf buchstaben`, 54 screens a second against a budget of 30). A layer
 * of one plain colour needs no pixels rastered, and its fade runs on the compositor. The first colour shows at once,
 * so nothing moves before the child acts.
 */
export function PageColor({ color }: { color: string }) {
  const [layers, setLayers] = useState({ under: color, over: color, fade: false });
  // React's way to follow a prop into state during render: the colour seen until now goes under the new one.
  if (layers.over !== color) setLayers({ under: layers.over, over: color, fade: true });
  return (
    <>
      <div className="lp-color" style={{ background: layers.under }} aria-hidden="true" />
      <div key={layers.over} className={`lp-color${layers.fade ? " lp-color-in" : ""}`} style={{ background: layers.over }} aria-hidden="true" />
    </>
  );
}
