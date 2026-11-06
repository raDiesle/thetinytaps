import { CopyGame } from "@/games/feelings/CopyGame";
import { COPY_TITLE } from "@/games/feelings/copy";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function CopyFacesPage() {
  const t = useT();
  useTitle(t(COPY_TITLE));
  return <CopyGame />;
}
