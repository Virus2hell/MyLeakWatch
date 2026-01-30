import { useState, useMemo, useCallback } from 'react';
import { Shield, AlertTriangle, Activity, Globe } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { StatCard } from './StatCard';
import { AttackTypePieChart } from './AttackTypePieChart';
import { CountryBarChart } from './CountryBarChart';
import { TrendLineChart } from './TrendLineChart';
import { LatestAttacksFeed } from './LatestAttacksFeed';
import { FilterControls } from './FilterControls';
import { WorldMapHeatmap } from './WorldMapHeatmap';
import { 
  calculateAttackStats, 
  calculateAttacksByType, 
  calculateAttacksByCountry, 
  calculateAttackTrends 
} from '../../data/mockAttackData';
import { AttackEvent, AttackType, AttackSeverity } from '../../types/attack';

interface VisualMapsProps {
  attacks: AttackEvent[];
  lastFetched?: Date;
  isLoading?: boolean;
  dataSource?: 'live' | 'mock';
  onRefresh?: () => void;
}

export const VisualMaps = ({
  attacks,
  lastFetched = new Date(),
  isLoading = false,
  dataSource = 'mock',
  onRefresh,
}: VisualMapsProps) => {

  const [filters, setFilters] = useState<{
    dateRange: { start: Date | null; end: Date | null };
    country: string | null;
    attackType: AttackType | null;
    severity: AttackSeverity | null;
  }>({
    dateRange: { start: null, end: null },
    country: null,
    attackType: null,
    severity: null,
  });

  const filteredAttacks = useMemo(() => {
    return attacks.filter(attack => {
      if (filters.dateRange.start && attack.timestamp < filters.dateRange.start) return false;
      if (filters.dateRange.end && attack.timestamp > filters.dateRange.end) return false;
      if (filters.country && attack.country !== filters.country) return false;
      if (filters.attackType && attack.type !== filters.attackType) return false;
      if (filters.severity && attack.severity !== filters.severity) return false;
      return true;
    });
  }, [attacks, filters]);

  const stats = useMemo(() => calculateAttackStats(filteredAttacks), [filteredAttacks]);
  const attacksByType = useMemo(() => calculateAttacksByType(filteredAttacks), [filteredAttacks]);
  const attacksByCountry = useMemo(() => calculateAttacksByCountry(filteredAttacks), [filteredAttacks]);
  const trends = useMemo(() => calculateAttackTrends(filteredAttacks), [filteredAttacks]);

  const uniqueCountries = useMemo(() => [...new Set(attacks.map(a => a.country))].sort(), [attacks]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => setFilters(newFilters), []);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <DashboardHeader 
        onRefresh={handleRefresh} 
        lastUpdated={lastFetched} 
        isLoading={isLoading}
        dataSource={dataSource}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Attacks" value={stats.totalAttacks} subtitle="Last 6 months" icon={Shield} trend={{ value: 12, isPositive: true }} />
          <StatCard title="Critical Threats" value={stats.criticalCount} subtitle="Requiring immediate action" icon={AlertTriangle} variant="critical" trend={{ value: 8, isPositive: true }} />
          <StatCard title="Active Threats" value={stats.activeThreats} subtitle="Last 24 hours" icon={Activity} variant="warning" />
          <StatCard title="Countries Affected" value={stats.countriesAffected} subtitle="Global coverage" icon={Globe} variant="default" />
        </section>

        {/* Filters */}
        <FilterControls countries={uniqueCountries} onFilterChange={handleFilterChange} />

        {/* World Map */}
        <section>
          <WorldMapHeatmap data={attacksByCountry} />
        </section>

        {/* Charts Row 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttackTypePieChart data={attacksByType} />
          <CountryBarChart data={attacksByCountry} />
        </section>

        {/* Charts Row 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrendLineChart data={trends} />
          </div>
          <LatestAttacksFeed attacks={filteredAttacks} limit={8} />
        </section>

      </main>
    </div>
  );
};
