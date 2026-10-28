import type { SceneTranslation } from "../types";

// The Spanish words of the Zoo picture: names (without article, with gender for el/la),
// what each item says and the chain sentences. Neutral Spanish for Spain and Latin America.

/** „Zoo“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Zoo",
  description: "León, elefante y pingüinos en el zoo.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol brilla!", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "Los animales se mojan."] },
    luftballon: { name: "globo", gender: "m", sentences: ["¡El globo se va volando!", "El globo es rojo."] },
    giraffe: { name: "jirafa", gender: "f", sentences: ["La jirafa come hojas de lo más alto del árbol.", "¡Ñam, ñam! La jirafa tiene el cuello largo."] },
    strauss: { name: "avestruz", gender: "m", sentences: ["¡El avestruz corre muy rápido!", "El avestruz es un pájaro grande."] },
    zebra: { name: "cebra", gender: "f", sentences: ["¡Uy! La cebra salta.", "La cebra tiene rayas negras y blancas."] },
    elefant: {
      name: "elefante",
      gender: "m",
      sentences: ["¡Tuuu! El elefante echa agua.", "El elefante tiene una trompa larga.", "El elefante es muy grande."],
    },
    elefantenbaby: { name: "elefantito", gender: "m", sentences: ["¡El elefantito también echa agua!", "¡Tutú! El elefantito mueve las orejas."] },
    papagei: { name: "loro", gender: "m", sentences: ["¡Hola! El loro sabe hablar.", "El loro es rojo y de muchos colores."] },
    affe: { name: "mono", gender: "m", sentences: ["¡Uy! El mono se columpia en la cuerda.", "¡Uh, uh, ah, ah! El mono es gracioso."] },
    aeffchen: { name: "monito", gender: "m", sentences: ["El monito come un plátano.", "¡Mmm, qué rico! El monito aplaude."] },
    panda: { name: "panda", gender: "m", sentences: ["El panda come bambú.", "¡Ñam, ñam! El panda es blanco y negro."] },
    loewe: {
      name: "león",
      gender: "m",
      sentences: ["¡Grrraaa! El león bosteza muy fuerte.", "El león está tumbado en su roca.", "El león tiene una melena grande."],
    },
    loewenbaby: { name: "leoncito", gender: "m", sentences: ["El leoncito juega.", "El leoncito ruge muy bajito: ¡grrr!"] },
    nashorn: { name: "rinoceronte", gender: "m", sentences: ["¡Fff! El rinoceronte pisa fuerte.", "El rinoceronte tiene un cuerno en la nariz."] },
    kaenguru: { name: "canguro", gender: "m", sentences: ["¡Hop, hop! El canguro salta.", "En la bolsa vive el bebé canguro."] },
    koala: { name: "koala", gender: "m", sentences: ["El koala se despierta y saluda.", "Al koala le gusta dormir en el árbol."] },
    flamingo: { name: "flamenco", gender: "m", sentences: ["El flamenco está sobre una pata.", "El flamenco es rosa."] },
    bimmelbahn: { name: "trenecito", gender: "m", sentences: ["¡Tilín, tilín! El trenecito recorre el zoo.", "Los niños saludan desde el trenecito."] },
    pfau: { name: "pavo real", gender: "m", sentences: ["¡Mira! El pavo real abre la cola.", "El pavo real tiene plumas muy bonitas."] },
    tierpfleger: { name: "cuidadora", gender: "f", sentences: ["¡Hola! La cuidadora trae la comida.", "La cuidadora lanza un pez."] },
    taube: { name: "paloma", gender: "f", sentences: ["¡Cu, cu! La paloma picotea migas.", "La paloma aletea."] },
    kind: { name: "niño", gender: "m", sentences: ["El niño tiene un helado. ¡Qué rico!", "El niño salta de alegría."] },
    eiswagen: { name: "camión de helados", gender: "m", sentences: ["¡Tilín, tilín! Llega el camión de helados.", "Hay helado de fresa y de chocolate."] },
    pinguin: { name: "pingüino", gender: "m", sentences: ["¡Yupiii! El pingüino se desliza al agua.", "El pingüino nada muy bien."] },
    pinguinkueken: { name: "pingüinito", gender: "m", sentences: ["El pingüinito camina balanceándose.", "El pingüinito es muy suave."] },
    fisch: { name: "pez", gender: "m", sentences: ["¡Plas! El pez salta fuera del agua.", "El pez es azul."] },
    seehund: { name: "foca", gender: "f", sentences: ["¡Au, au! La foca juega con la pelota.", "La foca aplaude con las aletas."] },
    erdmaennchen: { name: "suricata", gender: "f", sentences: ["¡Uy! La suricata se asoma por el agujero.", "La suricata vigila con atención."] },
    schmetterling: { name: "mariposa", gender: "f", sentences: ["La mariposa vuela a las flores.", "La mariposa es amarilla."] },
    schildkroete: { name: "tortuga", gender: "f", sentences: ["La tortuga se esconde en su caparazón.", "¡Hola! Ya está aquí otra vez."] },
    krokodil: { name: "cocodrilo", gender: "m", sentences: ["¡Ñac! El cocodrilo abre y cierra la boca.", "El cocodrilo es verde."] },
    nilpferd: { name: "hipopótamo", gender: "m", sentences: ["El hipopótamo abre muchísimo la boca.", "¡Blub! El hipopótamo se baña en el río."] },
    pelikan: { name: "pelícano", gender: "m", sentences: ["¡Zas! El pelícano atrapa un pez.", "El pelícano tiene un pico grande."] },
  },
  chains: [
    ["La foca atrapa el pez. ¡Au, au!", "¡Y el pingüino se desliza rápido detrás!"],
    ["¡Uy! El avestruz se va corriendo.", "Y el leoncito también ruge, muy bajito."],
    ["¡El elefantito le echa agua también!", "¡Oh! El rinoceronte se moja todo."],
  ],
};
