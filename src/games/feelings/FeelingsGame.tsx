import { GameShell, type GameMode } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useAppLanguage, useT } from "@/lib/language";
import { FeelingsPlay } from "./FeelingsPlay";
import { storyIn } from "./localized";
import { MOOD_ID } from "./mood";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import { STORIES } from "./stories";
import "./feelings.css";

/** The start screen: all stories in turn, or just one – the bear's feelings at home and the kindergarten stories side by side. */
export function FeelingsGame() {
  const [settings, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const t = useT();
  const { id: language } = useAppLanguage();

  const modes: GameMode[] = [
    // "All in turn" comes first and across the whole row.
    { id: "all", emoji: "🌈", title: t({ de: "Alle", ru: "Все" }), featured: true },
    // Asks for the child's weather first, then the bear's story with that feeling.
    { id: MOOD_ID, emoji: "🌦️", title: t({ de: "Wie geht's dir?", ru: "Как дела?" }) },
    ...STORIES.map((story) => {
      const { id, emoji, title } = storyIn(story, language);
      return { id, emoji, title };
    }),
  ];

  return (
    <GameShell
      title={t({ de: "Gefühle", ru: "Чувства" })}
      emoji="🐻"
      modes={modes}
      mode={settings.story}
      onMode={(story) => update({ story })}
      info={
        <>
          <p>
            {t({
              de: "Zu Hause ist der kleine Bär traurig, wütend, müde oder hat Angst. Drei Karten zeigen, was ihm hilft – umarmen, Hand halten, stampfen, Licht an … Sind alle drei getan, ist er wieder froh. Und an seinem Geburtstag freut er sich, und das Kind feiert mit: tanzen, Luftschlangen, umarmen.",
              ru: "Дома Мишке грустно, он злится, хочет спать или боится. Три карточки показывают, что ему помогает: обнять, взять за лапку, потопать, включить свет … Когда сделаны все три, Мишка снова радуется. А в свой день рождения он и так счастлив, и ребёнок празднует вместе с ним: танцы, серпантин, объятия.",
            })}
          </p>
          <p>
            {t({
              de: "„Wie geht's dir?“ zeigt zuerst vier Wetterbilder: Sonne, Wolke, Regen, Gewitter. Das Kind tippt, was zu ihm passt – so erfahren Erwachsene nebenbei, wie es ihm geht. Der Bär sagt „Das kenne ich auch!“, und dann kommt seine Geschichte mit diesem Gefühl.",
              ru: "«Как дела?» сначала показывает четыре картинки с погодой: солнце, облако, дождь, гроза. Ребёнок нажимает ту, что ему подходит, – так взрослые заодно узнают, как он себя чувствует. Мишка говорит «Мне тоже так бывает!», и дальше идёт его история с этим чувством.",
            })}
          </p>
          <p>
            {t({
              de: "Im Kindergarten: Jemand schubst, tritt oder nimmt etwas weg, die Rutsche ist voll, ein anderes Kind hat das tolle Spielzeug – oder der kleine Bär ist selbst wütend. Dazu Abschied an der Tür, jemand Neues in der Gruppe, hingefallen, und jemand hört nicht auf, obwohl der Bär nicht mehr will. Bei jedem Schritt tippt das Kind, was der Bär tun kann: laut „Stopp! Nein!“ sagen, weggehen, Hilfe holen, fragen, warten, tauschen.",
              ru: "В детском саду: кто-то толкается, пинается или отбирает игрушку, на горке очередь, у другого малыша классная игрушка – или Мишка сам злится. А ещё прощание у двери, новенький в группе, упал, и кто-то не перестаёт, хотя Мишка уже не хочет. На каждом шаге ребёнок выбирает, что может сделать Мишка: громко сказать «Стоп! Нет!», отойти, позвать взрослого, спросить, подождать, поменяться.",
            })}
          </p>
          <p>
            {t({
              de: "Links liegt immer eine nicht so gute Idee (z. B. zurückschubsen, Licht aus), daneben die guten, die beste zuerst. Tippt das Kind auf die nicht so gute, erscheint sie groß mit rotem Kreuz und es wird erklärt, warum. Die guten Ideen bekommen einen grünen Haken.",
              ru: "Слева всегда не самая хорошая идея (например, толкнуть в ответ или выключить свет), рядом – хорошие, лучшая первой. Если ребёнок выбирает не самую хорошую, она появляется крупно с красным крестиком, и объясняется почему. Хорошие идеи получают зелёную галочку.",
            })}
          </p>
          <p>
            {t({
              de: "Unter jedem Bild steht klein, was es zeigt – zum Mitlesen und Erzählen für Erwachsene. Kinder wählen nur nach dem Bild.",
              ru: "Под каждой картинкой мелко написано, что на ней, – чтобы взрослым было удобно читать и рассказывать. Дети выбирают только по картинке.",
            })}
          </p>
          {!settings.speech && (
            <p>
              {t({
                de: "Mit Vorlesen (auf der Startseite) wird die Geschichte erzählt, sonst erzählen Erwachsene sie anhand der Bilder.",
                ru: "Если на главной странице включено «Читать вслух», историю рассказывает голос, иначе её рассказывают взрослые по картинкам.",
              })}
            </p>
          )}
        </>
      }
    >
      <FeelingsPlay settings={settings} />
    </GameShell>
  );
}
