import { useLocation } from "react-router";
import { useAppLanguage } from "@/lib/language";
import { seoWords } from "@/lib/seoText";

/**
 * Below the first screen of a menu, for grown-ups who scroll down: what the page is, in the words search
 * engines get (src/content/seo.ts), in the app language. Google reads
 * the page after the app has started, which replaces the built page's text, so without this a start screen
 * would say four words. The home page has its words behind the carving's „mehr …“ instead (RoomNotes).
 */
export function SeoText() {
  if (!useSeoWords()) return null;
  return (
    <footer className="page-foot" data-below-fold>
      <SeoWords />
    </footer>
  );
}

/** The page's words for search engines, in the app language where it has them. */
function useSeoWords() {
  const { pathname } = useLocation();
  const { id } = useAppLanguage();
  return seoWords(pathname, id);
}

/** What the page is, in the words search engines get, on a panel of its own: SeoText's, or the one behind the shelf's „mehr …“. */
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
