import { useEffect } from "react";
import { useLocation } from "react-router";
import { fullTitle, SITE_NAME, seoFor } from "@/content/seo";
import { useAppLanguage, useT } from "@/lib/language";

/**
 * Sets the browser tab title. A page with a search engine entry (src/content/seo.ts)
 * gets that title, the same Google got from the built page, while the app speaks German;
 * otherwise the page title (in the app language), and without one the site's default.
 */
export function useTitle(page?: string) {
  const { pathname } = useLocation();
  const { id } = useAppLanguage();
  const t = useT();
  const fallback = t({ de: "Spiele für die Kleinsten", ru: "Игры для самых маленьких" });
  useEffect(() => {
    const seo = id === "de" ? seoFor(pathname) : undefined;
    document.title = seo ? fullTitle(seo) : page ? `${page} – ${SITE_NAME}` : `${SITE_NAME} – ${fallback}`;
  }, [page, pathname, id, fallback]);
}
