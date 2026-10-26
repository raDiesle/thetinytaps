import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Wolkenreise“ in Hindi: the lines of lines.ts, step by step.
// Tapsi speaks as "we" (करें, चलें) and gives the child commands (हिलाओ), because "I do" and
// "you did" would differ for a boy and a girl. The little cloud Wolle is रुई (cotton wool).

/** „Die Wolkenreise“ in Hindi. */
export const TRANSLATION: StoryTranslation = {
  defaultTurn: "अब तुम्हारी बारी!",
  opening: ["अरे! सूरज कहाँ है?", "वो मोटे से बारिश वाले बादल के पीछे छिपा है।", "चलो, उसे बाहर निकालें! साथ चलें?"],
  steps: [
    // 👋
    {
      situation: "नमस्ते! मैं टैप्सी हूँ। और ये है रुई, मेरा बादल!",
      instruction: "देखो, कीकी आ रहा है! चलो, हाथ हिलाएँ – ऐसे!",
      turn: "तुम भी कीकी को हाथ हिलाओ!",
      again: "हेलो, कीकी!",
      praise: "कीकी भी साथ उड़ रहा है!",
    },
    // 🐦
    {
      situation: "रुई उड़ना चाहता है। चलो, मदद करें!",
      instruction: "चिड़िया की तरह हाथ फड़फड़ाओ – ऐसे!",
      turn: "अब तुम – हाथ फड़फड़ाओ!",
      again: "फड़फड़, फड़फड़ – ऊपर, और ऊपर!",
      praise: "हम बहुत ऊँचा उड़ रहे हैं!",
    },
    // ✈️
    {
      situation: "अरे, छोटे-छोटे हवाई जहाज़ आ रहे हैं!",
      instruction: "जब जहाज़ आए, हम झुक जाएँ – ऐसे!",
      turn: "ध्यान से! झुक जाओ!",
      again: "फिर से झुको!",
      praise: "सारे जहाज़ निकल गए।",
    },
    // 🎈
    {
      situation: "कितने सारे गुब्बारे!",
      instruction: "हम उन्हें छूते हैं – फट! ऐसे!",
      turn: "अब तुम – उन्हें छुओ!",
      again: "फट! और फट!",
      praise: "कितनी सारी कॉन्फ़ेटी!",
    },
    // 🪑
    { instruction: "अब तेज़ चलेंगे! मेरे साथ बैठ जाओ – ऐसे!", praise: "कसकर पकड़ो!" },
    // ⭐
    {
      situation: "यहाँ कितने सारे तारे लटके हैं!",
      instruction: "एक तरफ़ झुको और तारा पकड़ो – ऐसे!",
      turn: "अब तुम – एक तरफ़ झुको!",
      again: "और दूसरी तरफ़!",
      praise: "सारे तारे मिल गए!",
    },
    // 🧍
    { instruction: "वो रहा बारिश वाला बादल! मेरे साथ उठो – ऐसे!", praise: "अब सूरज को निकालें!" },
    // 🌧️
    {
      situation: "यहाँ बारिश हो रही है! सूरज ऊपर है।",
      instruction: "दोनों हाथों से बादल को ऊपर धकेलो – ऐसे!",
      turn: "अब तुम – मेरे साथ धकेलो!",
      again: "ऊपर, ऊपर – सूरज आ रहा है!",
      praise: "वो रहा सूरज!",
    },
    // 🌈
    {
      situation: "अब बस इंद्रधनुष बाकी है।",
      instruction: "हाथ से एक बड़ा सा धनुष बनाओ – ऐसे!",
      turn: "अब तुम – मेरे साथ बनाओ!",
      again: "एक और रंग!",
      praise: "ये रहा इंद्रधनुष!",
    },
    // 🙌
    {
      situation: "सूरज मुस्कुरा रहा है!",
      instruction: "हाथ ऊपर – हुर्रे!",
      turn: "तुम भी – हुर्रे!",
      praise: "सूरज वापस आ गया!",
    },
    // 🏡
    {
      situation: "रुई हमें घर ले जा रहा है।",
      instruction: "चलो, टाटा करें – ऐसे!",
      turn: "तुम भी टाटा करो!",
      again: "टाटा, सूरज! टाटा, कीकी!",
      praise: "साथ उड़ने के लिए शुक्रिया! फिर मिलेंगे!",
    },
  ],
};
