import { LettersGame } from "@/games/letters/LettersGame";
import { type LettersWay, WAY_TITLES } from "@/games/letters/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** One of the three games of the book „Buchstaben & Zahlen“, with its name in the browser tab. */
function LettersWayPage({ way }: { way: LettersWay }) {
  const t = useT();
  useTitle(t(WAY_TITLES[way]));
  return <LettersGame key={way} way={way} />;
}

/** Frei tippen, at `/buchstaben/`. */
export const LettersPage = () => <LettersWayPage way="free" />;

/** Zählen, at `/zaehlen/`. */
export const CountingPage = () => <LettersWayPage way="count" />;

/** Wörter tippen, at `/woerter/`. */
export const WordsPage = () => <LettersWayPage way="words" />;
