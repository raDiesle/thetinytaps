import type { TogetherTranslation } from "./pairs";

// Hindi sentences for "Was gehört zusammen?", by the ids of the pairs in pairs.tsx. Both kinds are said with "चाहिए"
// ("… के लिए … चाहिए", "… को … चाहिए"), whose verb follows no one's gender; the one above stands in its oblique form
// (दरवाज़े, पतीले, डाकिये).

/** Hindi, for the table of languages in pairs.tsx. */
export const HINDI: TogetherTranslation = {
  zahnbuerste: {
    name: "टूथब्रश",
    partner: "टूथपेस्ट",
    question: "चलो, दाँत साफ़ करते हैं।",
    right: "टूथब्रश के लिए टूथपेस्ट चाहिए। बहुत बढ़िया!",
    belongs: "टूथब्रश के लिए टूथपेस्ट चाहिए!",
  },
  tuer: {
    name: "दरवाज़ा",
    partner: "चाबी",
    question: "दरवाज़ा बंद है। हमें अंदर जाना है।",
    right: "दरवाज़े के लिए चाबी चाहिए। बहुत बढ़िया!",
    belongs: "दरवाज़े के लिए चाबी चाहिए!",
  },
  topf: {
    name: "पतीला",
    partner: "ढक्कन",
    question: "पतीला खुला है। चलो, इसे बंद करते हैं।",
    right: "पतीले के लिए ढक्कन चाहिए। बहुत बढ़िया!",
    belongs: "पतीले के लिए ढक्कन चाहिए!",
  },
  blume: {
    name: "फूल",
    partner: "झारी",
    question: "फूल को प्यास लगी है।",
    right: "फूल के लिए झारी चाहिए। बहुत बढ़िया!",
    belongs: "फूल के लिए झारी चाहिए!",
  },
  papier: {
    name: "काग़ज़",
    partner: "क्रेयॉन",
    question: "चलो, एक तस्वीर बनाते हैं।",
    right: "काग़ज़ के लिए क्रेयॉन चाहिए। बहुत बढ़िया!",
    belongs: "काग़ज़ के लिए क्रेयॉन चाहिए!",
  },
  feuerwehr: {
    name: "दमकलकर्मी",
    partner: "पानी का पाइप",
    question: "दमकलकर्मी आग बुझाना चाहते हैं।",
    right: "दमकलकर्मी को पानी का पाइप चाहिए। बहुत बढ़िया!",
    belongs: "दमकलकर्मी को पानी का पाइप चाहिए!",
  },
  aerztin: {
    name: "डॉक्टर",
    partner: "स्टेथोस्कोप",
    question: "डॉक्टर तुम्हारे दिल की धड़कन सुनना चाहती है।",
    right: "डॉक्टर को स्टेथोस्कोप चाहिए। बहुत बढ़िया!",
    belongs: "डॉक्टर को स्टेथोस्कोप चाहिए!",
  },
  baecker: {
    name: "बेकर",
    partner: "बन",
    question: "बेकर नाश्ते के लिए कुछ स्वादिष्ट बेक करना चाहता है।",
    right: "बेकर को बन चाहिए। बहुत बढ़िया!",
    belongs: "बेकर को बन चाहिए!",
  },
  friseurin: {
    name: "हेयरड्रेसर",
    partner: "कैंची",
    question: "हेयरड्रेसर बाल काटना चाहती है।",
    right: "हेयरड्रेसर को कैंची चाहिए। बहुत बढ़िया!",
    belongs: "हेयरड्रेसर को कैंची चाहिए!",
  },
};
