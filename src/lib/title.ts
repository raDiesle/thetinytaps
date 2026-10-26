import { useEffect } from "react";
import { useLocation } from "react-router";
import { fullTitle, SITE_NAME, seoFor } from "@/content/seo";

/**
 * Sets the browser tab title. A page with a search engine entry (src/content/seo.ts)
 * gets that title, the same Google got from the built page; otherwise the page title,
 * and without one the site's default.
 */
export function useTitle(page?: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = seoFor(pathname);
    document.title = seo ? fullTitle(seo) : page ? `${page} – ${SITE_NAME}` : `${SITE_NAME} – Spiele für die Kleinsten`;
  }, [page, pathname]);
}
