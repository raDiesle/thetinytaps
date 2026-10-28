// Zu Hause in Arabic (simple Modern Standard Arabic): the words of bear.ts, by id. The bear is „الدبدوب“ (a he).
// Commands to the child would differ for a boy and a girl, so what the child does is said with "we"
// („نعانق الدبدوب.“, „الأفضل أن نعانقه.“) and the questions ask „ماذا نفعل؟“ or what the bear can do.

import type { ComfortId, FeelingId } from "./bear";
import type { ComfortText, FeelingText } from "./localized";

/** The kind things in Arabic. */
export const COMFORTS_AR: Partial<Record<ComfortId, ComfortText>> = {
  stroke: { caption: "تربيت", narration: "نربّت على الدبدوب. بلطف شديد." },
  hug: { caption: "عناق", narration: "نعانق الدبدوب بقوة." },
  teddy: { caption: "إعطاء دمية", narration: "نعطي الدبدوب دمية ليحضنها." },
  stomp: { caption: "دبدبة بالقدمين", narration: "دب، دب! ليخرج الغضب." },
  blow: { caption: "نفخ عميق", narration: "شهيق عميق … ثم ننفخ: فووو." },
  blanket: { caption: "تغطية", narration: "نغطّي الدبدوب. دافئ ومريح." },
  lullaby: { caption: "غناء تهويدة", narration: "نغنّي تهويدة هادئة." },
  hand: { caption: "إمساك اليد", narration: "نمسك يده. نحن هنا معه." },
  light: { caption: "إشعال الضوء", narration: "نشعل الضوء. الآن صار المكان مضيئًا." },
  dance: { caption: "الرقص معًا", narration: "نرقص معًا. قفزة، قفزة!" },
  streamers: { caption: "رمي الشرائط الملونة", narration: "نرمي شرائط ملونة. مرحى!" },
};

/** The bear's feelings in Arabic, every not-so-good idea translated. */
export const FEELINGS_AR: Partial<Record<FeelingId, FeelingText>> = {
  sad: {
    title: "حزين، يبكي",
    questions: ["الدبدوب حزين ويبكي. ماذا نفعل؟", "الدبدوب ما زال حزينًا. ماذا نفعل؟", "الدبدوب ما زال حزينًا قليلًا. ماذا نفعل؟"],
    intro: "الدبدوب حزين. إنه يبكي.",
    instead: [
      { caption: "دفعه بعيدًا", answer: "همم، الدفع يؤلم. الأفضل أن نعانقه." },
      { caption: "تكسير اللعبة", answer: "همم، الآن لعبته مكسورة. الأفضل أن نربّت عليه." },
      { caption: "أخذ المكعبات", answer: "همم، الآن يبكي الدبدوب أكثر. الأفضل أن نعطيه دمية." },
    ],
    end: { narration: "الآن الدبدوب فرحان من جديد!", line: "شكرًا!" },
    endCaption: "فرحان من جديد",
  },
  angry: {
    title: "غضب، البرج سقط",
    questions: ["سقط البرج، والدبدوب غاضب. ماذا يستطيع أن يفعل؟", "الدبدوب ما زال غاضبًا. ماذا يستطيع أن يفعل؟", "الدبدوب ما زال غاضبًا قليلًا. ماذا نفعل؟"],
    intro: "الدبدوب غاضب! سقط برجه.",
    instead: [
      { caption: "رمي الألعاب", answer: "همم، الرمي يكسر الأشياء. الأفضل أن يُخرج غضبه: يدبدب بقدميه بقوة!" },
      { caption: "الصراخ بصوت عالٍ", answer: "همم، الصراخ يجعل الغضب أكبر. الأفضل أن ينفخ بعمق: فووو." },
      { caption: "الضرب", answer: "همم، الضرب يؤلم. الأفضل أن نعانقه." },
    ],
    end: { narration: "ذهب الغضب. الدبدوب هادئ من جديد.", line: "شكرًا!" },
    endCaption: "هادئ من جديد",
  },
  tired: {
    title: "نعسان في المساء",
    questions: ["الدبدوب نعسان ويتثاءب. ماذا نفعل؟", "الدبدوب ما زال مستيقظًا. ماذا نفعل؟", "الدبدوب يكاد ينام. ماذا نفعل؟"],
    intro: "الدبدوب نعسان. إنه يتثاءب.",
    instead: [
      { caption: "سحب الغطاء", answer: "همم، بلا غطاء يبرد الدبدوب. الأفضل أن نغطّيه." },
      { caption: "قرع الطبل بصوت عالٍ", answer: "همم، مع هذا الصوت العالي لا يستطيع الدبدوب أن ينام. الأفضل أن نتكلم بهدوء شديد." },
      { caption: "عرض الجهاز اللوحي", answer: "همم، الصورة المضيئة توقظ الدبدوب من جديد. الأفضل أن نعطيه دمية." },
    ],
    end: { narration: "الدبدوب ينام سعيدًا. ليلة سعيدة!", line: "ليلة سعيدة …" },
    endCaption: "ينام",
  },
  scared: {
    title: "خوف من العاصفة",
    questions: ["الرعد يدوّي، والدبدوب خائف. ماذا نفعل؟", "الدبدوب ما زال خائفًا. ماذا نفعل؟", "الظلام شديد. ماذا نفعل؟"],
    intro: "الدبدوب خائف. الرعد يدوّي!",
    instead: [
      { caption: "قول «بخ!»", answer: "همم، الآن الدبدوب خائف أكثر. الأفضل أن نعانقه." },
      { caption: "تركه وحده", answer: "همم، وحده يخاف الدبدوب أكثر. الأفضل أن نمسك يده." },
      { caption: "إطفاء الضوء", answer: "همم، في الظلام يخاف الدبدوب أكثر. الأفضل أن نشعل الضوء." },
    ],
    end: { narration: "انتهت العاصفة. الدبدوب يضحك من جديد!", line: "شكرًا!" },
    endCaption: "فرحان من جديد",
  },
  happy: {
    title: "فرح، عيد ميلاد",
    questions: ["اليوم عيد ميلاد الدبدوب! كيف نحتفل معه؟", "الدبدوب ما زال يحتفل. ماذا نفعل؟", "الدبدوب فرحان جدًّا. ماذا نفعل؟"],
    intro: "اليوم عيد ميلاد الدبدوب! إنه فرحان جدًّا.",
    question: "كيف نحتفل معه؟",
    instead: [
      { caption: "تفجير البالون", answer: "همم، الآن انفجر بالونه. الأفضل أن نرقص معه." },
      { caption: "أخذ الهدية", answer: "همم، هذه هديته. الآن هو حزين. الأفضل أن نحتفل معه." },
      { caption: "أخذ الكعكة", answer: "همم، هذه كعكة عيد ميلاده. الآن هو حزين. الأفضل أن نحتفل معه." },
    ],
    end: { narration: "يا له من عيد ميلاد جميل!", line: "شكرًا! كان رائعًا!" },
    endCaption: "حفلة عيد الميلاد",
  },
};
