import { DataState } from "@/components/data-state";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingPortfolio() {
  return <Card><CardContent className="pt-6"><DataState state="loading" /></CardContent></Card>;
}
