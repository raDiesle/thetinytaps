import { useEffect } from "react";
import { useLocation } from "react-router";
import { NO_INDEX_PATHS, seoFor } from "@/content/seo";

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
 * start (rsbuild.config.ts). Google reads the page after it ran, so both must agree.
 */
export function SeoHead() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = seoFor(pathname);
    const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
    if (seo) {
      headTag<HTMLMetaElement>('meta[name="description"]', () => Object.assign(document.createElement("meta"), { name: "description" })).content =
        seo.description;
    }
    // A canonical link from the built page would point to another page now; only the matching one stays.
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (seo) {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const link = canonical ?? Object.assign(document.createElement("link"), { rel: "canonical" });
      link.href = new URL(`${base}${seo.path}`, location.origin).href;
      if (!canonical) document.head.append(link);
    } else canonical?.remove();
    const noIndex = NO_INDEX_PATHS.some((p) => path.endsWith(p));
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noIndex) headTag<HTMLMetaElement>('meta[name="robots"]', () => Object.assign(document.createElement("meta"), { name: "robots" })).content = "noindex";
    else robots?.remove();
  }, [pathname]);
  return null;
}
