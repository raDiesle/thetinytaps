/** URL for a file in /public, respecting the GitHub Pages base path. */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${path}`;
}
