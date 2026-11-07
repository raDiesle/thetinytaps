import type { ReactNode } from "react";
import { HOME_BACKDROPS } from "./home";
import { OUTSIDE_BACKDROPS } from "./outside";
import { WORK_BACKDROPS } from "./work";

// The backdrops of "Was gehört zusammen?": where a thing or a helper is, drawn once and standing still behind it,
// so a child sees what it is about (a door in a house front, the hairdresser's mirror and chair). Each draws the
// picture's whole 300 × 200 box (`BOX_W`, `BOX_H` in scene.tsx) as SVG in the app's picture-book style:
// - a plum-brown line (#5a4636, 2.5–3.5 wide), soft flat colours, a little shade, no gradients needed;
// - calm and a little paler than what stands in front, so the thing in the middle stands out;
// - the middle (x 90–210, y 40–170) stays quiet – a plain wall, sky or floor – for the thing above (`THING_SPOT`,
//   its middle at 150, 112, 104 big) and, for helpers, the helper on the left (x 4–116) and what it works on at the
//   right (`TARGET_SPOT`, 222, 132, 84 big);
// - the floor or ground meets the wall or sky at about y 150–168;
// - no words or letters, no people, no fox or bear (they come in front), and never a thing a child could pick as
//   the answer in any round (no key, no scissors, no ball, no plate): only what tells the place.

/** The id of a backdrop. */
export type BackdropId =
  // At home (home.tsx)
  | "bad" // bathroom: tiles, a mirror at one side, the edge of a washbasin or bathtub, a towel on a hook
  | "kueche" // kitchen: tiles, a worktop along the bottom, a stove or oven at one side, a shelf with jars, a window
  | "esstisch" // dining room: wallpaper, a window, a table top along the bottom that things stand on
  | "wohnzimmer" // living room: a sofa at one side, a standard lamp, a picture frame, a rug
  | "schlafzimmer" // bedroom: a bed with a blanket at one side, a bedside table, a window with curtains
  | "kinderzimmer" // children's room: a toy shelf, a colourful rug, a garland of little flags, a window
  | "flur" // hallway: coat hooks with a jacket, a shoe rack, the frame of the front door at one side
  | "hausfront" // a house front: the wall, a window left and right, the roof's edge above, steps below
  | "maltisch" // a painting table: a wooden table top along the bottom, a wall with children's drawings (shapes only)
  | "fensterbank" // a windowsill: a big window with sky and a tree outside, the sill along the bottom
  | "werkstatt" // a workshop: a wooden workbench along the bottom, a plain pegboard wall, a lamp
  | "schule" // a Kita or classroom: a blank board, little chairs and a table, a shelf
  // Outside (outside.tsx)
  | "garten" // garden: sky, a wooden fence, grass, flower beds at the sides, a shrub
  | "wiese" // meadow in spring: sky with a cloud, green hills, a tree, little flowers
  | "wald" // forest: trees at the sides, a path, ferns and mushrooms (only in the grass at the edges)
  | "strasse" // town street: houses at the back, a pavement, the road, a street lamp
  | "spielplatz" // playground: a slide at one side, a swing frame at the other, sand
  | "strand" // beach in summer: sea, sand, the sun, a dune with grass
  | "schnee" // winter: snowy ground and trees, a pale sky with falling snow standing still
  | "regen" // rainy day: grey clouds, rain lines standing still, puddles on a path
  | "herbst" // autumn: trees in orange and red, leaves on the ground, a pale sky
  | "bauernhof" // farm: a red barn, a fence, a field, a silo
  | "baustelle" // building site: a fence of red and white, a sand heap, a half-built wall, a crane far back
  | "berg" // mountains: peaks with snow, a meadow in front, a path
  | "unterwasser" // under water: blue water, sand, seaweed, bubbles, a rock
  | "weltraum" // space: a dark blue sky with stars, a planet with a ring, the moon's grey ground below
  | "nacht" // evening outside: a dark blue sky, the moon and stars, the dark garden and a house with a lit window
  | "abend" // dusk: a dark blue sky with a pale band low down, dark hills, a house with a lit window – no moon, no stars
  // Places of work and play (work.tsx)
  | "praxis" // doctor's room: an examination couch, a chart of shapes on the wall, a cabinet with a red cross
  | "salon" // hairdresser's: a big mirror on the wall at the right, a shelf with bottles, a tiled floor
  | "baeckerei" // bakery: a counter, shelves with flour sacks and cake stands, a big oven at the back
  | "feuer" // a fire call: a street with a house, a red fire engine at the left side, the sky a little smoky
  | "post" // post: a street with a yellow German letter box at the right and a yellow bicycle with a bag leaning at the left
  | "laden" // shop: shelves with boxes and tins, a counter with a till
  | "bahnhof" // railway station: a platform with a roof, rails, a clock on a post
  | "flughafen" // airport: a runway, the control tower, a big window, the sky
  | "hafen" // harbour: water, a wooden pier, a lighthouse, gulls far off
  | "buehne" // stage: red curtains at the sides, a wooden floor, spotlights
  | "sportplatz" // sports ground: green grass with white lines, stands at the back, the sky
  | "schwimmbad" // swimming pool: blue water with lane ropes, tiles, a ladder at the side
  | "eisbahn" // ice rink: smooth light-blue ice, a low wall round it, snowy trees behind
  | "zirkus" // circus: a ring with red and white tent stripes, a round podium edge, lights
  | "schloss" // castle: grey towers with flags, a drawbridge, green hills
  | "party" // birthday party: garlands of flags, a table with a cloth, a festive wall (no balloons, no cake)
  | "gemuesebeet" // vegetable garden: rows of soil with small green shoots, a shed, a fence
  | "landstrasse" // country road: hills and fields far back, a tree at each side, the road with its dashed line
  | "krankenhaus" // hospital room: a window, a curtain, a bed with its pillow at the right, a bedside table
  | "apotheke" // chemist's: shelves of little drawers and bottles, a counter at the right
  | "pizzeria" // pizzeria: tiles, a shelf with jars, the round brick oven with the fire in its mouth at the right
  | "cafe" // café: a window, lamps hanging, a little round table with its cloth at the right (no cups, no cake)
  | "bergwerk" // mine: rock walls, a wooden frame holding the roof, rails going back, a rock at the right
  | "dach" // up on the roofs: roofs far off, a flat roof to stand on, a tall brick chimney at the right
  | "renovieren"; // a room being painted: the old wall, the fresh blue at the right, a sheet and a tin of paint on the floor

/** Every backdrop's drawing, in the 300 × 200 box. */
export const BACKDROPS: Record<BackdropId, () => ReactNode> = { ...HOME_BACKDROPS, ...OUTSIDE_BACKDROPS, ...WORK_BACKDROPS };
