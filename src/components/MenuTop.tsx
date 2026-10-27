import type { ReactNode } from "react";
import { Link } from "react-router";
import { FullscreenCorner } from "@/components/FullscreenButton";

/**
 * The top left corner of every menu but the home page: the way back and, for
 * grown-ups, the fullscreen button next to it – both on the left, so the sun in
 * the top right corner stays in sight.
 */
export function MenuTop({ to, children }: { to: string; children: ReactNode }) {
  return (
    <div className="menu-top">
      <Link to={to} className="back-link">
        ← {children}
      </Link>
      <FullscreenCorner />
    </div>
  );
}
