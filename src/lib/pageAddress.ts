import { languagePrefix, type SeoLanguage, splitLanguage } from "@/content/seo";
import { BASE_URL } from "@/lib/buildInfo";

// The language the address of this visit is in: German pages have the plain address (/zaehne/), the pages for
// search engines in other languages a prefix (/en/zaehne/, src/content/seo.ts). The router runs below that prefix,
// so every link inside the app stays in the same language's pages and the routes need no change.

const base = BASE_URL.replace(/\/$/, "");

/** The address's language and the rest of it, without base path and language prefix. */
function current() {
  const pathname = typeof location === "undefined" ? "/" : location.pathname;
  return splitLanguage(pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname);
}

/** The language of the address the visit is on: English under /en/, else German. */
export const addressLanguage = (): SeoLanguage => current().language;

/** Where the router's addresses start: the base path and, for a page in another language, its prefix. */
export const routerBase = () => `${base}${languagePrefix(addressLanguage())}` || "/";

/** The full address of `path` (from the router) in the address's language, for canonical links. */
export const addressOf = (path: string) => new URL(`${routerBase().replace(/\/$/, "")}${path}`, location.origin).href;
