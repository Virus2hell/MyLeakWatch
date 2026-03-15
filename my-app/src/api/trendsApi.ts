import { AttackTrend } from "../types/attack";

export async function fetchAttackTrends(): Promise<AttackTrend[]> {
  const res = await fetch("http://localhost:4000/api/attack-trends");

  if (!res.ok) {
    throw new Error("Failed to fetch attack trends");
  }

  const data = await res.json();

  return data.map((t: any) => ({
    ...t,
    date: t.date
  }));
}