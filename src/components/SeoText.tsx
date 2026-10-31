import type { ReactNode } from "react";
import { useLocation } from "react-router";
import { useAppLanguage } from "@/lib/language";
import { seoWords } from "@/lib/seoText";

/**
 * Below the first screen of a menu, for grown-ups who scroll down: what the page is, in the words search
 * engines get (src/content/seo.ts), in the app language where it has them (German, English). Google reads
 * the page after the app has started, which replaces the built page's text, so without this a start screen
 * would say four words. `children` follow it (the home page's version and legal links). Without `words` only the
 * children: the book look's home page has its words in a little book in the shelf instead (RoomNotes).
 */
export function SeoText({ children, words = true }: { children?: ReactNode; words?: boolean }) {
  const shown = useSeoWords();
  if (!(words && shown) && !children) return null;
  return (
    <footer className="page-foot" data-below-fold>
      {words && <SeoWords />}
      {children}
    </footer>
  );
}

/** The page's words for search engines, in the app language where it has them. */
function useSeoWords() {
  const { pathname } = useLocation();
  const { id } = useAppLanguage();
  return seoWords(pathname, id);
}

/** What the page is, in the words search engines get, on a panel of its own: SeoText's, or the shelf's little book's. */
export function SeoWords() {
  const words = useSeoWords();
  if (!words) return null;
  return (
    <section className="seo-text">
      <h2>{words.title}</h2>
      <p>{words.text}</p>
      <p>{words.promise}</p>
    </section>
  );
}
