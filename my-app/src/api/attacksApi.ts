import { AttackEvent } from "../types/attack";

const API_BASE = "http://localhost:4000/api";

/**
 * Fetch real cyber attacks (ThreatFox + AbuseIPDB)
 */
export async function fetchAttacks(): Promise<AttackEvent[]> {
  const res = await fetch(`${API_BASE}/attacks`);

  if (!res.ok) {
    throw new Error("Failed to fetch attacks");
  }

  const data = await res.json();

  return data.map((a: any) => ({
    ...a,
    timestamp: new Date(a.timestamp)
  }));
}

/**
 * Fetch cybersecurity news for LatestAttacksFeed
 */
export async function fetchCyberNews(): Promise<AttackEvent[]> {
  const res = await fetch(`${API_BASE}/cyber-news`);

  if (!res.ok) {
    throw new Error("Failed to fetch cyber news");
  }

  const data = await res.json();

  return data.map((n: any) => ({
    id: n.id,
    type: "Cyber News",
    severity: n.severity || "medium",
    country: n.country || "Global",
    countryCode: n.countryCode || "GL",
    timestamp: new Date(n.timestamp),
    source: n.source,
    target: n.target,
    description: n.description,
    feed: n.feed || "CyberNews"
  }));
}