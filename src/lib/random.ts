/**
 * Chance for the games, in one place: every game once had its own copy of these, and one of them shuffled with
 * `sort(() => Math.random() - 0.5)`, which favours some orders over others (`random.test.ts` keeps that out).
 */

/** A new list with the same items in random order, every order as likely as any other (Fisher–Yates); `list` stays as it is. */
export function shuffle<T>(list: readonly T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** One item of `list` by chance, each as likely as any other. An empty list has none to give: never call it with one. */
export function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}
