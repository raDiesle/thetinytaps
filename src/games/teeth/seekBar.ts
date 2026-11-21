/**
 * Tapping or dragging on the progress bar always lands at the start of a section, never at the very second under the
 * finger (user feedback, November 2026): a step, or a part of the time before the brushing (the story, the sink, the
 * first look in the mirror). `starts` are the sections' starts on the clock in ms, in order; the result is the start of
 * the section `at` lies in.
 */
export function sectionStart(at: number, starts: number[]): number {
  let start = starts[0] ?? 0;
  for (const s of starts) if (s <= at) start = s;
  return start;
}
