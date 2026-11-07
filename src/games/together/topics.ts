import type { Localized } from "@/lib/language";
import type { RoundKind } from "./levels";

// The topics the pairs are sorted into, so grown-ups may one day pick what comes up („Berufe“, „Zu Hause“,
// „Unterwegs“). Each topic belongs to one kind of round: things of the day go together, helpers need their tools.
// The wrong choices of a round come from other topics first (`dealRound`), so things of one topic may belong loosely
// together (soap and sponge in the bathroom); a partner that also fits another pair is named in `alsoFits`.

/** A topic's id, the key of its file in `scenes/`. */
export type TopicId = "bad" | "kueche" | "zuhause" | "kleidung" | "spielen" | "garten" | "wetter" | "unterwegs" | "feste" | "berufe" | "sport" | "fantasie";

/** One topic: its kind of round and its name for grown-ups. */
export interface Topic {
  kind: RoundKind;
  /** Its name, for grown-ups (a choice behind ⚙️ one day). */
  name: Localized;
}

export const TOPICS: Record<TopicId, Topic> = {
  bad: { kind: "pair", name: { de: "Im Bad" } },
  kueche: { kind: "pair", name: { de: "Küche & Essen" } },
  zuhause: { kind: "pair", name: { de: "Zu Hause" } },
  kleidung: { kind: "pair", name: { de: "Anziehen" } },
  spielen: { kind: "pair", name: { de: "Spielen, Malen & Musik" } },
  garten: { kind: "pair", name: { de: "Garten & Natur" } },
  wetter: { kind: "pair", name: { de: "Wetter & Jahreszeiten" } },
  unterwegs: { kind: "pair", name: { de: "Unterwegs" } },
  feste: { kind: "pair", name: { de: "Feste & Feiern" } },
  berufe: { kind: "helper", name: { de: "Berufe" } },
  sport: { kind: "helper", name: { de: "Sport" } },
  fantasie: { kind: "helper", name: { de: "Märchen & Abenteuer" } },
};
