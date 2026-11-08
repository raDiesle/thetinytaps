import type { TargetLanguageId } from "@/content/targetLanguages";
import { pick } from "@/lib/language";
import { ANIMAL_TEXTS, ANIMALS, GIFT_TEXTS, giverOf, type Animal } from "./content";
import { GIFTS } from "./gifts";
import { GROW_TEXTS, type Growth } from "./growth";
import { HOMES } from "./homes";
import type { FeedRound, GiftRound, GrowRound, HomeRound, RoundKind } from "./levels";

// Which recordings a round needs, so `AnimalsRounds` loads only those of the round on screen and the next one (the
// game says ≈570 lines per language; never all at once) and holds a round until the lines it starts with are there.

/** What a round is about before its choices are dealt: the kind and the animal or the small one. */
export type RoundSubject = { kind: "grow"; growth: Growth } | { kind: Exclude<RoundKind, "grow">; animal: Animal };

/** A dealt round of any kind. */
export type AnimalRound = FeedRound | GiftRound | HomeRound | GrowRound;

/** The round's own question, said as it starts (after the kind's, `intro`) and again when the child asks: in order. */
export function questionLines(subject: RoundSubject, language: TargetLanguageId): string[] {
  if (subject.kind === "grow") return [pick(GROW_TEXTS, language).whatBecomes(subject.growth)];
  const texts = pick(ANIMAL_TEXTS, language);
  if (subject.kind === "feed") return [texts.hungry(subject.animal), texts.whatEats(subject.animal)];
  return [subject.kind === "gift" ? pick(GIFT_TEXTS, language).whatGives(subject.animal) : texts.whereLives(subject.animal)];
}

/** What is said on the right pick (and the hungry animal's „Bäh!“): known before the choices are dealt. */
export function answerLines(subject: RoundSubject, language: TargetLanguageId): string[] {
  if (subject.kind === "grow") return [pick(GROW_TEXTS, language).becomes(subject.growth)];
  const { animal } = subject;
  const texts = pick(ANIMAL_TEXTS, language);
  if (subject.kind === "feed") return [texts.yummy(animal, animal.food!), texts.yuck(animal)];
  if (subject.kind === "gift") return [pick(GIFT_TEXTS, language).gives(animal, GIFTS[animal.gives!])];
  return [texts.movedIn(animal, HOMES[animal.home!])];
}

/** What is said on each wrong pick of the dealt `round`: who the gift or the home or the grown one belongs to. */
export function wrongLines(round: AnimalRound, language: TargetLanguageId): string[] {
  const others = <T>(items: T[]) => items.filter((_, i) => i !== round.correct);
  if (round.kind === "grow") return others(round.grown).map((g) => pick(GROW_TEXTS, language).comesFrom(g));
  if (round.kind === "gift") return others(round.gifts).map((gift) => pick(GIFT_TEXTS, language).comesFrom(gift, giverOf(gift)));
  if (round.kind === "home") {
    const texts = pick(ANIMAL_TEXTS, language);
    return others(round.homes).map((home) => texts.livesHere(ANIMALS.find((a) => a.home === home.id)!));
  }
  return [];
}
