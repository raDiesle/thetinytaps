import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { PeekPlay } from "@/games/shadows/PeekPlay";
import "@/games/shadows/shadows.css";
import { AnimalsPlay } from "./AnimalsPlay";
import { ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS, type AnimalsMode, type ChoiceCount } from "./settings";
import "./animals.css";

/** The game's name, on its start screen and in the browser tab. */
export const ANIMALS_TITLE: Localized = {
  de: "Was gehört zum Tier?",
  ru: "Что нужно зверюшке?",
  en: "What Does the Animal Need?",
  zh: "小动物要什么？",
  hi: "जानवर को क्या चाहिए?",
  es: "¿Qué necesita el animal?",
  ar: "ماذا يحتاج الحيوان؟",
};

export function AnimalsGame() {
  const t = useT();
  const [settings, update] = useGameSettings(ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS);

  return (
    <GameShell
      title={t(ANIMALS_TITLE)}
      emoji="🐰"
      modes={[
        {
          id: "feed",
          emoji: "🥕",
          title: t({
            de: "Tiere füttern",
            ru: "Покорми зверюшку",
            en: "Feed the animals",
            zh: "喂小动物",
            hi: "जानवरों को खिलाओ",
            es: "Dar de comer",
            ar: "إطعام الحيوانات",
          }),
        },
        {
          id: "home",
          emoji: "🏠",
          title: t({
            de: "Wer wohnt wo?",
            ru: "Кто где живёт?",
            en: "Who lives where?",
            zh: "谁住在哪里？",
            hi: "कौन कहाँ रहता है?",
            es: "¿Quién vive dónde?",
            ar: "من يعيش أين؟",
          }),
        },
        {
          id: "peek",
          emoji: "🙈",
          title: t({
            de: "Wer schaut da raus?",
            ru: "Кто там выглядывает?",
            en: "Who's peeking out?",
            zh: "谁在偷偷看？",
            hi: "कौन झाँक रहा है?",
            es: "¿Quién se asoma?",
            ar: "من يطل من هناك؟",
          }),
        },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as AnimalsMode })}
      level={
        <>
          <Choice<ChoiceCount>
            label={t({ de: "Zur Auswahl", ru: "На выбор", en: "To choose from", zh: "可选数量", hi: "चुनने के लिए", es: "Para elegir", ar: "للاختيار" })}
            value={settings.choices}
            onChange={(choices) => update({ choices })}
            options={[
              { value: "2", label: t({ de: "2 Dinge", ru: "2 предмета", en: "2 things", zh: "2 样", hi: "2 चीज़ें", es: "2 cosas", ar: "شيئان" }) },
              { value: "3", label: t({ de: "3 Dinge", ru: "3 предмета", en: "3 things", zh: "3 样", hi: "3 चीज़ें", es: "3 cosas", ar: "3 أشياء" }) },
              { value: "4", label: t({ de: "4 Dinge", ru: "4 предмета", en: "4 things", zh: "4 样", hi: "4 चीज़ें", es: "4 cosas", ar: "4 أشياء" }) },
            ]}
          />
          <Toggle
            label={t({
              de: "Abwechselnd füttern und Zuhause finden",
              ru: "По очереди: кормить и искать домик",
              en: "Take turns: feeding and finding homes",
              zh: "轮流：喂食和找家",
              hi: "बारी-बारी: खिलाना और घर ढूँढना",
              es: "Por turnos: dar de comer y buscar casa",
              ar: "بالتناوب: الإطعام وإيجاد البيت",
            })}
            checked={settings.mix}
            onChange={(mix) => update({ mix })}
          />
        </>
      }
      info={
        <>
          <p>
            {t({
              de: "Tiere füttern: Ein Tier hat Hunger, und das Kind zieht das passende Futter zu ihm – die Möhre zum Hasen, den Knochen zum Hund.",
              ru: "Покорми зверюшку: зверюшка проголодалась, и ребёнок тянет к ней подходящую еду – морковку к зайке, косточку к собачке.",
              en: "Feed the animals: an animal is hungry, and the child drags the right food to it – the carrot to the bunny, the bone to the puppy.",
              zh: "喂小动物：一只小动物饿了，孩子把合适的食物拖给它——胡萝卜给小兔子，骨头给小狗。",
              hi: "जानवरों को खिलाओ: एक जानवर को भूख लगी है, और बच्चा सही खाना खींचकर उसके पास ले जाता है – गाजर खरगोश के पास, हड्डी कुत्ते के पास।",
              es: "Dar de comer: un animal tiene hambre, y su peque le arrastra la comida que le va: la zanahoria al conejito, el hueso al perrito.",
              ar: "إطعام الحيوانات: حيوان جائع، ويسحب الطفل إليه الطعام المناسب – الجزرة إلى الأرنب، والعظمة إلى الكلب.",
            })}
          </p>
          <p>
            {t({
              de: "Wer wohnt wo? Das Kind bringt das Tier in sein Zuhause: den Vogel ins Nest, die Kuh in den Stall.",
              ru: "Кто где живёт? Ребёнок относит зверюшку в её домик: птичку в гнездо, корову в хлев.",
              en: "Who lives where? The child brings the animal to its home: the bird to the nest, the cow to the barn.",
              zh: "谁住在哪里？孩子把小动物送回家：小鸟送到鸟窝，奶牛送到棚子。",
              hi: "कौन कहाँ रहता है? बच्चा जानवर को उसके घर ले जाता है: चिड़िया को घोंसले में, गाय को तबेले में।",
              es: "¿Quién vive dónde? Su peque lleva al animal a su casa: el pajarito al nido, la vaca al establo.",
              ar: "من يعيش أين؟ يأخذ الطفل الحيوان إلى بيته: العصفور إلى العش، والبقرة إلى الإسطبل.",
            })}
          </p>
          <p>
            {t({
              de: "Wer schaut da raus? Nur ein Stück von einem Tier schaut aus dem Busch oder dem Teich. Das Kind tippt unten auf das ganze Tier, und es kommt heraus.",
              ru: "Кто там выглядывает? Из куста или пруда видна только часть зверюшки. Ребёнок нажимает внизу на всю зверюшку, и она выходит.",
              en: "Who's peeking out? Only a bit of an animal peeks out of the bush or the pond. The child taps the whole animal below, and it comes out.",
              zh: "谁在偷偷看？灌木丛或池塘里只露出小动物的一部分。孩子点一下下面完整的小动物，它就出来了。",
              hi: "कौन झाँक रहा है? झाड़ी या तालाब से जानवर का बस एक हिस्सा दिखता है। बच्चा नीचे पूरे जानवर को छूता है, और वह बाहर आ जाता है।",
              es: "¿Quién se asoma? Solo un trocito de un animal asoma del arbusto o del estanque. Su peque toca abajo el animal entero, y sale.",
              ar: "من يطل من هناك؟ يظهر جزء صغير فقط من حيوان من الشجيرة أو البركة. يلمس الطفل في الأسفل الحيوان كاملا، فيخرج.",
            })}
          </p>
        </>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Anzeige", ru: "Отображение", en: "Display", zh: "显示", hi: "दिखावट", es: "Visualización", ar: "العرض" })}>
            <Toggle
              label={t({
                de: "Namen zeigen (Hase, Möhre …)",
                ru: "Показывать названия (зайка, морковка …)",
                en: "Show names (bunny, carrot …)",
                zh: "显示名称（小兔子、胡萝卜……）",
                hi: "नाम दिखाएँ (खरगोश, गाजर …)",
                es: "Mostrar nombres (conejito, zanahoria…)",
                ar: "إظهار الأسماء (أرنب، جزرة …)",
              })}
              checked={settings.names}
              onChange={(names) => update({ names })}
            />
          </SettingsGroup>

          <SettingsGroup title={t({ de: "Verhalten", ru: "Поведение", en: "Behavior", zh: "操作", hi: "व्यवहार", es: "Comportamiento", ar: "السلوك" })}>
            <Toggle
              label={t({
                de: "Antippen reicht (sonst muss man ziehen; bei „Wer schaut da raus?“ wird immer getippt)",
                ru: "Достаточно нажать (иначе нужно перетащить; в «Кто там выглядывает?» всегда просто нажимают)",
                en: "A tap is enough (otherwise drag; “Who's peeking out?” is always tapped)",
                zh: "点一下就行（否则需要拖动；“谁在偷偷看？”总是点选）",
                hi: "छूना काफ़ी है (नहीं तो खींचना पड़ता है; “कौन झाँक रहा है?” में हमेशा छूते हैं)",
                es: "Basta con tocar (si no, hay que arrastrar; en «¿Quién se asoma?» siempre se toca)",
                ar: "اللمس يكفي (وإلا يجب السحب؛ في «من يطل من هناك؟» يكون اللمس دائما)",
              })}
              checked={settings.tap}
              onChange={(tap) => update({ tap })}
            />
          </SettingsGroup>
        </>
      }
    >
      {settings.mode === "peek" ? <PeekPlay settings={settings} /> : <AnimalsPlay settings={settings} />}
    </GameShell>
  );
}
