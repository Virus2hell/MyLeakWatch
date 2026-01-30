import { AttackEvent, AttackByType, AttackByCountry, AttackTrend, AttackStats, AttackType, AttackSeverity } from '../types/attack';

const attackTypes: AttackType[] = [
  'Malware', 'Phishing', 'Ransomware', 'DDoS', 'SQL Injection',
  'XSS', 'Zero-Day', 'APT', 'Credential Theft', 'Supply Chain'
];

const severities: AttackSeverity[] = ['critical', 'high', 'medium', 'low'];

const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Russia', code: 'RU' },
  { name: 'China', code: 'CN' },
  { name: 'North Korea', code: 'KP' },
  { name: 'Iran', code: 'IR' },
  { name: 'Brazil', code: 'BR' },
  { name: 'India', code: 'IN' },
  { name: 'Germany', code: 'DE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'Israel', code: 'IL' },
  { name: 'Netherlands', code: 'NL' },
];

const targets = [
  'Financial Institution', 'Healthcare Provider', 'Government Agency',
  'Energy Sector', 'Technology Company', 'Educational Institution',
  'Retail Corporation', 'Manufacturing Plant', 'Telecommunications',
  'Critical Infrastructure'
];

const sources = [
  'AlienVault OTX', 'MITRE ATT&CK', 'CVE Database', 'Threat Intelligence Feed',
  'CISA Alert', 'FBI Cyber Division', 'Europol EC3', 'NCSC UK'
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAttackDescription(type: AttackType, target: string): string {
  const descriptions: Record<AttackType, string[]> = {
    'Malware': [
      `Trojan malware detected targeting ${target} systems`,
      `New malware variant spreading through ${target} network`,
      `Botnet activity detected in ${target} infrastructure`
    ],
    'Phishing': [
      `Spear phishing campaign targeting ${target} employees`,
      `Business email compromise attempt at ${target}`,
      `Credential harvesting via fake ${target} login portal`
    ],
    'Ransomware': [
      `Ransomware attack encrypting ${target} data`,
      `Double extortion ransomware targeting ${target}`,
      `RaaS deployment detected at ${target}`
    ],
    'DDoS': [
      `Volumetric DDoS attack against ${target} services`,
      `Application layer DDoS targeting ${target} web servers`,
      `Amplification attack disrupting ${target} operations`
    ],
    'SQL Injection': [
      `SQL injection vulnerability exploited in ${target} database`,
      `Automated SQLi scanner targeting ${target} web applications`,
      `Data exfiltration via SQL injection at ${target}`
    ],
    'XSS': [
      `Stored XSS vulnerability found in ${target} portal`,
      `Reflected XSS attack against ${target} users`,
      `DOM-based XSS exploitation at ${target}`
    ],
    'Zero-Day': [
      `Zero-day exploit targeting ${target} software`,
      `Unpatched vulnerability exploited at ${target}`,
      `Novel attack vector discovered affecting ${target}`
    ],
    'APT': [
      `Advanced persistent threat group targeting ${target}`,
      `State-sponsored actors infiltrating ${target}`,
      `Long-term intrusion campaign at ${target}`
    ],
    'Credential Theft': [
      `Credential stuffing attack against ${target} accounts`,
      `Password spray attack targeting ${target} users`,
      `Keylogger deployment at ${target}`
    ],
    'Supply Chain': [
      `Supply chain compromise affecting ${target}`,
      `Third-party vendor breach impacting ${target}`,
      `Software supply chain attack at ${target}`
    ]
  };
  
  return randomElement(descriptions[type]);
}

export function generateMockAttacks(count: number): AttackEvent[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  return Array.from({ length: count }, (_, i) => {
    const country = randomElement(countries);
    const type = randomElement(attackTypes);
    const target = randomElement(targets);
    
    return {
      id: `ATK-${String(i + 1).padStart(6, '0')}`,
      type,
      severity: randomElement(severities),
      country: country.name,
      countryCode: country.code,
      timestamp: randomDate(startDate, endDate),
      source: randomElement(sources),
      target,
      description: generateAttackDescription(type, target),
      indicators: Math.random() > 0.5 ? [
        `IOC-${Math.random().toString(36).substring(7)}`,
        `HASH-${Math.random().toString(36).substring(2, 18)}`
      ] : undefined
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function calculateAttackStats(attacks: AttackEvent[]): AttackStats {
  const criticalCount = attacks.filter(a => a.severity === 'critical').length;
  const activeThreats = attacks.filter(a => {
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    return a.timestamp > dayAgo;
  }).length;
  const countriesAffected = new Set(attacks.map(a => a.countryCode)).size;
  
  return {
    totalAttacks: attacks.length,
    criticalCount,
    activeThreats,
    countriesAffected
  };
}

export function calculateAttacksByType(attacks: AttackEvent[]): AttackByType[] {
  const typeCounts = attacks.reduce((acc, attack) => {
    acc[attack.type] = (acc[attack.type] || 0) + 1;
    return acc;
  }, {} as Record<AttackType, number>);
  
  return Object.entries(typeCounts)
    .map(([type, count]) => ({
      type: type as AttackType,
      count,
      percentage: Math.round((count / attacks.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculateAttacksByCountry(attacks: AttackEvent[]): AttackByCountry[] {
  const countryCounts = attacks.reduce((acc, attack) => {
    const key = attack.countryCode;
    if (!acc[key]) {
      acc[key] = { country: attack.country, countryCode: key, count: 0 };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, AttackByCountry>);
  
  return Object.values(countryCounts).sort((a, b) => b.count - a.count);
}

export function calculateAttackTrends(attacks: AttackEvent[]): AttackTrend[] {
  const trends: Record<string, AttackTrend> = {};
  
  attacks.forEach(attack => {
    const dateKey = attack.timestamp.toISOString().split('T')[0];
    
    if (!trends[dateKey]) {
      trends[dateKey] = {
        date: dateKey,
        attacks: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      };
    }
    
    trends[dateKey].attacks++;
    trends[dateKey][attack.severity]++;
  });
  
  return Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));
}

// Generate initial mock data
export const mockAttacks = generateMockAttacks(500);
export const mockStats = calculateAttackStats(mockAttacks);
export const mockAttacksByType = calculateAttacksByType(mockAttacks);
export const mockAttacksByCountry = calculateAttacksByCountry(mockAttacks);
export const mockTrends = calculateAttackTrends(mockAttacks);
