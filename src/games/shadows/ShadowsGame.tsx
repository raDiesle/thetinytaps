import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { ShadowsPlay } from "./ShadowsPlay";
import { DEFAULT_SHADOWS_SETTINGS, SHADOWS_SETTINGS_KEY, type ChoiceCount, type ShadowTheme } from "./settings";
import "./shadows.css";

/** The game's name, on its start screen and in the browser tab. */
export const SHADOWS_TITLE: Localized = {
  de: "Schatten finden",
  ru: "Найди тень",
  en: "Find the Shadow",
  zh: "找影子",
  hi: "परछाईं ढूँढो",
  es: "Busca la sombra",
  ar: "أين الظل؟",
};

export function ShadowsGame() {
  const t = useT();
  const [settings, update] = useGameSettings(SHADOWS_SETTINGS_KEY, DEFAULT_SHADOWS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title={t(SHADOWS_TITLE)}
      emoji="👤"
      modes={[
        { id: "all", emoji: "🔀", title: t({ de: "Gemischt", ru: "Вперемешку", en: "Mixed", zh: "混合", hi: "मिले-जुले", es: "Mezclado", ar: "منوعة" }) },
        { id: "animals", emoji: "🐘", title: t({ de: "Tiere", ru: "Животные", en: "Animals", zh: "动物", hi: "जानवर", es: "Animales", ar: "حيوانات" }) },
        {
          id: "vehicles",
          emoji: "🚗",
          title: t({ de: "Fahrzeuge", ru: "Транспорт", en: "Vehicles", zh: "交通工具", hi: "गाड़ियाँ", es: "Vehículos", ar: "مركبات" }),
        },
        { id: "food", emoji: "🍌", title: t({ de: "Essen", ru: "Еда", en: "Food", zh: "食物", hi: "खाना", es: "Comida", ar: "طعام" }) },
        { id: "things", emoji: "☂️", title: t({ de: "Dinge", ru: "Вещи", en: "Things", zh: "东西", hi: "चीज़ें", es: "Cosas", ar: "أشياء" }) },
      ]}
      mode={settings.theme}
      onMode={(theme) => update({ theme: theme as ShadowTheme })}
      level={
        <Choice<ChoiceCount>
          label={t({ de: "Zur Auswahl", ru: "На выбор", en: "To choose from", zh: "可选数量", hi: "चुनने के लिए", es: "Para elegir", ar: "للاختيار" })}
          value={settings.choices}
          onChange={(choices) => update({ choices })}
          options={[
            { value: "2", label: t({ de: "2 Bilder", ru: "2 картинки", en: "2 pictures", zh: "2 张图", hi: "2 तस्वीरें", es: "2 imágenes", ar: "صورتان" }) },
            { value: "3", label: t({ de: "3 Bilder", ru: "3 картинки", en: "3 pictures", zh: "3 张图", hi: "3 तस्वीरें", es: "3 imágenes", ar: "3 صور" }) },
            { value: "4", label: t({ de: "4 Bilder", ru: "4 картинки", en: "4 pictures", zh: "4 张图", hi: "4 तस्वीरें", es: "4 imágenes", ar: "4 صور" }) },
          ]}
        />
      }
      info={
        <>
          <p>
            {t({
              de: "Ein Bild sucht seinen Schatten unter zwei bis vier schwarzen. Das Kind tippt auf den passenden Schatten oder zieht das Bild darauf. Ein anderer Schatten zeigt kurz seine Farben: „Das ist die Giraffe.“",
              ru: "Картинка ищет свою тень среди двух–четырёх чёрных. Ребёнок нажимает на подходящую тень или перетаскивает на неё картинку. Другая тень ненадолго показывает свои цвета: «Это жираф».",
              en: "A picture looks for its shadow among two to four black ones. The child taps the right shadow or drags the picture onto it. Another shadow shows its colors for a moment: “That's the giraffe.”",
              zh: "一张图在两到四个黑影中找自己的影子。孩子点一下对的影子，或者把图拖到影子上。点了别的影子，它会短暂显出颜色：“这是长颈鹿。”",
              hi: "एक तस्वीर दो से चार काली परछाइयों में अपनी परछाईं ढूँढती है। बच्चा सही परछाईं को छूता है या तस्वीर को उस पर खींचता है। दूसरी परछाईं थोड़ी देर के लिए अपने रंग दिखाती है: “यह जिराफ़ है।”",
              es: "Una imagen busca su sombra entre dos y cuatro sombras negras. Su peque toca la sombra que corresponde o arrastra la imagen encima. Otra sombra muestra un momento sus colores: «Es la jirafa».",
              ar: "تبحث صورة عن ظلها بين ظلين وأربعة ظلال سوداء. يلمس الطفل الظل المناسب أو يسحب الصورة إليه. والظل الآخر يظهر ألوانه لحظة: «هذه هي الزرافة».",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Mit der Tastatur: Pfeiltasten wählen ein Bild, Leertaste oder Enter nimmt es, 1–4 direkt.",
                ru: "С клавиатуры: стрелки выбирают картинку, пробел или Enter берёт её, 1–4 – сразу.",
                en: "With the keyboard: the arrow keys pick a picture, Space or Enter takes it, 1–4 directly.",
                zh: "用键盘：方向键选图，空格或回车键确定，也可以直接按 1–4。",
                hi: "कीबोर्ड से: तीर वाली कुंजियाँ तस्वीर चुनती हैं, स्पेस या एंटर उसे लेता है, 1–4 सीधे।",
                es: "Con el teclado: las flechas eligen una imagen, Espacio o Intro la toma, 1–4 directamente.",
                ar: "بلوحة المفاتيح: تختار مفاتيح الأسهم صورة، ومفتاح المسافة أو الإدخال يأخذها، و1–4 مباشرة.",
              })}
            </p>
          )}
        </>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Anzeige", ru: "Отображение", en: "Display", zh: "显示", hi: "दिखावट", es: "Visualización", ar: "العرض" })}>
            <Toggle
              label={t({
                de: "Namen zeigen (Elefant, Auto …)",
                ru: "Показывать названия (слон, машина …)",
                en: "Show names (elephant, car …)",
                zh: "显示名称（大象、汽车……）",
                hi: "नाम दिखाएँ (हाथी, कार …)",
                es: "Mostrar nombres (elefante, auto…)",
                ar: "إظهار الأسماء (فيل، سيارة …)",
              })}
              checked={settings.names}
              onChange={(names) => update({ names })}
            />
          </SettingsGroup>

          <SettingsGroup title={t({ de: "Verhalten", ru: "Поведение", en: "Behavior", zh: "操作", hi: "व्यवहार", es: "Comportamiento", ar: "السلوك" })}>
            <Toggle
              label={t({
                de: "Schatten antippen reicht (sonst muss man das Bild ziehen)",
                ru: "Достаточно нажать на тень (иначе нужно перетащить картинку)",
                en: "Tapping the shadow is enough (otherwise drag the picture)",
                zh: "点一下影子就行（否则需要拖动图片）",
                hi: "परछाईं को छूना काफ़ी है (नहीं तो तस्वीर खींचनी पड़ती है)",
                es: "Basta con tocar la sombra (si no, hay que arrastrar la imagen)",
                ar: "لمس الظل يكفي (وإلا يجب سحب الصورة)",
              })}
              checked={settings.tap}
              onChange={(tap) => update({ tap })}
            />
          </SettingsGroup>
        </>
      }
    >
      <ShadowsPlay settings={settings} />
    </GameShell>
  );
}
