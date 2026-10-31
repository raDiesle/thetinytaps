import type { ReactNode } from "react";
import { useLocation } from "react-router";
import { useAppLanguage } from "@/lib/language";
import { seoWords } from "@/lib/seoText";

/**
 * Below the first screen of a menu, for grown-ups who scroll down: what the page is, in the words search
 * engines get (src/content/seo.ts), in the app language where it has them (German, English). Google reads
 * the page after the app has started, which replaces the built page's text, so without this a start screen
 * would say four words. `children` follow it (the home page's version and legal links).
 */
export function SeoText({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();
  const { id } = useAppLanguage();
  const words = seoWords(pathname, id);
  if (!words && !children) return null;
  return (
    <footer className="page-foot" data-below-fold>
      {words && (
        <section className="seo-text">
          <h2>{words.title}</h2>
          <p>{words.text}</p>
          <p>{words.promise}</p>
        </section>
      )}
      {children}
    </footer>
  );
}
