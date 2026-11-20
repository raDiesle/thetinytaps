// The types of "Was wird aus mir?"'s small ones, apart so growthList.tsx and growth.tsx can both name them without a cycle.
import type { ReactNode } from "react";

export type GrowthId =
  | "raupe"
  | "ei"
  | "samen"
  | "kaulquappe"
  | "eichel"
  | "zwiebel"
  | "kuerbiskern"
  | "kokosnuss"
  | "knospe"
  | "schildkroetenei"
  | "krokodilei"
  | "dinoei"
  | "pinguinei"
  | "schlangenei"
  | "fischei"
  | "larve"
  | "karottensamen"
  | "maiskorn"
  | "schirmchen"
  | "erdbeersamen";

export interface Growth {
  id: GrowthId;
  /** The small one's German name, for screen readers: "Raupe". */
  young: string;
  /** With its article after „aus“, „der Raupe“, for "Was wird aus der Raupe?". */
  fromThe: string;
  /** What it becomes, as on the plates. */
  emoji: string;
  /** Its German name, for screen readers: "Schmetterling". */
  adult: string;
  /** With its article, „der Schmetterling“, for "Der Schmetterling kommt aus der Raupe!". */
  the: string;
  /** With „ein“, „ein Schmetterling“, for "Aus der Raupe wird ein Schmetterling.". */
  a: string;
  /** A plant: alike to every other plant for a child (`GROW_LOOKALIKES`), so never dealt with one. */
  plant?: true;
  /** Where what it becomes stands at the end, in the box's units (its middle), and how wide, as a share of the box. */
  spot: [number, number];
  size: number;
  /** The sounds while it becomes it, each after so many ms of growing. */
  sounds: [number, () => void][];
  back: ReactNode;
  front?: ReactNode;
}
