import { useEffect } from "react";

const SITE = "The Tiny Taps";

/** Sets the browser tab title; without a page title the site's default is used. */
export function useTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} – ${SITE}` : `${SITE} – Spiele für die Kleinsten`;
  }, [page]);
}
