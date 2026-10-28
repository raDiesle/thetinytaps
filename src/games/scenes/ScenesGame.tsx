import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice, type Device } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { findScene } from ".";
import { localizeScene } from "./localize";
import { ScenePlay } from "./ScenePlay";
import { carryOverScenesSettings, DEFAULT_SCENES_SETTINGS, SCENES_SETTINGS_KEY, type SceneAnnounce, type SceneMode, type SceneTrigger } from "./settings";

carryOverScenesSettings();

export function ScenesGame({ sceneId }: { sceneId: string }) {
  const [stored, update] = useGameSettings(SCENES_SETTINGS_KEY, DEFAULT_SCENES_SETTINGS);
  const device = useDevice();
  const language = useAppLanguage();
  const t = useT();
  // Tablets and phones have no keys, and the finger is right on the picture anyway.
  const settings = device.touchOnly && stored.trigger === "keys" ? { ...stored, trigger: "tap" as const } : stored;
  const found = findScene(sceneId);
  if (!found) return null;
  const scene = localizeScene(found, language.id);

  return (
    <GameShell
      title={scene.title}
      emoji={scene.emoji}
      backHref="/bilder/"
      backLabel={t({ de: "Alle Bilder", ru: "Все картинки", en: "All pictures", zh: "所有图画", hi: "सारी तस्वीरें", es: "Todos los dibujos", ar: "كل الصور" })}
      modes={[
        {
          id: "explore",
          emoji: "👆",
          title: t({
            de: "Freies Entdecken",
            ru: "Свободная игра",
            en: "Free exploring",
            zh: "自由探索",
            hi: "खुलकर खोजें",
            es: "Explorar libremente",
            ar: "استكشاف حر",
          }),
        },
        { id: "colour", emoji: "🖍️", title: t({ de: "Ausmalen", ru: "Раскраска", en: "Coloring", zh: "涂颜色", hi: "रंग भरें", es: "Colorear", ar: "تلوين" }) },
        { id: "find", emoji: "🔍", title: t({ de: "Suchen", ru: "Поиск", en: "Find it", zh: "找一找", hi: "ढूँढें", es: "Buscar", ar: "بحث" }) },
        { id: "questions", emoji: "❓", title: t({ de: "Fragen", ru: "Вопросы", en: "Questions", zh: "问一问", hi: "सवाल", es: "Preguntas", ar: "أسئلة" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as SceneMode })}
      info={
        <>
          <p>
            {t({
              de: "Ein Wimmelbild, in dem alles auf Antippen antwortet: Der Bagger baggert, die Kuh muht.",
              ru: "Большая картинка, где всё отвечает на касание: экскаватор копает, корова мычит.",
              en: "A busy picture where everything answers a tap: the excavator digs, the cow moos.",
              zh: "一幅热闹的大图，点什么都有反应：挖掘机在挖土，奶牛哞哞叫。",
              hi: "एक बड़ी चहल-पहल वाली तस्वीर, जिसमें हर चीज़ छूने पर जवाब देती है: खुदाई मशीन खोदती है, गाय रंभाती है।",
              es: "Un dibujo lleno de cosas donde todo responde al tocarlo: la excavadora excava, la vaca muge.",
              ar: "صورة كبيرة مليئة بالأشياء، كل شيء فيها يستجيب للمس: الحفارة تحفر والبقرة تخور.",
            })}
          </p>
          <p>
            {t({
              de: "Freies Entdecken: Alles darf angetippt werden, manches stößt etwas anderes an, und Fahrzeuge fahren am Rand in andere Bilder weiter.",
              ru: "Свободная игра: можно нажимать на всё, одно иногда приводит в движение другое, а машины уезжают за край в другие картинки.",
              en: "Free exploring: everything may be tapped, some things set off something else, and vehicles drive off the edge into other pictures.",
              zh: "自由探索：什么都可以点，有些东西会带动别的东西，车辆还会从画边开进别的图画里。",
              hi: "खुलकर खोजें: हर चीज़ को छुआ जा सकता है, कुछ चीज़ें दूसरी चीज़ों को हिला देती हैं, और गाड़ियाँ किनारे से निकलकर दूसरी तस्वीरों में चली जाती हैं।",
              es: "Explorar libremente: se puede tocar todo, algunas cosas ponen otras en marcha y los vehículos salen por el borde hacia otros dibujos.",
              ar: "استكشاف حر: يمكن لمس كل شيء، وبعض الأشياء تحرك أشياء أخرى، والمركبات تخرج من طرف الصورة إلى صور أخرى.",
            })}
          </p>
          <p>
            {t({
              de: "Ausmalen: Das Bild ist grau, und jedes angetippte Ding bekommt seine Farbe zurück; jeder Tipp malt auch einen Farbklecks in den Hintergrund.",
              ru: "Раскраска: картинка серая, и каждая вещь, которой коснулся ребёнок, снова становится цветной; каждое касание ещё оставляет цветную кляксу на фоне.",
              en: "Coloring: the picture is gray, and everything the child taps gets its color back; every tap also paints a blob of color into the background.",
              zh: "涂颜色：图画是灰色的，孩子点到的东西会重新变成彩色；每点一下，背景上还会留下一团颜色。",
              hi: "रंग भरें: तस्वीर स्लेटी है, और बच्चा जिस चीज़ को छूता है, उसका रंग लौट आता है; हर स्पर्श पृष्ठभूमि में भी रंग का एक धब्बा बना देता है।",
              es: "Colorear: el dibujo es gris y cada cosa que toca el niño o la niña recupera su color; cada toque pinta además una mancha de color en el fondo.",
              ar: "تلوين: الصورة رمادية، وكل شيء يلمسه الطفل يستعيد لونه؛ وكل لمسة ترسم أيضا بقعة لون في الخلفية.",
            })}
          </p>
          <p>
            {t({
              de: "Suchen: Ein Ding erscheint in einer leuchtenden Blase, und das Kind sucht es im Bild. Fragen: „Was ist rot?“, „Wer kann fliegen?“ – das Kind tippt, was passt; es reicht, wenn ein Teil passt (das rote Dach eines Hauses).",
              ru: "Поиск: в светящемся пузыре появляется вещь, и ребёнок ищет её на картинке. Вопросы: «Что красное?», «Кто летает?» – ребёнок нажимает то, что подходит; достаточно, если подходит часть (красная крыша дома).",
              en: "Find it: a thing appears in a glowing bubble, and the child looks for it in the picture. Questions: “What is red?”, “Who can fly?” – the child taps what fits; it is enough if a part fits (the red roof of a house).",
              zh: "找一找：发光的泡泡里出现一样东西，孩子在图画里找它。问一问：“什么是红色的？”“谁会飞？”——孩子点合适的东西；只要一部分合适就算对（房子的红屋顶）。",
              hi: "ढूँढें: एक चमकते बुलबुले में कोई चीज़ दिखती है, और बच्चा उसे तस्वीर में ढूँढता है। सवाल: “लाल चीज़ कहाँ है?”, “कौन उड़ सकता है?” – बच्चा वह छूता है जो सही बैठे; अगर कोई हिस्सा भी सही बैठे तो काफ़ी है (घर की लाल छत)।",
              es: "Buscar: en una burbuja brillante aparece una cosa y el niño o la niña la busca en el dibujo. Preguntas: «¿Qué es rojo?», «¿Quién puede volar?»: se toca lo que corresponde; basta con que corresponda una parte (el tejado rojo de una casa).",
              ar: "بحث: يظهر شيء في فقاعة مضيئة، ويبحث عنه الطفل في الصورة. أسئلة: «أين شيء أحمر؟»، «من يطير؟» – يلمس الطفل ما يناسب؛ ويكفي أن يناسب جزء منه (السقف الأحمر للبيت).",
            })}
          </p>
        </>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Spiel", ru: "Игра", en: "Game", zh: "游戏", hi: "खेल", es: "Juego", ar: "اللعبة" })}>
            <Choice<SceneTrigger>
              label={t({
                de: "Auslösen",
                ru: "Как оживает картинка",
                en: "How the picture comes alive",
                zh: "怎样让图画动起来",
                hi: "तस्वीर कैसे जागे",
                es: "Cómo cobra vida el dibujo",
                ar: "كيف تتحرك الصورة",
              })}
              value={settings.trigger}
              onChange={(trigger) => update({ trigger })}
              options={triggerOptions(device, t)}
            />
            {settings.trigger === "keys" && (
              <Toggle
                label={t({
                  de: "Tasten im Bild zeigen",
                  ru: "Показывать клавиши на картинке",
                  en: "Show the keys in the picture",
                  zh: "在图画上显示按键",
                  hi: "तस्वीर में बटन दिखाएँ",
                  es: "Mostrar las teclas en el dibujo",
                  ar: "إظهار المفاتيح في الصورة",
                })}
                checked={settings.showKeys}
                onChange={(showKeys) => update({ showKeys })}
              />
            )}
            <Toggle
              label={t({
                de: "Entdecken und Ausmalen: Mitzählen – wenn alles entdeckt ist, gibt es eine Party",
                ru: "Свободная игра и раскраска: считать – когда всё найдено, будет праздник",
                en: "Free exploring and coloring: count along – when everything is found, there is a party",
                zh: "自由探索和涂颜色：一起数——全部找到后有庆祝",
                hi: "खुलकर खोजें और रंग भरें: गिनती करें – सब कुछ मिल जाने पर जश्न होता है",
                es: "Explorar y colorear: contar – cuando se ha descubierto todo, hay una fiesta",
                ar: "الاستكشاف والتلوين: العدّ – عندما يُكتشف كل شيء يكون هناك احتفال",
              })}
              checked={settings.goal}
              onChange={(goal) => update({ goal })}
            />
            <Toggle
              label={t({
                de: "Entdecken: Fahrzeuge fahren in andere Bilder – am Rand antippen und mitfahren",
                ru: "Свободная игра: машины уезжают в другие картинки – нажать на знак у края и поехать следом",
                en: "Free exploring: vehicles drive into other pictures – tap the sign at the edge and ride along",
                zh: "自由探索：车辆会开进别的图画——点画边的标志就能跟过去",
                hi: "खुलकर खोजें: गाड़ियाँ दूसरी तस्वीरों में जाती हैं – किनारे के निशान को छूकर साथ चलें",
                es: "Explorar: los vehículos van a otros dibujos – tocar la señal del borde y seguirlos",
                ar: "الاستكشاف: المركبات تذهب إلى صور أخرى – المسوا العلامة عند الطرف واتبعوها",
              })}
              checked={settings.roads}
              onChange={(roads) => update({ roads })}
            />
            <Toggle
              label={t({
                de: "Fragen: Tipp zeigen, wenn es länger dauert",
                ru: "Вопросы: показать подсказку, если ребёнок долго ищет",
                en: "Questions: show a hint when it takes longer",
                zh: "问一问：找得久时给个提示",
                hi: "सवाल: देर होने पर संकेत दिखाएँ",
                es: "Preguntas: mostrar una pista si tarda",
                ar: "الأسئلة: إظهار تلميح إذا طال البحث",
              })}
              checked={settings.hints}
              onChange={(hints) => update({ hints })}
            />
            {settings.speech && (
              <Choice<SceneAnnounce>
                label={t({
                  de: "Ansage beim Entdecken",
                  ru: "Что говорить при нажатии",
                  en: "What to say when exploring",
                  zh: "探索时说什么",
                  hi: "खोजते समय क्या बोले",
                  es: "Qué decir al explorar",
                  ar: "ماذا يُقال عند الاستكشاف",
                })}
                value={settings.announce}
                onChange={(announce) => update({ announce })}
                options={[
                  {
                    value: "sentence",
                    label: t({
                      de: "„Der Bagger baggert!“",
                      ru: "«Экскаватор копает!»",
                      en: "“The excavator digs!”",
                      zh: "“挖掘机在挖土！”",
                      hi: "“खुदाई मशीन खोदती है!”",
                      es: "«¡La excavadora excava!»",
                      ar: "«الحفارة تحفر!»",
                    }),
                  },
                  {
                    value: "name",
                    label: t({
                      de: "„Der Bagger!“",
                      ru: "«Экскаватор!»",
                      en: "“The excavator!”",
                      zh: "“挖掘机！”",
                      hi: "“खुदाई मशीन!”",
                      es: "«¡La excavadora!»",
                      ar: "«الحفارة!»",
                    }),
                  },
                ]}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title={t({ de: "Bild", ru: "Картинка", en: "Picture", zh: "图画", hi: "तस्वीर", es: "Dibujo", ar: "الصورة" })}>
            <Toggle
              label={t({
                de: "Bild bewegt sich auch von allein, ohne Ton (Wolken, Rotor, Blinklichter …)",
                ru: "Картинка двигается и сама, без звука (облака, винт, мигалки …)",
                en: "The picture also moves by itself, without sound (clouds, rotor, flashing lights …)",
                zh: "图画自己也会动，没有声音（云、旋翼、警灯……）",
                hi: "तस्वीर अपने आप भी हिलती है, बिना आवाज़ के (बादल, पंखा, चमकती बत्तियाँ …)",
                es: "El dibujo también se mueve solo, sin sonido (nubes, hélice, luces …)",
                ar: "الصورة تتحرك وحدها أيضا، بلا صوت (الغيوم، المروحة، الأضواء الوامضة …)",
              })}
              checked={settings.ambient}
              onChange={(ambient) => update({ ambient })}
            />
          </SettingsGroup>
        </>
      }
    >
      {/* A new picture (a vehicle was followed into it) starts afresh. */}
      <ScenePlay key={scene.id} scene={scene} settings={settings} />
    </GameShell>
  );
}

/** The ways to bring the picture to life, worded for this device and in the app language (`t`); the keys only where there is a keyboard. */
function triggerOptions(device: Device, t: ReturnType<typeof useT>): { value: SceneTrigger; label: string }[] {
  if (device.touchOnly) {
    return [
      { value: "tap", label: t({ de: "👆 Antippen", ru: "👆 Нажимать", en: "👆 Tap", zh: "👆 点", hi: "👆 छूना", es: "👆 Tocar", ar: "👆 لمس" }) },
      {
        value: "hover",
        label: t({
          de: "👆 Wischen (Finger übers Bild ziehen)",
          ru: "👆 Проводить пальцем по картинке",
          en: "👆 Swipe (slide a finger over the picture)",
          zh: "👆 划（手指在图画上滑过）",
          hi: "👆 उँगली फेरना (तस्वीर पर उँगली चलाना)",
          es: "👆 Deslizar (pasar el dedo por el dibujo)",
          ar: "👆 تمرير (تحريك الإصبع فوق الصورة)",
        }),
      },
    ];
  }
  // With a mouse, keys are often easier for the youngest than aiming and clicking.
  const keys = {
    value: "keys" as const,
    label: t({
      de: "⌨️ Jedes Ding hat eine Taste, oder Pfeile + Leertaste",
      ru: "⌨️ У каждой вещи своя клавиша, или стрелки + пробел",
      en: "⌨️ Every thing has a key, or arrows + space bar",
      zh: "⌨️ 每样东西都有一个键，或者方向键 + 空格键",
      hi: "⌨️ हर चीज़ का अपना बटन, या तीर + स्पेस बार",
      es: "⌨️ Cada cosa tiene su tecla, o flechas + espacio",
      ar: "⌨️ لكل شيء مفتاح، أو الأسهم + مفتاح المسافة",
    }),
  };
  if (!device.hasTouch) {
    return [
      {
        value: "tap",
        label: t({ de: "🖱️ Klicken", ru: "🖱️ Щёлкать мышкой", en: "🖱️ Click", zh: "🖱️ 点击", hi: "🖱️ क्लिक करना", es: "🖱️ Hacer clic", ar: "🖱️ النقر" }),
      },
      {
        value: "hover",
        label: t({
          de: "🖱️ Mit der Maus darüberfahren",
          ru: "🖱️ Наводить мышку",
          en: "🖱️ Move the mouse over it",
          zh: "🖱️ 用鼠标划过",
          hi: "🖱️ माउस ऊपर से ले जाना",
          es: "🖱️ Pasar el ratón por encima",
          ar: "🖱️ تمرير الفأرة فوقه",
        }),
      },
      keys,
    ];
  }
  return [
    {
      value: "tap",
      label: t({
        de: "👆 Antippen / Klicken",
        ru: "👆 Нажимать / щёлкать",
        en: "👆 Tap / click",
        zh: "👆 点 / 点击",
        hi: "👆 छूना / क्लिक करना",
        es: "👆 Tocar / hacer clic",
        ar: "👆 لمس / نقر",
      }),
    },
    {
      value: "hover",
      label: t({
        de: "🖱️ Darüberfahren / Wischen",
        ru: "🖱️ Наводить мышку / проводить пальцем",
        en: "🖱️ Move over / swipe",
        zh: "🖱️ 鼠标划过 / 手指滑过",
        hi: "🖱️ माउस ले जाना / उँगली फेरना",
        es: "🖱️ Pasar por encima / deslizar",
        ar: "🖱️ تمرير الفأرة / الإصبع",
      }),
    },
    keys,
  ];
}
