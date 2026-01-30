import { Shield, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DashboardHeaderProps {
  onRefresh: () => void;
  lastUpdated: Date;
  isLoading?: boolean;
  dataSource?: 'live' | 'mock';
}

export function DashboardHeader({ 
  onRefresh, 
  lastUpdated, 
  isLoading = false,
  dataSource = 'mock'
}: DashboardHeaderProps) {

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 cyber-glow">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  <span className="text-primary cyber-glow-text">CYBER</span>
                  <span className="text-foreground">SENTINEL</span>
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  THREAT INTELLIGENCE DASHBOARD
                </p>
              </div>
            </div>
          </div>

          {/* Right: Data & Refresh */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              {dataSource === 'live' ? (
                <>
                  <Wifi className="w-3 h-3 text-success" />
                  <span className="font-mono text-success">LIVE • OTX</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-warning" />
                  <span className="font-mono text-warning">MOCK DATA</span>
                </>
              )}
              <span className="text-border">|</span>
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>

            {/* Native button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={cn(
                "flex items-center rounded-md border border-primary/30 px-3 py-1 text-sm font-medium transition-colors",
                "hover:bg-primary/10 hover:border-primary",
                isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              )}
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4 mr-2",
                  isLoading && "animate-spin"
                )}
              />
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
