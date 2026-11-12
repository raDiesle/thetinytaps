// Every level of a game has its own address (user request, November 2026): `/abenteuer/schatzinsel/`, not only
// `/abenteuer/`, so a link opens that very level, the phone's back button goes from a level to the game's start screen,
// and Umami, which counts pages by their address, tells the levels apart. The game's route takes the level as an
// optional last segment (`abenteuer/:level?` in App.tsx), so the start screen and its levels are one page that stays
// mounted, and `GameShell` keeps the address and the level played in step.

/** With a slash at the end, as every address of the app has. */
const withSlash = (pathname: string) => (pathname.endsWith("/") ? pathname : `${pathname}/`);

/** The game's own address, its start screen: the address shown without the level at its end. */
export function levelHome(pathname: string, level: string | undefined) {
  const path = withSlash(pathname);
  return level && path.endsWith(`/${level}/`) ? path.slice(0, path.length - level.length - 1) : path;
}

/** The address of one level of a game, below the game's own address. */
export const levelHref = (home: string, level: string) => `${withSlash(home)}${encodeURIComponent(level)}/`;
