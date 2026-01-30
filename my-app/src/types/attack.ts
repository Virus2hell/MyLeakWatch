export type AttackSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AttackType = 
  | 'Malware'
  | 'Phishing'
  | 'Ransomware'
  | 'DDoS'
  | 'SQL Injection'
  | 'XSS'
  | 'Zero-Day'
  | 'APT'
  | 'Credential Theft'
  | 'Supply Chain';

export interface AttackEvent {
  id: string;
  type: AttackType;
  severity: AttackSeverity;
  country: string;
  countryCode: string;
  timestamp: Date;
  source: string;
  target: string;
  description: string;
  indicators?: string[];
}

export interface AttackStats {
  totalAttacks: number;
  criticalCount: number;
  activeThreats: number;
  countriesAffected: number;
}

export interface AttackByType {
  type: AttackType;
  count: number;
  percentage: number;
}

export interface AttackByCountry {
  country: string;
  countryCode: string;
  count: number;
}

export interface AttackTrend {
  date: string;
  attacks: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface FilterState {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  countries: string[];
  attackTypes: AttackType[];
  severity: AttackSeverity[];
}
