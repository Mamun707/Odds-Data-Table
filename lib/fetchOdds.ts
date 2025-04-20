import {OddsEntry} from "@/types/odds";

export async function fetchOdds(): Promise<OddsEntry[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/odds`, { cache: "no-store" });
	if (!res.ok) throw new Error("Failed to fetch odds");
	return res.json();
}