import { useMemo } from "react";
import { type Figure, useFigure } from "@/lib/common";

// The menus' pictures of a game that draws the child (Kleine Abenteuer) show it as „Junge / Mädchen“ is chosen on the
// home page: `bun run previews` pictures such a game twice, the boy into `vorschau/` and the girl into
// `vorschau-maedchen/` beside it, under the same names. Only pictures cut from the games' own svg drawings get a
// girl's version – never a picture painted by Gemini, which would cost a second picture each (user decision,
// November 2026).

/** A folder of pictures by file name (`<id>.webp`), as a `?glob` import gives it. */
type Pictures = Readonly<Record<string, string>>;

/** `boy`'s pictures, with the girl's versions over them where there are some and the child is a girl. */
export const forFigure = (figure: Figure, boy: Pictures, girl: Pictures): Pictures => (figure === "girl" ? { ...boy, ...girl } : boy);

/** The pictures of a menu for the figure chosen on the home page (`forFigure`). */
export function useFigurePictures(boy: Pictures, girl: Pictures): Pictures {
  const figure = useFigure();
  return useMemo(() => forFigure(figure, boy, girl), [figure, boy, girl]);
}
