import { type HTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Bookshelf } from "@/components/Bookshelf";
import { SHELF } from "@/content/games";
import { useTurnPage } from "@/lib/look";
import { useT } from "@/lib/language";
import { usePreloadPages } from "@/lib/preloadPages";
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** Holding Papa Fox and his child on the title's o this long opens the hidden management page. */
const IDEAS_HOLD_MS = 2000;

/** Where the shelf's books lead. */
const HREFS = SHELF.map((entry) => entry.href);

/** Impressum and Datenschutz, for grown-ups: small in the room's corner. */
function LegalLinks() {
  const t = useT();
  return (
    <>
      <LegalLink to="/impressum/">
        {t({ de: "Impressum", ru: "Выходные данные", en: "Legal notice", zh: "网站信息", hi: "कानूनी जानकारी", es: "Aviso legal", ar: "بيانات الموقع" })}
      </LegalLink>{" "}
      ·{" "}
      <LegalLink to="/datenschutz/">
        {t({ de: "Datenschutz", ru: "Конфиденциальность", en: "Privacy", zh: "隐私", hi: "गोपनीयता", es: "Privacidad", ar: "الخصوصية" })}
      </LegalLink>
    </>
  );
}

/** One of the LegalLinks: the page turns to it. */
function LegalLink({ to, children }: { to: string; children: ReactNode }) {
  const turnPage = useTurnPage(to, "forward");
  return (
    <Link to={to} onClick={turnPage}>
      {children}
    </Link>
  );
}

/**
 * The home page: a room with a bookshelf, its books the categories (Bookshelf). The bookshelf fills the screen and nothing
 * is to be scrolled to (user feedback, October 2026): what grown-ups read and the install hint open from the carving's
 * „mehr …“ (RoomNotes), the legal links small in the room's corner.
 */
export function Home() {
  useTitle();
  useUpdateBetweenGames();
  usePreloadPages(HREFS);
  const secretProps = useSecretHold();
  return <Bookshelf secretProps={secretProps} legal={<LegalLinks />} />;
}

/** Holding the foxes on the title's o opens the hidden management page: the handlers for them. */
function useSecretHold(): HTMLAttributes<HTMLElement> {
  const navigate = useNavigate();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginHold = () => {
    holdTimer.current = setTimeout(() => navigate("/management/"), IDEAS_HOLD_MS);
  };
  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  useEffect(() => cancelHold, []);

  return {
    onPointerDown: beginHold,
    onPointerUp: cancelHold,
    onPointerLeave: cancelHold,
    onPointerCancel: cancelHold,
    onContextMenu: (e) => e.preventDefault(),
  };
}
