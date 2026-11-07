import { CONTACT_EMAIL } from "@/content/legal";

/**
 * A mail link to the makers, for feedback and ideas. Only the envelope and the address, so it needs no translation and
 * reads the same in every language; it opens the grown-up's mail app and sends nothing by itself.
 */
export function ContactLink({ className }: { className?: string }) {
  return (
    <a className={className} href={`mailto:${CONTACT_EMAIL}`}>
      <span aria-hidden>✉️ </span>
      {CONTACT_EMAIL}
    </a>
  );
}
