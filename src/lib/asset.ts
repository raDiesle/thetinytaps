import { BASE_URL } from "@/lib/buildInfo";
/** URL for a file in /public, respecting the GitHub Pages base path. */
export function asset(path: string) {
  return `${BASE_URL.replace(/\/$/, "")}/${path}`;
}
