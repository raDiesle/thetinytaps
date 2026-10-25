import { Navigate, useParams } from "react-router";
import { FeelingsGame } from "@/games/feelings/FeelingsGame";
import { findPlace } from "@/games/feelings/places";
import { useTitle } from "@/lib/title";

export function FeelingsPage() {
  const { place = "" } = useParams();
  const found = findPlace(place);
  useTitle(found ? `Gefühle: ${found.title}` : "Gefühle");
  if (!found) return <Navigate to="/gefuehle/" replace />;
  return <FeelingsGame place={found} />;
}
