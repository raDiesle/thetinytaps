import type { StepId, StepTexts } from "./steps";

// The brushing steps in Hindi: the same pictures, said with commands to the child (खोलो, रगड़ो), which are the same for a boy and a girl; दाढ़ are the back teeth, चीनी-मॉन्स्टर the sugar monsters.

/** Title, hint and spoken cue of the steps in Hindi, by step id; a text missing here is said in German (see stepText). */
export const STEP_TEXTS_HI: Partial<Record<StepId, Partial<StepTexts>>> = {
  "lower-top": {
    title: "⬇️ नीचे की दाढ़ें",
    hint: "नीचे चबाने वाली सतह: आगे-पीछे",
    cue: "मुँह खूब खोलो! नीचे की दाढ़ों पर। आगे-पीछे रगड़ो!",
  },
  "upper-top": {
    title: "⬆️ ऊपर की दाढ़ें",
    hint: "ऊपर चबाने वाली सतह: आगे-पीछे",
    cue: "और अब ऊपर की दाढ़ों पर। आगे-पीछे!",
  },
  "outer-left": {
    title: "⬅️ बाहर, एक तरफ़",
    hint: "बाहरी सतह: छोटे गोले",
    cue: "दाँत मिलाओ! बाहर, एक तरफ़। छोटे-छोटे गोले!",
  },
  "outer-front": {
    title: "😁 बाहर, सामने",
    hint: "बाहरी सतह: छोटे गोले",
    cue: "अब सामने। गोले, गोले, गोले!",
  },
  "outer-right": {
    title: "➡️ बाहर, दूसरी तरफ़",
    hint: "बाहरी सतह: छोटे गोले",
    cue: "और दूसरी तरफ़। अच्छे से गोले बनाओ!",
  },
  "inner-lower": {
    title: "👅 अंदर, नीचे",
    hint: "अंदरूनी सतह: लाल से सफ़ेद की ओर",
    cue: "मुँह खूब खोलो! अब अंदर नीचे, जहाँ जीभ है।",
  },
  "inner-upper": {
    title: "👅 अंदर, ऊपर",
    hint: "अंदरूनी सतह: लाल से सफ़ेद की ओर",
    cue: "और अंदर ऊपर। बस थोड़ा-सा और!",
  },
};
