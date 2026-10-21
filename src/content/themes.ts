import type { ThemeId } from "./types";

/** Items matching the theme, or all items if none match (e.g. no animal starts with J). */
export function inTheme<T extends { theme?: ThemeId }>(items: T[], theme: "all" | ThemeId): T[] {
  if (theme === "all") return items;
  const matching = items.filter((item) => item.theme === theme);
  return matching.length > 0 ? matching : items;
}
