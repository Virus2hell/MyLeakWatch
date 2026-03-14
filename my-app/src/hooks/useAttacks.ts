import { useEffect, useState } from "react";
import { fetchAttacks } from "../api/attacksApi";
import { AttackEvent } from "../types/attack";

export function useAttacks() {
  const [attacks, setAttacks] = useState<AttackEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAttacks();
      setAttacks(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();

    const interval = setInterval(load, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return { attacks, loading, refresh: load };
}