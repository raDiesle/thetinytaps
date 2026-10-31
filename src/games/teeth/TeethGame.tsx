import { useEffect } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useAppLanguage, useT } from "@/lib/language";
import { preloadSong, SUNG_LANGUAGES } from "./music";
import { DEFAULT_TEETH_SETTINGS, type TeethSettings, TEETH_SETTINGS_KEY } from "./settings";
import { sungLanguageFor } from "./sung";
import { TeethPlay } from "./TeethPlay";

/** What is shown before the brushing, as one choice: the sweets story, the sink, both or neither. */
type Before = "both" | "origin" | "prep" | "none";

const BEFORE: Record<Before, Pick<TeethSettings, "origin" | "prep">> = {
  both: { origin: true, prep: true },
  origin: { origin: true, prep: false },
  prep: { origin: false, prep: true },
  none: { origin: false, prep: false },
};

const beforeOf = ({ origin, prep }: TeethSettings): Before => (origin ? (prep ? "both" : "origin") : prep ? "prep" : "none");

export function TeethGame() {
  const [settings, update] = useGameSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);
  const t = useT();
  const language = useAppLanguage();
  // The song loads from the moment the game is chosen, while the grown-up looks at this screen and the story plays.
  useEffect(() => preloadSong(sungLanguageFor(language.id, SUNG_LANGUAGES)), [language.id]);

  return (
    <GameShell
      title={t({ de: "Zähne putzen", en: "Brushing Teeth", zh: "刷牙", hi: "दाँत साफ़ करना", es: "Lavarse los dientes", ar: "تنظيف الأسنان", ru: "Чистим зубы" })}
      emoji="🦷"
      settings={
        <SettingsGroup title={t({ de: "Putzen", en: "Brushing", zh: "刷牙", hi: "ब्रश करना", es: "Cepillado", ar: "التنظيف", ru: "Чистка" })}>
          <Choice<Before>
            label={t({ de: "Vorher zeigen", en: "Show first", zh: "先播放", hi: "पहले दिखाएँ", es: "Mostrar antes", ar: "اعرضوا أولًا", ru: "Сначала показать" })}
            value={beforeOf(settings)}
            options={[
              {
                value: "both",
                label: t({
                  de: "🍬 + 🪥 Beides",
                  en: "🍬 + 🪥 Both",
                  zh: "🍬 + 🪥 都要",
                  hi: "🍬 + 🪥 दोनों",
                  es: "🍬 + 🪥 Las dos cosas",
                  ar: "🍬 + 🪥 كلاهما",
                  ru: "🍬 + 🪥 Всё вместе",
                }),
              },
              {
                value: "origin",
                label: t({
                  de: "🍬 Zuckermonster",
                  en: "🍬 Sugar monsters",
                  zh: "🍬 糖怪兽",
                  hi: "🍬 चीनी-मॉन्स्टर",
                  es: "🍬 Monstruos de azúcar",
                  ar: "🍬 وحوش السكر",
                  ru: "🍬 Сахарные монстры",
                }),
              },
              {
                value: "prep",
                label: t({
                  de: "🪥 Zahnpasta",
                  en: "🪥 Toothpaste",
                  zh: "🪥 牙膏",
                  hi: "🪥 टूथपेस्ट",
                  es: "🪥 Pasta de dientes",
                  ar: "🪥 معجون الأسنان",
                  ru: "🪥 Зубная паста",
                }),
              },
              {
                value: "none",
                label: t({
                  de: "⏩ Gleich putzen",
                  en: "⏩ Brush right away",
                  zh: "⏩ 直接刷牙",
                  hi: "⏩ सीधे ब्रश करें",
                  es: "⏩ Cepillar enseguida",
                  ar: "⏩ التنظيف فورًا",
                  ru: "⏩ Сразу чистить",
                }),
              },
            ]}
            onChange={(before) => update(BEFORE[before])}
          />
          <p className="setting-note">
            {t({
              de: "🍬 Wie Süßes zu Zuckermonstern wird. 🪥 Zahnbürste holen, Zahnpasta drauf.",
              en: "🍬 How sweets turn into sugar monsters. 🪥 Get the toothbrush, put toothpaste on.",
              zh: "🍬 甜食怎样变成糖怪兽。🪥 拿牙刷，挤牙膏。",
              hi: "🍬 मीठा कैसे चीनी-मॉन्स्टर बन जाता है। 🪥 टूथब्रश लेना, उस पर टूथपेस्ट लगाना।",
              es: "🍬 Cómo los dulces se convierten en monstruos de azúcar. 🪥 Tomar el cepillo y ponerle pasta.",
              ar: "🍬 كيف تتحوّل الحلوى إلى وحوش السكر. 🪥 إحضار فرشاة الأسنان ووضع المعجون عليها.",
              ru: "🍬 Как сладкое превращается в сахарных монстров. 🪥 Достаём щётку, выдавливаем пасту.",
            })}
          </p>
          <Toggle
            label={t({
              de: "⭐ Wochenbild: ein Stern für jedes Putzen",
              en: "⭐ Week chart: a star for every brushing",
              zh: "⭐ 每周星星：每刷一次得一颗星",
              hi: "⭐ हफ़्ते का चार्ट: हर ब्रश पर एक तारा",
              es: "⭐ Semana: una estrella por cada cepillado",
              ar: "⭐ لوحة الأسبوع: نجمة لكل تنظيف",
              ru: "⭐ Неделя: звёздочка за каждую чистку",
            })}
            checked={settings.week}
            onChange={(week) => update({ week })}
          />
          <p className="setting-note">
            {t({
              de: "🎵 Das Zahnputzlied singt zu jedem Schritt, was dran ist, in der Sprache der App (🌐 auf der Startseite). Das Putzen dauert so lange wie das Lied, gut 2 Minuten. Es spielt immer, auch wenn die Musik aus ist.",
              en: "🎵 The toothbrushing song sings what comes next at every step, in the app's language (🌐 on the home page). Brushing lasts as long as the song, a little over 2 minutes. It always plays, even when music is off.",
              zh: "🎵 刷牙歌在每一步唱出该刷哪里，用的是应用的语言（首页的 🌐）。刷牙和歌一样长，两分多钟。即使关了音乐，它也会播放。",
              hi: "🎵 ब्रश वाला गाना हर चरण पर गाता है कि अब क्या करना है, ऐप की भाषा में (मुख्य पेज पर 🌐)। ब्रश उतनी देर चलता है जितना गाना, 2 मिनट से थोड़ा ज़्यादा। संगीत बंद होने पर भी यह हमेशा बजता है।",
              es: "🎵 La canción del cepillado canta en cada paso lo que toca, en el idioma de la app (🌐 en la página de inicio). El cepillado dura lo que la canción, algo más de 2 minutos. Suena siempre, aunque la música esté apagada.",
              ar: "🎵 أغنية تنظيف الأسنان تغنّي في كل خطوة ما هو دوره الآن، بلغة التطبيق (🌐 في الصفحة الرئيسية). يدوم التنظيف بقدر الأغنية، أكثر من دقيقتين بقليل. وتُعزف دائمًا، حتى عندما تكون الموسيقى مطفأة.",
              ru: "🎵 Песенка на каждом шаге поёт, что сейчас чистим, на языке приложения (🌐 на главной странице). Чистка длится столько же, сколько песенка, — чуть больше 2 минут. Она звучит всегда, даже когда музыка выключена.",
            })}
          </p>
        </SettingsGroup>
      }
    >
      <TeethPlay settings={settings} />
    </GameShell>
  );
}
