import type { Daytime, DaytimeTexts } from "./daytime";

/** The morning and evening texts in Hindi; a text missing here is said in German (see daytimeText). */
export const DAYTIME_HI: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "सुप्रभात!",
    grow: "रात भर में इस चीनी से चीनी-मॉन्स्टर बन जाते हैं।",
    doneTitle: "☀️ चमचमाते दाँत!",
    after: "अब दिन शुरू हो सकता है!",
  },
  evening: {
    hello: "जल्दी ही सोने का समय है।",
    grow: "पूरे दिन में इस चीनी से चीनी-मॉन्स्टर बन जाते हैं।",
    doneTitle: "🌙 शुभ रात्रि!",
    after: "अब चलो बिस्तर में। शुभ रात्रि!",
  },
};
