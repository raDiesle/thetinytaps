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
  const fallback = t({
    de: "Spiele für die Kleinsten",
    ru: "Игры для самых маленьких",
    en: "Games for Little Ones",
    zh: "给小宝宝的游戏",
    hi: "नन्हे-मुन्नों के लिए खेल",
    es: "Juegos para los más pequeños",
    ar: "ألعاب للصغار",
  });
  useEffect(() => {
    const seo = id === "de" ? seoFor(pathname) : undefined;
    document.title = seo ? fullTitle(seo) : page ? `${page} – ${SITE_NAME}` : `${SITE_NAME} – ${fallback}`;
  }, [page, pathname, id, fallback]);
}
