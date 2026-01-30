import { useState } from 'react';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { AttackType, AttackSeverity } from '../../types/attack';

interface FilterControlsProps {
  countries: string[];
  onFilterChange: (filters: {
    dateRange: { start: Date | null; end: Date | null };
    country: string | null;
    attackType: AttackType | null;
    severity: AttackSeverity | null;
  }) => void;
}

const attackTypes: AttackType[] = [
  'Malware', 'Phishing', 'Ransomware', 'DDoS', 'SQL Injection',
  'XSS', 'Zero-Day', 'APT', 'Credential Theft', 'Supply Chain'
];

const severities: AttackSeverity[] = ['critical', 'high', 'medium', 'low'];

export function FilterControls({ countries, onFilterChange }: FilterControlsProps) {
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [country, setCountry] = useState<string | null>(null);
  const [attackType, setAttackType] = useState<AttackType | null>(null);
  const [severity, setSeverity] = useState<AttackSeverity | null>(null);

  const hasActiveFilters = dateRange.start || country || attackType || severity;

  const updateFilters = (updates: {
    dateRange?: { start: Date | null; end: Date | null };
    country?: string | null;
    attackType?: AttackType | null;
    severity?: AttackSeverity | null;
  }) => {
    const newFilters = {
      dateRange: updates.dateRange ?? dateRange,
      country: updates.country ?? country,
      attackType: updates.attackType ?? attackType,
      severity: updates.severity ?? severity,
    };
    onFilterChange(newFilters);
  };

  const clearAll = () => {
    setDateRange({ start: null, end: null });
    setCountry(null);
    setAttackType(null);
    setSeverity(null);
    onFilterChange({
      dateRange: { start: null, end: null },
      country: null,
      attackType: null,
      severity: null,
    });
  };

  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Date Range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Date Range</label>
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              className="bg-transparent text-sm outline-none"
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setDateRange((prev) => ({ ...prev, start: date }));
                updateFilters({ dateRange: { start: date, end: dateRange.end } });
              }}
            />
            <span className="text-xs text-muted-foreground">–</span>
            <input
              type="date"
              className="bg-transparent text-sm outline-none"
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setDateRange((prev) => ({ ...prev, end: date }));
                updateFilters({ dateRange: { start: dateRange.start, end: date } });
              }}
            />
          </div>
        </div>

        {/* Country */}
        <select
          value={country ?? 'all'}
          onChange={(e) => {
            const value = e.target.value === 'all' ? null : e.target.value;
            setCountry(value);
            updateFilters({ country: value });
          }}
          className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm outline-none hover:border-primary/40"
        >
          <option value="all">All Countries</option>
          {countries.slice(0, 15).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Attack Type */}
        <select
          value={attackType ?? 'all'}
          onChange={(e) => {
            const value = e.target.value === 'all' ? null : e.target.value as AttackType;
            setAttackType(value);
            updateFilters({ attackType: value });
          }}
          className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm outline-none hover:border-primary/40"
        >
          <option value="all">All Attack Types</option>
          {attackTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Severity */}
        <select
          value={severity ?? 'all'}
          onChange={(e) => {
            const value = e.target.value === 'all' ? null : e.target.value as AttackSeverity;
            setSeverity(value);
            updateFilters({ severity: value });
          }}
          className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm capitalize outline-none hover:border-primary/40"
        >
          <option value="all">All Severities</option>
          {severities.map((sev) => (
            <option key={sev} value={sev}>{sev}</option>
          ))}
        </select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border/50 pt-4">
          {dateRange.start && (
            <span className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
              {format(dateRange.start, 'MMM dd')}
              {dateRange.end && ` - ${format(dateRange.end, 'MMM dd')}`}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => {
                  setDateRange({ start: null, end: null });
                  updateFilters({ dateRange: { start: null, end: null } });
                }}
              />
            </span>
          )}

          {[country, attackType, severity].map(
            (val, i) =>
              val && (
                <span
                  key={i}
                  className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs capitalize text-primary"
                >
                  {val}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => {
                      if (val === country) setCountry(null);
                      if (val === attackType) setAttackType(null);
                      if (val === severity) setSeverity(null);
                      updateFilters({
                        country: null,
                        attackType: null,
                        severity: null,
                      });
                    }}
                  />
                </span>
              )
          )}
        </div>
      )}
    </div>
  );
}
