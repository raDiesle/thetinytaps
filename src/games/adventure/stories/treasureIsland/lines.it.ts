import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Schatzinsel“ in Italian: the lines of lines.ts, step by step.
// Words that would change for a boy or a girl ("bravo", "alto") are left out or said for "us".

/** „Die Schatzinsel“ in Italian. */
export const TRANSLATION: StoryTranslation = {
  defaultTurn: "Ora tu!",
  opening: ["Guarda, laggiù c'è l'Isola del Tesoro!", "E lì c'è un tesoro!", "Vieni con me?"],
  steps: [
    // 👋
    {
      situation: "Ahoi! Sono Tapsi. Ed ecco Kiki, il mio pappagallo!",
      instruction: "Saluto Kiki con la mano, così!",
      turn: "Saluti anche tu Kiki?",
      again: "Ciao, Kiki!",
      praise: "Kiki è felice che sei qui!",
    },
    // 🎣
    {
      situation: "Adesso peschiamo!",
      instruction: "Indietro sopra la spalla, e lancia lontano, così!",
      turn: "Ora tu: lancia la canna!",
      again: "Indietro, e splash!",
      praise: "Quanti pesci!",
    },
    // 🪑
    { instruction: "Siediti con me, così!", praise: "Si parte!" },
    // 🛶
    {
      situation: "Ole nuota verso l'Isola del Tesoro!",
      instruction: "Guarda: la pagaia nell'acqua a destra, e a sinistra.",
      turn: "Rema con me!",
      again: "Rema, rema, l'isola è più vicina!",
      praise: "Ce l'abbiamo fatta! Ole è sulla spiaggia.",
    },
    // 🧍
    { instruction: "Siamo sull'isola! Alzati con me, così!", praise: "Andiamo avanti!" },
    // 🦂
    {
      situation: "Oh no! Gli scorpioni camminano su Ole!",
      instruction: "Piede su, e pesta forte e veloce, così!",
      turn: "Ora tu: pesta con me!",
      again: "Pesta, pesta, plop!",
      praise: "Gli scorpioni sono spariti!",
    },
    // 🌉
    {
      situation: "Un ponticello! E lassù galleggiano tante casse.",
      instruction: "Hop, e con la testa contro la cassa, bum!",
      turn: "Ora tu: salta con me!",
      again: "Hop, bum! Hop, bum!",
      praise: "Dall'altra parte! Tante stelle d'oro!",
    },
    // 🪵
    {
      situation: "Attenzione! Lassù dondola un tronco.",
      instruction: "Quando arriva, ci abbassiamo, così!",
      turn: "Arriva! Giù!",
      again: "E giù di nuovo!",
      praise: "Uff, il tronco è passato!",
    },
    // 🥁
    {
      situation: "Oh, tanti uccellini sul sentiero! E lì ci sono due tamburi.",
      instruction: "Sinistra, bum! E destra, bum! Così!",
      turn: "Ora tu: suona il tamburo!",
      again: "Bum, bum, gli uccellini volano via!",
      praise: "Il sentiero è libero!",
    },
    // ⚙️
    {
      situation: "Un cancello! E lì c'è una manovella.",
      instruction: "Giriamo la manovella, gira e gira, così!",
      turn: "Ora tu: gira con me!",
      again: "Gira e gira, il cancello sale!",
      praise: "Il cancello è aperto!",
    },
    // 🥥
    {
      situation: "Oh, la scimmia fa cadere le noci di cocco! Rotolano proprio verso di noi.",
      instruction: "Un passo grande di lato, e indietro. Così!",
      turn: "Cocco! Passo grande di lato!",
      again: "E di nuovo, fai spazio!",
      praise: "Tutte le noci di cocco sono passate.",
    },
    // 🦵
    {
      situation: "Adesso rotolano a sinistra!",
      instruction: "La gamba su, il cocco passa sotto. Così!",
      turn: "Ora tu: gamba su!",
      again: "Gamba su!",
      praise: "Passato sotto! Fantastico.",
    },
    // 🦶
    {
      situation: "E adesso arrivano in mezzo!",
      instruction: "Gambe larghe larghe, il cocco passa. Così!",
      turn: "Ora tu: gambe larghe!",
      again: "Gambe larghe!",
      praise: "Tra le gambe! Le scimmie ridono.",
    },
    // 🐒
    {
      situation: "Oh, scimmie! Lanciano noci di cocco!",
      instruction: "Ci spostiamo piano piano, di lato, così!",
      turn: "Ora tu: spostati!",
      again: "E dall'altra parte!",
      praise: "Mancato! Le scimmie battono le mani.",
    },
    // 🍎
    {
      situation: "Un melo! E lì c'è un cestino.",
      instruction: "Ci allunghiamo in alto e raccogliamo, così!",
      turn: "Ora tu: raccogli una mela!",
      again: "Su, e plof nel cestino!",
      praise: "Il cestino è pieno!",
    },
    // 🧩
    {
      situation: "Una porta con tre figure. Un indovinello!",
      instruction: "Facciamo come le figure. Prima grandi grandi, così!",
      turn: "Ora tu: grande grande!",
      more: ["E ora larghi, come una stella!", "E ora piccoli piccoli!", "Ancora da capo: grandi grandi!", "Larghi larghi!", "E piccoli piccoli!"],
      praise: "Indovinello risolto! La porta si apre.",
    },
    // 🕸️
    {
      situation: "Oh, tante ragnatele! Così non passiamo.",
      instruction: "La zampa su, e sventola lontano di lato, così!",
      turn: "Ora tu: sventola con me!",
      again: "Sinistra, e destra, via!",
      praise: "Il sentiero è libero! Il ragno saluta.",
    },
    // 🪢
    {
      situation: "Ecco che galleggia il forziere!",
      instruction: "Tiriamo la corda, una mano dopo l'altra, così!",
      turn: "Tira con me!",
      again: "Tira, tira, arriva!",
      praise: "Il forziere è qui!",
    },
    // 🔑
    {
      situation: "Oh, un lucchetto! Kiki porta la chiave.",
      instruction: "La prendo, la infilo e la giro, così!",
      turn: "Ora tu: gira la chiave!",
      again: "Clic, e ancora!",
      praise: "Il lucchetto è aperto!",
    },
    // 💰
    {
      situation: "Oh! Oro! I granchi ci portano il forziere. Salto giù!",
      instruction: "Mani dentro, fino in fondo, e lancia le monete in alto! Così!",
      turn: "Ora tu: mani dentro e lancia in alto!",
      again: "Mani dentro, lancia in alto!",
      praise: "Una pioggia d'oro!",
    },
    // 🙌
    {
      situation: "Abbiamo trovato il tesoro!",
      instruction: "Braccia in alto, urrà!",
      turn: "Anche tu, urrà!",
      again: "Urrà, un tesoro!",
      praise: "Quanto oro! Siamo ricchi!",
    },
    // 🌅
    {
      situation: "Il sole tramonta.",
      instruction: "Saluto Kiki, ciao ciao, così!",
      turn: "Saluti anche tu?",
      again: "Ciao, Kiki! Ciao, isola!",
      praise: "Grazie per aver giocato! A presto!",
    },
  ],
};
