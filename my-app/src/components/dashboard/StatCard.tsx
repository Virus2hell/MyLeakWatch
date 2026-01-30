import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'critical' | 'warning' | 'success';
}

const variantStyles = {
  default: 'text-primary',
  critical: 'text-destructive',
  warning: 'text-warning',
  success: 'text-success',
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <div className="stat-card group">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className={cn(
          "absolute top-2 right-2 w-8 h-8 rounded-full opacity-10",
          variant === 'critical' && 'bg-destructive',
          variant === 'warning' && 'bg-warning',
          variant === 'success' && 'bg-success',
          variant === 'default' && 'bg-primary'
        )} />
      </div>
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-4xl font-bold font-mono cyber-glow-text",
              variantStyles[variant]
            )}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {trend && (
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? 'text-destructive' : 'text-success'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-lg bg-muted/50 transition-all duration-300 group-hover:scale-110",
          variantStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-full opacity-50",
        variant === 'critical' && 'bg-gradient-to-r from-destructive to-transparent',
        variant === 'warning' && 'bg-gradient-to-r from-warning to-transparent',
        variant === 'success' && 'bg-gradient-to-r from-success to-transparent',
        variant === 'default' && 'bg-gradient-to-r from-primary to-transparent'
      )} />
    </div>
  );
}
