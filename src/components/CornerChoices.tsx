/** One choice of a `CornerChoices` note: its value and its words. */
export interface CornerChoice<T extends string> {
  /** What is chosen. */
  value: T;
  /** Its name in words, in the app language – no signs or emoji. */
  label: string;
}

/**
 * A game's one option while playing, right in the top right corner as a small paper note listing the choices in words –
 * no ⚙️ to hold and no panel popping up over the game (user decision, November 2026, first in Was gehört zum Tier?'s
 * „Was drankommt“, then Erkennen's pictures): the chosen one is marked by the highlighter's stroke. It stands left of
 * the fullscreen slip while that shows, in one row in the band above the picture, wrapping onto a second line on a
 * narrow screen, never down over the picture (`.corner-choices` in `playing.css`).
 */
export function CornerChoices<T extends string>({
  title,
  value,
  choices,
  onChange,
}: {
  /** What the choices are about, quiet before them („Was drankommt“). */
  title: string;
  value: T;
  choices: CornerChoice<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <nav className="corner-choices" aria-label={title} data-tap-root onPointerDown={(e) => e.stopPropagation()}>
      <span className="corner-choices-title" aria-hidden>
        {title}
      </span>
      {choices.map((choice) => (
        <button
          key={choice.value}
          type="button"
          className="corner-choice"
          aria-pressed={choice.value === value}
          // No focus left on it, so Space and Enter keep playing the game.
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => onChange(choice.value)}
        >
          <span className="corner-choice-label">{choice.label}</span>
        </button>
      ))}
    </nav>
  );
}
