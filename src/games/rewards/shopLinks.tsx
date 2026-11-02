import type { ReactNode } from "react";
import { useAppLanguage } from "@/lib/language";

/** Reward stickers for the printed board's stars, as an example to buy (the user's pick, November 2026). */
export const STICKER_EXAMPLE = "https://www.amazon.de/dp/B0FN3HCT7Y";
/** Self-adhesive Velcro dots for the picture cards, as an example to buy (the user's pick: a search, so it never runs out). */
export const VELCRO_EXAMPLE = "https://www.amazon.de/s?k=klettpunkte+selbstklebend";

/** The examples are German shops' pages: only German screens link to them. */
const SHOP_LANGUAGE = "de";

/**
 * A link to an example to buy, after a print instruction that names the thing („Aufkleber“, „Klettpunkte“). Its words
 * are German only, as it shows on German screens only; elsewhere it is nothing.
 */
export function ShopLink({ href, children }: { href: string; children: ReactNode }) {
  const { id: language } = useAppLanguage();
  if (language !== SHOP_LANGUAGE) return null;
  return (
    <>
      {" "}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </>
  );
}

/** „Klettpunkte gibt es zum Beispiel hier.“ – after every print instruction that names Velcro dots. */
export const VelcroLink = () => <ShopLink href={VELCRO_EXAMPLE}>Klettpunkte gibt es zum Beispiel hier.</ShopLink>;

/** „Belohnungssticker gibt es zum Beispiel hier.“ – after the print instruction that names stickers. */
export const StickerLink = () => <ShopLink href={STICKER_EXAMPLE}>Belohnungssticker gibt es zum Beispiel hier.</ShopLink>;
