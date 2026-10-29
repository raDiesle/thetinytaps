import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { GAME_TITLE, LEVEL_TEXTS } from "./content";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevel } from "./settings";

/** The mode cards in menu order, one per level; „Weiter“ at a level's end goes on with the next. */
const MODES: { id: MarbleLevel; emoji: string }[] = [
  { id: "track", emoji: "🎢" },
  { id: "machine", emoji: "⚙️" },
  { id: "sneeze", emoji: "🤧" },
  { id: "kitchen", emoji: "🍳" },
  { id: "garden", emoji: "🌻" },
  { id: "pegs", emoji: "📍" },
  { id: "topple", emoji: "📚" },
  { id: "building", emoji: "🚧" },
  { id: "water", emoji: "🦆" },
  { id: "circus", emoji: "🎪" },
  { id: "space", emoji: "🚀" },
  { id: "light", emoji: "🔦" },
  { id: "bath", emoji: "🛁" },
  { id: "farm", emoji: "🐓" },
  { id: "night", emoji: "🌙" },
  { id: "tidy", emoji: "🧸" },
];

export function MarbleGame() {
  const t = useT();
  const [settings, update] = useGameSettings(MARBLE_SETTINGS_KEY, DEFAULT_MARBLE_SETTINGS);
  // Older saves may hold a choice that is gone ("all", "both", "machines"): those begin with the first level.
  const mode = MODES.some((m) => m.id === settings.levels) ? settings.levels : MODES[0].id;
  const modes = MODES.map((m) => ({ ...m, title: t(LEVEL_TEXTS[m.id].name) }));

  return (
    <GameShell
      title={t(GAME_TITLE)}
      emoji="🎳"
      modes={modes}
      mode={mode}
      onMode={(levels) => update({ levels: levels as MarbleLevel })}
      info={
        <p>
          {t({
            de: "Ein Tipp, und dann stößt eins das nächste an: Jedes Level läuft bis zum Ende, und das Bild fährt mit. Auf der Klingenden Kugelbahn rollen die Kugeln über Xylophon, Wippe, Looping, Trommeln und Klangröhren bis in den Korb.",
            en: "One tap, and then one thing pushes the next: every level runs to the end, and the picture moves along. On the Ringing Marble Run the marbles roll over a xylophone, a seesaw, a loop, drums and chimes into the basket.",
            zh: "点一下，然后一个推动下一个：每一关都会一直运行到结束，画面也跟着移动。在“叮当弹珠轨道”里，弹珠滚过木琴、跷跷板、环形轨道、鼓和风铃，一直滚进篮子里。",
            hi: "एक टैप, और फिर एक चीज़ अगली को धक्का देती है: हर लेवल अंत तक चलता है, और तस्वीर साथ-साथ चलती है। “बजते कंचों का रास्ता” में कंचे ज़ाइलोफ़ोन, सी-सॉ, लूप, ढोल और घंटियों पर से लुढ़कते हुए टोकरी में पहुँचते हैं।",
            es: "Un toque, y luego una cosa empuja a la siguiente: cada nivel sigue hasta el final y la imagen lo acompaña. En «Canicas musicales» las canicas ruedan por un xilófono, un balancín, un rizo, tambores y campanillas hasta la cesta.",
            ar: "لمسة واحدة، ثم يدفع كل شيء الذي يليه: كل مستوى يستمر حتى النهاية، والصورة تتحرّك معه. في «مسار الكرات الرنّانة» تتدحرج الكرات فوق إكسيليفون وأرجوحة وحلقة وطبول وأجراس أنبوبية حتى السلة.",
            ru: "Одно касание — и одно толкает другое: каждый уровень идёт до конца, а картинка едет следом. В «Звонких шариках» шарики катятся по ксилофону, качелям, мёртвой петле, барабанам и колокольчикам прямо в корзину.",
          })}
        </p>
      }
      settings={
        <>
          <SettingsGroup
            title={t({
              de: "Kugelbahn: Was rollt denn da?",
              en: "Marble Run: What's rolling there?",
              zh: "叮当弹珠轨道：滚的是什么？",
              hi: "बजते कंचे: वहाँ क्या लुढ़क रहा है?",
              es: "Canicas musicales: ¿qué rueda ahí?",
              ar: "مسار الكرات: ما الذي يتدحرج هناك؟",
              ru: "Звонкие шарики: что там катится?",
            })}
          >
            <Toggle
              label={t({
                de: "Oben liegen drei Dinge zur Wahl, ein Tipp lässt genau dieses los",
                en: "Three things to choose from lie at the top; a tap lets exactly that one go",
                zh: "上面有三样东西可选，点哪个就放哪个",
                hi: "ऊपर चुनने के लिए तीन चीज़ें हैं, टैप करने पर ठीक वही छूटती है",
                es: "Arriba hay tres cosas para elegir; un toque suelta justo esa",
                ar: "في الأعلى ثلاثة أشياء للاختيار، واللمسة تُفلت ذلك الشيء بالذات",
                ru: "Наверху лежат три вещи на выбор, касание отпускает именно эту",
              })}
              checked={settings.pick}
              onChange={(pick) => update({ pick })}
            />
            <p className="setting-note">
              {t({
                de: "Murmel, Tennisball, Eisenkugel, Apfel und Seifenblase rollen jedes anders; am Computer lassen die Tasten 1, 2 und 3 sie los. Ausgeschaltet öffnet ein Tipp den Trichter, und sechs Kugeln rollen von selbst.",
                en: "A marble, a tennis ball, an iron ball, an apple and a soap bubble each roll differently; on a computer the keys 1, 2 and 3 let them go. When it is off, a tap opens the funnel and six marbles roll by themselves.",
                zh: "弹珠、网球、铁球、苹果和肥皂泡滚起来各不一样；在电脑上用数字键 1、2、3 放下它们。关闭时，点一下会打开漏斗，六颗弹珠自己滚下来。",
                hi: "कंचा, टेनिस बॉल, लोहे की गेंद, सेब और साबुन का बुलबुला – हर एक अलग तरह से लुढ़कता है; कंप्यूटर पर 1, 2 और 3 कुंजियाँ उन्हें छोड़ती हैं। बंद होने पर एक टैप कीप खोल देता है, और छह कंचे अपने आप लुढ़कते हैं।",
                es: "Una canica, una pelota de tenis, una bola de hierro, una manzana y una pompa de jabón ruedan cada una a su manera; en el ordenador las teclas 1, 2 y 3 las sueltan. Si está desactivado, un toque abre el embudo y seis canicas ruedan solas.",
                ar: "الكرة الزجاجية وكرة التنس والكرة الحديدية والتفاحة وفقاعة الصابون، كلٌّ يتدحرج بطريقته؛ على الحاسوب تُفلتها المفاتيح 1 و2 و3. وعند الإيقاف تفتح اللمسة القمع، فتتدحرج ست كرات وحدها.",
                ru: "Шарик, теннисный мяч, железный шар, яблоко и мыльный пузырь катятся каждый по-своему; на компьютере их отпускают клавиши 1, 2 и 3. Если выключено, касание открывает воронку, и шесть шариков катятся сами.",
              })}
            </p>
          </SettingsGroup>
          <SettingsGroup
            title={t({
              de: "Kugelbahn: Umbauen",
              en: "Marble Run: Rebuilding",
              zh: "叮当弹珠轨道：改装",
              hi: "बजते कंचे: बदलाव",
              es: "Canicas musicales: reconstruir",
              ar: "مسار الكرات: إعادة البناء",
              ru: "Звонкие шарики: перестройка",
            })}
          >
            <Toggle
              label={t({
                de: "Tippen auf einen der sechs Plätze mit 🔧 wechselt das Teil",
                en: "Tapping one of the six spots with 🔧 changes the part",
                zh: "点六个带 🔧 的位置之一可换零件",
                hi: "🔧 वाली छह जगहों में से किसी एक पर टैप करने से हिस्सा बदलता है",
                es: "Tocar uno de los seis sitios con 🔧 cambia la pieza",
                ar: "لمس أحد المواضع الستة التي عليها 🔧 يغيّر القطعة",
                ru: "Касание одного из шести мест с 🔧 меняет деталь",
              })}
              checked={settings.rebuild}
              onChange={(rebuild) => update({ rebuild })}
            />
            <p className="setting-note">
              {t({
                de: "Glocke, Trampolin, Trichter und Wasserrad gehen reihum; die nächste Kugel nimmt den neuen Weg. Am Computer baut die Leertaste die Bahn Schritt für Schritt um. Ausgeschaltet bleibt die Bahn wie immer.",
                en: "Bell, trampoline, funnel and water wheel take turns; the next marble takes the new way. On a computer the space bar rebuilds the run step by step. When it is off, the run stays as always.",
                zh: "铃铛、蹦床、漏斗和水车轮流出现；下一颗弹珠走新的路线。在电脑上，空格键一步步改装轨道。关闭时，轨道保持原样。",
                hi: "घंटी, ट्रैम्पोलिन, कीप और पानी का पहिया बारी-बारी से आते हैं; अगला कंचा नए रास्ते से जाता है। कंप्यूटर पर स्पेस बार रास्ते को क़दम-दर-क़दम बदलता है। बंद होने पर रास्ता हमेशा जैसा रहता है।",
                es: "Campana, cama elástica, embudo y rueda de agua se turnan; la siguiente canica toma el nuevo camino. En el ordenador, la barra espaciadora reconstruye el recorrido paso a paso. Si está desactivado, el recorrido queda como siempre.",
                ar: "الجرس والترامبولين والقمع والدولاب المائي تتناوب؛ والكرة التالية تسلك الطريق الجديد. على الحاسوب يعيد مفتاح المسافة بناء المسار خطوة خطوة. وعند الإيقاف يبقى المسار كما هو دائمًا.",
                ru: "Колокольчик, батут, воронка и водяное колесо сменяют друг друга; следующий шарик едет по новому пути. На компьютере пробел перестраивает горку шаг за шагом. Если выключено, горка остаётся как всегда.",
              })}
            </p>
          </SettingsGroup>
        </>
      }
    >
      <MarblePlay settings={settings} />
    </GameShell>
  );
}
