# Ampel und Zebrastreifen

Route `/ampel/` · idea N-40, in „Lebendige Stories“.

A street with a zebra crossing, a big light for walkers beside it and a small light for the cars on the far pavement. Every tap anywhere (and every key) presses the button: the cars' light goes amber, then red, and the walkers' light turns green – bear, duck, rabbit and pig walk over the zebra one after the other (it ticks while they walk), and the cars that came along wait at the stop line. The next tap turns it red: whoever hasn't set off stays, whoever is on the road hurries on, and the cars drive once the road is free. At the first red light and every third after it, the duck walks off anyway; the cars get green but wait for it, the bear waves and shows the red man in a bubble, the duck waddles back and looks left and right (tapping the duck calls it back at once). The duck can be turned off on the start screen. Tapping an animal makes it hop and call, tapping a car honks.
- `world.ts`: the street without drawing – phases of the light, where animals and cars are, how they move (`toggle`, `step`, `callDuck`, `busy`). Pure functions on plain objects; `traffic.test.ts` plays it through and checks that no car is ever on the zebra while an animal is on the road.
- `drawings.tsx`: street, both lights, the four animals, car and bus, all SVG. Animals and cars are drawn with their feet or wheels at y = 0.
- `TrafficPlay.tsx`: runs `step` in animation frames only while `busy()`, so the picture is still and silent between taps; turns events into sounds and (with „Vorlesen“) sentences from `content.ts`.
- The light changes at most once a second (`MIN_PHASE_MS`); a quicker tap only clicks the button.
- The street runs on `EDGE` units past the picture's sides for wide screens; cars appear and vanish out there.
- Development helper: `window.__traffic` is the live world (phase, animals, cars). Animation frames are throttled while the preview pane is hidden, so the game crawls there.
