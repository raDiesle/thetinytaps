import type { CSSProperties } from "react";
import { MenuButton } from "@/components/HomeOptions";
import { Trophy } from "@/components/Trophy";
import { useT } from "@/lib/language";
import { gameOf, gameOrder, type TrophyWon, useTrophies } from "@/lib/trophies";

/*
 * The trophies a child has won (user decision, November 2026), standing in the bookshelf on the home page: at the right
 * end of the lowest board of picture books, where the child's eye finds them beside the books, in place of the books
 * only filling the shelf there. As many as fit stand there, the newest; one tap opens them all, by game (TrophyCabinet).
 * Before the first trophy nothing stands there: the books spine out fill the end as before.
 */

/** A trophy's height on the shelf, in picture books' heights. */
export const SHELF_TROPHY = 0.5;

/** The room between two trophies, in picture books' heights. */
const TROPHY_GAP = 0.03;

/** How many of `won` trophies stand in `room` px beside the books `bh` high, and the width they take (0 for none). */
export function trophyRow(room: number, bh: number, won: number) {
  const w = (SHELF_TROPHY * bh * 2) / 3;
  const fit = Math.floor((room - 4 + TROPHY_GAP * bh) / (w + TROPHY_GAP * bh));
  // At least one, where any was won: the way to all of them must be there, a little over the end if need be.
  const count = won > 0 ? Math.max(1, Math.min(won, fit)) : 0;
  return { count, width: count > 0 ? count * w + (count - 1) * TROPHY_GAP * bh + 4 : 0 };
}

/** The newest trophies standing on the board, `count` of them; a tap opens all of them. */
export function TrophyShelf({ count, bh }: { count: number; bh: number }) {
  const t = useT();
  const won = useTrophies();
  if (count <= 0 || won.length === 0) return null;
  const label = t({ de: "Pokale" });
  const style = { "--trophy-h": `${SHELF_TROPHY * bh}px`, "--trophy-gap": `${TROPHY_GAP * bh}px` } as CSSProperties;
  return (
    <MenuButton
      icon="🏆"
      label={label}
      className="room-thing shelf-trophies"
      art={
        <span className="shelf-trophies-row" style={style}>
          {won.slice(-count).map((trophy) => (
            <Trophy key={`${trophy.game}#${trophy.level}`} game={trophy.game} level={trophy.level} className="shelf-trophy" />
          ))}
        </span>
      }
    >
      <TrophyCabinet won={won} />
    </MenuButton>
  );
}

/** Every trophy won, grouped by game in the shelf's order, each game's in the order they were won. */
function TrophyCabinet({ won }: { won: TrophyWon[] }) {
  const t = useT();
  const games = [...new Set(won.map((trophy) => trophy.game))].sort((a, b) => gameOrder(a) - gameOrder(b));
  return (
    <div className="trophy-cabinet">
      {games.map((href) => {
        const game = gameOf(href);
        const name = game ? t(game.title) : href;
        return (
          <section key={href} className="trophy-cabinet-game">
            <h3>{name}</h3>
            <div className="trophy-cabinet-row">
              {won
                .filter((trophy) => trophy.game === href)
                .map((trophy) => (
                  <Trophy key={trophy.level} game={href} level={trophy.level} className="trophy-cabinet-trophy" label={name} />
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
