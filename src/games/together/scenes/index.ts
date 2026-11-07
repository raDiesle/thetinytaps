import type { SceneSpec } from "../scene";
import { SCENES as bad } from "./bad";
import { SCENES as kueche } from "./kueche";
import { SCENES as zuhause } from "./zuhause";
import { SCENES as kleidung } from "./kleidung";
import { SCENES as kita } from "./kita";
import { SCENES as spielen } from "./spielen";
import { SCENES as garten } from "./garten";
import { SCENES as wetter } from "./wetter";
import { SCENES as unterwegs } from "./unterwegs";
import { SCENES as feste } from "./feste";
import { SCENES as berufe } from "./berufe";
import { SCENES as sport } from "./sport";
import { SCENES as fantasie } from "./fantasie";

// Every pair written as data, topic by topic (topics.ts). One file per topic, so each can grow on its own.

/** All scenes, in the topics' order. */
export const SCENES: SceneSpec[] = [
  ...bad,
  ...kueche,
  ...zuhause,
  ...kleidung,
  ...kita,
  ...spielen,
  ...garten,
  ...wetter,
  ...unterwegs,
  ...feste,
  ...berufe,
  ...sport,
  ...fantasie,
];
