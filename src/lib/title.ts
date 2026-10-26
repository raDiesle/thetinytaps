import { useEffect } from "react";
import { useT } from "@/lib/language";

const SITE = "The Tiny Taps";

/** Sets the browser tab title; without a page title the site's default is used. */
export function useTitle(page?: string) {
  const t = useT();
  const fallback = t({ de: "Spiele für die Kleinsten", ru: "Игры для самых маленьких" });
  useEffect(() => {
    document.title = page ? `${page} – ${SITE}` : `${SITE} – ${fallback}`;
  }, [page, fallback]);
}
