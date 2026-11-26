// Every picture is drawn 1600 × 1000 (16 : 10), and a screen of another shape shows it whole (`meet`), with room left
// beside it (a phone on its side) or above and below it (a tablet). That room shows the picture's own background,
// mirrored at its edges, so the scene fills the whole screen with its sky, ground, walls and floor and never stands in
// a frame of plain colour (user feedback, November 2026). The items keep their places and size: they reach to every
// edge of the picture, so zooming in until the screen is full would cut some of them off.

/**
 * The transforms of the background's mirrored copies that a screen of `screenWidth` × `screenHeight` shows beside or
 * above and below a `width` × `height` picture: the left and right copies on a wider screen, the top and bottom ones on
 * a taller one, none where the shapes match.
 */
export function mirrorsFor(width: number, height: number, screenWidth: number, screenHeight: number): string[] {
  if (!screenWidth || !screenHeight) return [];
  const screen = screenWidth / screenHeight;
  const picture = width / height;
  if (Math.abs(screen - picture) < 0.01) return [];
  return screen > picture ? ["matrix(-1 0 0 1 0 0)", `matrix(-1 0 0 1 ${2 * width} 0)`] : ["matrix(1 0 0 -1 0 0)", `matrix(1 0 0 -1 0 ${2 * height})`];
}

/** A point of the mirrored room beyond the picture's edge, as the point of the picture it mirrors (its own inside). */
export function intoPicture(x: number, y: number, width: number, height: number): [number, number] {
  const fold = (v: number, size: number) => (v < 0 ? Math.min(size, -v) : v > size ? Math.max(0, 2 * size - v) : v);
  return [fold(x, width), fold(y, height)];
}
