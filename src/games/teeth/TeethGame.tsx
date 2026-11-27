import { useEffect } from "react";
import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useAppLanguage, useT } from "@/lib/language";
import { preloadSong, SUNG_LANGUAGES } from "./music";
import { DEFAULT_TEETH_SETTINGS, TEETH_SETTINGS_KEY } from "./settings";
import { sungLanguageFor } from "./sung";
import { type TeethSymbol, teethSymbol } from "./symbols";
import { TeethPlay } from "./TeethPlay";

/** The bar's own picture of a phase beside its switch, so grown-ups find the same phases as on the bar. */
const PhaseIcon = ({ name }: { name: TeethSymbol }) => {
  const src = teethSymbol(name);
  return src ? <img className="teeth-option-symbol" src={src} alt="" draggable={false} aria-hidden /> : null;
};

export function TeethGame() {
  const [settings, update] = useGameSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);
  const t = useT();
  const language = useAppLanguage();
  // The song loads from the moment the game is chosen, while the story and the sink play.
  useEffect(() => preloadSong(sungLanguageFor(language.id, SUNG_LANGUAGES)), [language.id]);

  return (
    <GameShell
      title={t({ de: "Zähne putzen", en: "Brushing Teeth", zh: "刷牙", hi: "दाँत साफ़ करना", es: "Lavarse los dientes", ar: "تنظيف الأسنان", ru: "Чистим зубы" })}
      // Nothing to choose first: the book on the shelf starts the brushing at once (a start screen with only „Los geht’s!“
      // is no menu), and the few options are changed while playing (⚙️ held on the strip beside the progress bar).
      startMode="play"
    >
      <TeethPlay
        settings={settings}
        // Behind ⚙️ on the strip beside the progress bar (user request, November 2026): which phases of the bar are shown,
        // kept for every brushing. The brushing to the song always stays.
        options={
          <>
            <SettingsGroup
              title={t({
                en: "What is shown",
                de: "Was gezeigt wird",
                zh: "显示哪些部分",
                hi: "क्या दिखाया जाए",
                es: "Qué se muestra",
                ar: "ما يُعرض",
                ru: "Что показывать",
              })}
            >
              <Toggle
                icon={<PhaseIcon name="bonbon" />}
                label={t({
                  en: "Eating sweets: where the sugar monsters come from",
                  de: "Süßes essen: woher die Zuckermonster kommen",
                  zh: "吃甜食：糖怪兽从哪里来",
                  hi: "मीठा खाना: चीनी-मॉन्स्टर कहाँ से आते हैं",
                  es: "Comer dulces: de dónde vienen los monstruos de azúcar",
                  ar: "أكل الحلوى: من أين تأتي وحوش السكر",
                  ru: "Едим сладкое: откуда берутся сахарные монстры",
                })}
                checked={settings.origin}
                onChange={(origin) => update({ origin })}
              />
              <Toggle
                icon={<PhaseIcon name="zahnpasta" />}
                label={t({
                  en: "Getting the brush and toothpaste",
                  de: "Zahnbürste holen, Zahnpasta drauf",
                  zh: "拿牙刷，挤牙膏",
                  hi: "टूथब्रश लेना, टूथपेस्ट लगाना",
                  es: "Tomar el cepillo y ponerle pasta",
                  ar: "إحضار الفرشاة ووضع المعجون",
                  ru: "Берём щётку и пасту",
                })}
                checked={settings.prep}
                onChange={(prep) => update({ prep })}
              />
              <Toggle
                icon={<PhaseIcon name="zahn" />}
                label={t({
                  en: "Brushing to the song – always",
                  de: "Putzen mit dem Lied – immer",
                  zh: "跟着歌刷牙——一直都有",
                  hi: "गाने के साथ ब्रश – हमेशा",
                  es: "Cepillar con la canción: siempre",
                  ar: "التنظيف مع الأغنية – دائمًا",
                  ru: "Чистка под песенку – всегда",
                })}
                checked
                locked
                onChange={() => {}}
              />
              <Toggle
                icon={<PhaseIcon name="becher" />}
                label={t({
                  en: "Putting the brush away",
                  de: "Zahnbürste wegräumen",
                  zh: "把牙刷放回去",
                  hi: "टूथब्रश वापस रखना",
                  es: "Guardar el cepillo",
                  ar: "إعادة الفرشاة إلى مكانها",
                  ru: "Убираем щётку на место",
                })}
                checked={settings.tidy}
                onChange={(tidy) => update({ tidy })}
              />
              <p className="setting-note">
                {t({
                  en: "Kept for every brushing. While the song plays, everything stays: no step is left out. Changed before the brushing, it starts again.",
                  de: "Bleibt für jedes Putzen gemerkt. Solange das Lied läuft, bleibt alles: Kein Schritt fällt weg. Vor dem Putzen geändert, beginnt es von vorn.",
                  zh: "每次刷牙都会记住。歌在唱的时候，一切都保留，哪一步也不会少。刷牙前更改，会从头开始。",
                  hi: "हर बार के लिए याद रहता है। गाना चलते समय सब कुछ रहता है: कोई चरण नहीं छूटता। ब्रश शुरू होने से पहले बदलने पर यह फिर से शुरू होता है।",
                  es: "Se guarda para cada cepillado. Mientras suena la canción, todo se queda: no se salta ningún paso. Si se cambia antes del cepillado, empieza de nuevo.",
                  ar: "يُحفَظ لكل مرة تنظيف. وما دامت الأغنية تُعزف يبقى كل شيء: لا تُحذف أي خطوة. وإذا غيّرتم ذلك قبل التنظيف، يبدأ من جديد.",
                  ru: "Запоминается для каждой чистки. Пока звучит песенка, всё остаётся: ни один шаг не пропадает. Если изменить до чистки, всё начнётся сначала.",
                })}
              </p>
            </SettingsGroup>
            <SettingsGroup title={t({ de: "Putzen", en: "Brushing", zh: "刷牙", hi: "ब्रश करना", es: "Cepillado", ar: "التنظيف", ru: "Чистка" })}>
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
          </>
        }
      />
    </GameShell>
  );
}
