// The structured data (JSON-LD) a built page carries in its head (tools/build.ts): what the site is on the home
// pages, and on every other page the way to it from the home page, which Google shows instead of the bare address.
// Kept apart from build.ts, which builds when imported, so src/structuredData.test.ts can check it.
import { categoryOf } from "../src/content/games";
import { type PageText, SEO_PAGES, SITE_NAME } from "../src/content/seo";

/** What a page's structured data is made from. */
export interface PageFacts {
  /** The page's address without the language's prefix ("/zaehne/"). */
  path: string;
  /** The language of the page ("de", "en" …). */
  language: string;
  /** The page's own texts in that language. */
  text: PageText;
  /** The title of another page (by its address) in that language. */
  titleOf: (path: string) => string;
  /** The full address of a page in that language. */
  urlOf: (path: string) => string;
}

const isPage = (path: string) => SEO_PAGES.some((page) => page.path === path);

/**
 * The pages on the way from the home page to `path`, itself last: its book's table of contents where the book has one
 * (none for a book of one game, nor for the Alltagshelfer, each a book of its own on the shelf), and for an address
 * below another page (a picture of Lebendige Bilder, `/bilder/zoo/`) that page before it.
 */
export function trailOf(path: string): string[] {
  if (path === "/") return ["/"];
  const book = categoryOf(path);
  const bookPath = book && `/spiele/${book.id}/`;
  const above = /^(\/[^/]+\/)[^/]+\/$/.exec(path)?.[1];
  return ["/", ...(bookPath && bookPath !== path ? [bookPath] : []), ...(above && above !== "/spiele/" && isPage(above) ? [above] : []), path];
}

/**
 * The structured data of a page, each one object for a `<script type="application/ld+json">`. Nothing in it names an
 * age the site is for (no `audience`, no `typicalAgeRange`): each family decides when its child starts with screens.
 */
export function structuredData({ path, language, text, titleOf, urlOf }: PageFacts): object[] {
  if (path === "/") {
    const url = urlOf(path);
    return [
      // The site's name in Google's results comes from WebSite; without it Google guesses from the domain.
      { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url, inLanguage: language },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: SITE_NAME,
        url,
        description: text.description,
        applicationCategory: "GameApplication",
        operatingSystem: "Web",
        inLanguage: language,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
    ];
  }
  // The home page is named by the site's name: its title is a sentence for the search result, no name of a place.
  const items = trailOf(path).map((step, i) => ({ "@type": "ListItem", position: i + 1, name: step === "/" ? SITE_NAME : titleOf(step), item: urlOf(step) }));
  return [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items }];
}

/** The structured data as tags for a page's head; `<` is written as its escape, so no text can end the script early. */
export const structuredDataTags = (page: PageFacts) =>
  structuredData(page).map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`);
