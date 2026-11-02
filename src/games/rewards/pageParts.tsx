import { type ReactNode, useEffect, useState } from "react";
import type { Localized } from "@/lib/language";

// Parts the page and the wizard share, for the Belohnungstafel and the Tagesplan alike.

/** „🖨️ Drucken“: the button on top and the print panel's heading. */
export const PRINT: Localized = { de: "Drucken", en: "Print", zh: "打印", hi: "प्रिंट", es: "Imprimir", ar: "طباعة", ru: "Печать" };

/** The field for the child's name, which goes into the heading. */
export const CHILD_NAME: Localized = {
  de: "Name des Kindes (steht in der Überschrift, bleibt auf diesem Gerät)",
  en: "Child’s name (goes in the heading, stays on this device)",
  zh: "孩子的名字（显示在标题里，只保存在本设备上）",
  hi: "बच्चे का नाम (शीर्षक में आता है, इसी डिवाइस पर रहता है)",
  es: "Nombre (aparece en el título y se queda en este dispositivo)",
  ar: "اسم الطفل (يظهر في العنوان ويبقى على هذا الجهاز)",
  ru: "Имя ребёнка (будет в заголовке, хранится только на этом устройстве)",
};
/** An example name in the field, a common one in each language. */
export const NAME_EXAMPLE: Localized = {
  de: "z. B. Lena",
  en: "e.g. Emma",
  zh: "例如：小雨",
  hi: "जैसे, अनु",
  es: "p. ej., Lucía",
  ar: "مثلًا: ليلى",
  ru: "например, Лена",
};

/** Grown-ups on a computer, with room to scroll: the same limit as the fixed back link (`playing.css`). */
const COMPUTER = "(min-width: 900px) and (any-pointer: fine)";

/** Whether this is a computer with a mouse and a wide window; follows the window as it changes. */
export function useComputer() {
  const [computer, setComputer] = useState(() => matchMedia(COMPUTER).matches);
  useEffect(() => {
    const query = matchMedia(COMPUTER);
    const change = () => setComputer(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return computer;
}

/** A button on top that opens (or, on a computer, scrolls to) a panel for grown-ups. */
export function PanelButton({ open, onClick, emoji, label }: { open: boolean; onClick: () => void; emoji: string; label: string }) {
  return (
    <button type="button" className="panel-button" aria-expanded={open} onClick={onClick}>
      <span aria-hidden>{emoji}</span> {label}
    </button>
  );
}

/**
 * A choice in the wizard shown as what it makes: a picture of the result (or a big emoji) and its name – the picture
 * says the rest, so a grown-up sees what they decide on, as with the Vorlagen.
 */
export function Pick({
  selected,
  onClick,
  emoji,
  label,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  /** A big emoji, or the catalogue's picture in its place (`ItemPic`). */
  emoji: ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button type="button" className={`rw-pick${selected ? " selected" : ""}`} aria-pressed={selected} disabled={disabled} onClick={onClick}>
      <span className="rw-pick-emoji" aria-hidden>
        {emoji}
      </span>
      <span className="rw-pick-label">{label}</span>
    </button>
  );
}
