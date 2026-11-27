import type { CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import type { SeoLanguage } from "@/content/seo";
import { pick } from "@/lib/language";
import { codeAddress, SCAN, SIGNS, shortAddress } from "./content";
import { QrCode } from "./QrCode";
import type { CardPose } from "./timeline";

/** How big the code is on the canvas: big enough for a phone across a living room to read it off a television. */
const CODE_SIZE = 360;

/**
 * The card every outro ends on (ideas Y-04 and Y-05): the `Logo`, „littlestepstogrow.com“, what the site is in five small
 * signs, and a code leading to the home page in `language`, coming up from below as `pose` says.
 */
export function EndCard({ pose, language }: { pose: CardPose; language: SeoLanguage }) {
  if (pose.card <= 0) return null;
  const address = codeAddress(language);
  return (
    <div className="vo-card" style={{ opacity: Math.min(1, pose.card * 1.6), translate: `0 ${(1 - pose.card) * 640}px` }}>
      <div className="vo-card-main">
        <Logo />
        <p className="vo-address">littlestepstogrow.com</p>
        <ul className="vo-signs">
          {SIGNS.map((sign, k) => (
            <li key={sign.icon} style={{ opacity: pose.signs[k], translate: `0 ${(1 - pose.signs[k]!) * 18}px` } as CSSProperties}>
              <span className="vo-sign-icon" aria-hidden>
                {sign.icon}
              </span>
              {pick(sign.text, language)}
            </li>
          ))}
        </ul>
      </div>
      <div className="vo-card-code" style={{ opacity: pose.code }}>
        <p className="vo-scan">{pick(SCAN, language)}</p>
        <QrCode text={address} size={CODE_SIZE} />
        <p className="vo-code-address">{shortAddress(address)}</p>
      </div>
    </div>
  );
}
