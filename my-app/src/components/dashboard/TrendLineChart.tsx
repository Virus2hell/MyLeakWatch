import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AttackTrend } from '../../types/attack';
import { format, parseISO } from 'date-fns';

interface TrendLineChartProps {
  data: AttackTrend[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-foreground mb-2">
          {format(parseISO(label), 'MMM dd, yyyy')}
        </p>
        <div className="space-y-1 text-sm">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground capitalize">{entry.name}:</span>
              <span className="font-mono" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function TrendLineChart({ data }: TrendLineChartProps) {
  // Aggregate to weekly data for better visualization
  const aggregatedData = data.reduce((acc, curr, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = {
        date: curr.date,
        attacks: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      };
    }
    acc[weekIndex].attacks += curr.attacks;
    acc[weekIndex].critical += curr.critical;
    acc[weekIndex].high += curr.high;
    acc[weekIndex].medium += curr.medium;
    acc[weekIndex].low += curr.low;
    return acc;
  }, [] as AttackTrend[]);

  return (
    <div className="stat-card h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Attack Trends Over Time</h3>
        <span className="text-xs text-muted-foreground font-mono">
          WEEKLY AGGREGATION
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={aggregatedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(222, 30%, 18%)" 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            stroke="hsl(215, 20%, 55%)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="hsl(215, 20%, 55%)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => <span className="text-xs capitalize text-muted-foreground">{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="critical" 
            stroke="hsl(0, 85%, 55%)" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="hsl(35, 100%, 55%)" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="medium" 
            stroke="hsl(270, 60%, 55%)" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="hsl(180, 100%, 50%)" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
