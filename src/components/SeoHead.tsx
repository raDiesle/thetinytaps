import { useEffect } from "react";
import { useLocation } from "react-router";
import { NO_INDEX_PATHS, seoFor } from "@/content/seo";
import { addressLanguage, addressOf } from "@/lib/pageAddress";
import { seoWords } from "@/lib/seoText";

/** The head tag with this name or rel, made when the built page has none (404.html, the dev server). */
function headTag<T extends HTMLElement>(selector: string, make: () => T) {
  let tag = document.head.querySelector<T>(selector);
  if (!tag) {
    tag = make();
    document.head.append(tag);
  }
  return tag;
}

/**
 * Keeps description, canonical link and robots tag of the head in step with the
 * address while the app moves between pages, as each built page has them from the
 * start (tools/build.ts). Google reads the page after it ran, so both must agree.
 * They follow the address's language (/en/ is English), as the built page does.
 */
export function SeoHead() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = seoFor(pathname);
    const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
    // Only there once the language's texts are loaded; until then the built page's description stays.
    const words = seoWords(pathname, addressLanguage());
    if (words) {
      headTag<HTMLMetaElement>('meta[name="description"]', () => Object.assign(document.createElement("meta"), { name: "description" })).content =
        words.description;
    }
    // A canonical link from the built page would point to another page now; only the matching one stays.
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (seo) {
      const link = canonical ?? Object.assign(document.createElement("link"), { rel: "canonical" });
      link.href = addressOf(seo.path);
      if (!canonical) document.head.append(link);
    } else canonical?.remove();
    const noIndex = NO_INDEX_PATHS.some((p) => path.endsWith(p));
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noIndex) headTag<HTMLMetaElement>('meta[name="robots"]', () => Object.assign(document.createElement("meta"), { name: "robots" })).content = "noindex";
    else robots?.remove();
  }, [pathname]);
  return null;
}
