import { useState, useMemo, useCallback } from "react";
import { Shield, AlertTriangle, Activity, Globe } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { StatCard } from "./StatCard";
import { AttackTypePieChart } from "./AttackTypePieChart";
import { CountryBarChart } from "./CountryBarChart";
import { TrendLineChart } from "./TrendLineChart";
import { LatestAttacksFeed } from "./LatestAttacksFeed";
import { FilterControls } from "./FilterControls";
import { WorldMapHeatmap } from "./WorldMapHeatmap";

import {
  calculateAttackStats,
  calculateAttacksByType,
  calculateAttacksByCountry
} from "../../data/mockAttackData";

import {
  AttackEvent,
  AttackType,
  AttackSeverity,
  AttackTrend
} from "../../types/attack";

interface VisualMapsProps {
  attacks: AttackEvent[];
  news: AttackEvent[];
  trends: AttackTrend[];
  lastFetched?: Date;
  isLoading?: boolean;
  dataSource?: "live" | "mock";
  onRefresh?: () => void;
}

export const VisualMaps = ({
  attacks,
  news,
  trends,
  lastFetched = new Date(),
  isLoading = false,
  dataSource = "live",
  onRefresh
}: VisualMapsProps) => {

  const [filters, setFilters] = useState({
    dateRange: { start: null as Date | null, end: null as Date | null },
    country: null as string | null,
    attackType: null as AttackType | null,
    severity: null as AttackSeverity | null
  });

  const filteredAttacks = useMemo(() => {
    return attacks.filter((attack) => {
      if (filters.dateRange.start && attack.timestamp < filters.dateRange.start) return false;
      if (filters.dateRange.end && attack.timestamp > filters.dateRange.end) return false;
      if (filters.country && attack.country !== filters.country) return false;
      if (filters.attackType && attack.type !== filters.attackType) return false;
      if (filters.severity && attack.severity !== filters.severity) return false;

      return true;
    });
  }, [attacks, filters]);

  const stats = useMemo(
    () => calculateAttackStats(filteredAttacks),
    [filteredAttacks]
  );

  const attacksByType = useMemo(
    () => calculateAttacksByType(filteredAttacks),
    [filteredAttacks]
  );

  const attacksByCountry = useMemo(
    () => calculateAttacksByCountry(filteredAttacks),
    [filteredAttacks]
  );

  const uniqueCountries = useMemo(
    () => [...new Set(attacks.map((a) => a.country))].sort(),
    [attacks]
  );

  const handleRefresh = useCallback(() => {
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => setFilters(newFilters),
    []
  );

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <DashboardHeader
        onRefresh={handleRefresh}
        lastUpdated={lastFetched}
        isLoading={isLoading}
        dataSource={dataSource}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Attacks"
            value={stats.totalAttacks}
            subtitle="Last 6 months"
            icon={Shield}
          />

          <StatCard
            title="Critical Threats"
            value={stats.criticalCount}
            subtitle="Requiring immediate action"
            icon={AlertTriangle}
            variant="critical"
          />

          <StatCard
            title="Active Threats"
            value={stats.activeThreats}
            subtitle="Last 24 hours"
            icon={Activity}
            variant="warning"
          />

          <StatCard
            title="Countries Affected"
            value={stats.countriesAffected}
            subtitle="Global coverage"
            icon={Globe}
          />

        </section>

        <FilterControls
          countries={uniqueCountries}
          onFilterChange={handleFilterChange}
        />

        <section>
          <WorldMapHeatmap data={attacksByCountry} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttackTypePieChart data={attacksByType} />
          <CountryBarChart data={attacksByCountry} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <TrendLineChart data={trends} />
          </div>

          <LatestAttacksFeed attacks={news} limit={10} />

        </section>

      </main>
    </div>
  );
};