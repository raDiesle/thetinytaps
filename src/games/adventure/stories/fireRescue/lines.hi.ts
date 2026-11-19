import type { StoryTranslation } from "../story";

// What Tapsi says in „Fire Rescue“ in Hindi: the English lines of lines.ts, step by step (translated on request,
// 19 November 2026). Tapsi speaks as "we" (करें, चलें) and gives the child commands (खींचो), because "I do" and
// "you did" would differ for a boy and a girl. Robo, the hover robot, is रोबो.

/** „Fire Rescue“ in Hindi. */
export const TRANSLATION: StoryTranslation = {
  title: "दमकल बचाव अभियान",
  defaultTurn: "अब तुम्हारी बारी!",
  opening: ["अरे! देखो, वहाँ धुआँ है!", "और छत पर छोटे-छोटे बिल्ली के बच्चे बैठे हैं।", "हम मदद करेंगे! साथ चलें?"],
  steps: [
    // 👋
    {
      name: "कीकी को हाथ हिलाना",
      situation: "नमस्ते! मैं टैप्सी हूँ। और ये है रोबो, मेरा उड़ने वाला रोबोट!",
      instruction: "देखो, कीकी आ रहा है! चलो, हाथ हिलाएँ – ऐसे!",
      turn: "तुम भी कीकी को हाथ हिलाओ!",
      again: "हेलो, कीकी!",
      praise: "कीकी भी साथ चल रहा है!",
    },
    // 🔔
    {
      name: "दमकल की घंटी बजाना",
      situation: "दरवाज़ा बंद है। चलो, दमकल की घंटी बजाएँ!",
      instruction: "हाथ ऊपर बढ़ाओ और नीचे खींचो – ऐसे!",
      turn: "अब तुम – खींचो!",
      again: "टन-टन! दरवाज़ा ऊपर जा रहा है!",
      praise: "दरवाज़ा खुल गया। चलो, चलें!",
    },
    // 👕
    {
      name: "कपड़ों की रस्सियों के नीचे झुकना",
      situation: "रोबो सड़क पर उड़ रहा है। देखो, कपड़े सुखाने की रस्सियाँ!",
      instruction: "जब रस्सी आए, हम झुक जाएँ – ऐसे!",
      turn: "ध्यान से! झुक जाओ!",
      again: "फिर से झुको!",
      praise: "हम निकल गए!",
    },
    // 💧
    {
      name: "पानी पंप करना",
      situation: "रोबो को पाइप के लिए पानी चाहिए। देखो, एक फ़व्वारा!",
      instruction: "हैंडल पकड़ो और नीचे दबाओ – ऐसे!",
      turn: "अब तुम – पंप करो!",
      again: "गुड़-गुड़! पानी आ रहा है!",
      praise: "रोबो की टंकियाँ भर गईं!",
    },
    // 💦
    {
      name: "पानी से धुआँ हटाना",
      situation: "वो रहा धुएँ वाला घर!",
      instruction: "पाइप पकड़ो और पानी छोड़ो – बाएँ, और दाएँ! ऐसे!",
      turn: "अब तुम – पानी छिड़को!",
      again: "श्श्श! धुआँ जा रहा है!",
      praise: "सारा धुआँ चला गया!",
    },
    // 🐱
    {
      name: "बिल्ली के बच्चे पकड़ना",
      situation: "बिल्ली के बच्चे छत पर हैं। रोबो ऊपर उड़ रहा है!",
      instruction: "बाहें खोलो और पकड़ो – ऐसे!",
      turn: "ये आया एक बिल्ली का बच्चा – पकड़ो!",
      again: "और एक!",
      praise: "सारे बिल्ली के बच्चे बच गए!",
    },
    // 🎉
    {
      name: "हुर्रे!",
      situation: "हमने कर दिखाया!",
      instruction: "हाथ ऊपर – हुर्रे!",
      turn: "तुम भी – हुर्रे!",
      praise: "दमकल बचाव दल – हुर्रे!",
    },
    // 👋
    {
      name: "अलविदा कहना",
      situation: "रोबो बिल्ली के बच्चों को घर ले जा रहा है।",
      instruction: "चलो, टाटा करें – ऐसे!",
      turn: "तुम भी टाटा करो!",
      again: "टाटा, बिल्ली के बच्चो! टाटा, कीकी!",
      praise: "मदद के लिए शुक्रिया! फिर मिलेंगे!",
    },
  ],
};
