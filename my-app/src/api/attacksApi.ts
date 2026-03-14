import { AttackEvent } from "../types/attack";

export async function fetchAttacks(): Promise<AttackEvent[]> {
  const res = await fetch("http://localhost:4000/api/attacks");

  if (!res.ok) {
    throw new Error("Failed to fetch attacks");
  }

  const data = await res.json();

  return data.map((a: any) => ({
    ...a,
    timestamp: new Date(a.timestamp)
  }));
}