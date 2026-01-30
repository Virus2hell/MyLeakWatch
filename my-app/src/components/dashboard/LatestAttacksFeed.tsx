import { AttackEvent, AttackSeverity } from '../../types/attack';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Shield, Bug, Zap, Globe } from 'lucide-react';

interface LatestAttacksFeedProps {
  attacks: AttackEvent[];
  limit?: number;
}

const severityConfig: Record<AttackSeverity, { 
  label: string; 
  className: string; 
  dotColor: string;
}> = {
  critical: { label: 'CRITICAL', className: 'border-destructive text-destructive', dotColor: 'bg-destructive' },
  high: { label: 'HIGH', className: 'border-warning text-warning', dotColor: 'bg-warning' },
  medium: { label: 'MEDIUM', className: 'border-secondary text-secondary', dotColor: 'bg-secondary' },
  low: { label: 'LOW', className: 'border-success text-success', dotColor: 'bg-success' },
};

const attackIcons: Record<string, typeof Shield> = {
  Malware: Bug,
  Phishing: Shield,
  Ransomware: AlertTriangle,
  DDoS: Zap,
  default: Globe,
};

function getAttackIcon(type: string) {
  return attackIcons[type] || attackIcons.default;
}

export function LatestAttacksFeed({ attacks, limit = 10 }: LatestAttacksFeedProps) {
  const latestAttacks = attacks.slice(0, limit);

  return (
    <div className="rounded-xl border border-border bg-background/50 p-4 shadow-sm flex flex-col h-[500px]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-ping" />
          <h3 className="text-lg font-semibold">Latest Attacks</h3>
        </div>
        <span className="text-xs text-muted-foreground font-mono">LIVE FEED</span>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-3 scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-muted/10">
        {latestAttacks.map((attack, index) => {
          const Icon = getAttackIcon(attack.type);
          const severity = severityConfig[attack.severity];

          return (
            <div
              key={attack.id}
              className={cn(
                "p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-200",
                "animate-slide-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    attack.severity === 'critical' && 'bg-destructive/20 text-destructive',
                    attack.severity === 'high' && 'bg-warning/20 text-warning',
                    attack.severity === 'medium' && 'bg-secondary/20 text-secondary',
                    attack.severity === 'low' && 'bg-success/20 text-success'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Attack Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{attack.id}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                        severity.className
                      )}
                    >
                      {severity.label}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                    {attack.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {attack.country}
                    </span>
                    <span>•</span>
                    <span>{attack.type}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(attack.timestamp, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
