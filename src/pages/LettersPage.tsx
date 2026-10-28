import { LettersGame } from "@/games/letters/LettersGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function LettersPage() {
  const t = useT();
  useTitle(
    t({
      de: "Buchstaben & Zahlen",
      ru: "Буквы и цифры",
      en: "Letters & Numbers",
      zh: "字母和数字",
      hi: "अक्षर और अंक",
      es: "Letras y números",
      ar: "الحروف والأرقام",
    }),
  );
  return <LettersGame />;
}
