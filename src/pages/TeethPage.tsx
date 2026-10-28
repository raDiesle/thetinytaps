import { TeethGame } from "@/games/teeth/TeethGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function TeethPage() {
  useTitle(
    useT()({ de: "Zähne putzen", ru: "Чистим зубы", en: "Brushing Teeth", zh: "刷牙", hi: "दाँत साफ़ करना", es: "Lavarse los dientes", ar: "تنظيف الأسنان" }),
  );
  return <TeethGame />;
}
