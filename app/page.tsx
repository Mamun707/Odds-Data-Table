import { fetchOdds } from "@/lib/fetchOdds";
import OddsTable from "@/components/OddsTable";

export default async function OddsPage() {
  const initialOdds = await fetchOdds();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-bold mb-4 bg-purple-700">Live Odds Table</h1>
      <OddsTable initialOdds={initialOdds} />
    </div>
  );
}
