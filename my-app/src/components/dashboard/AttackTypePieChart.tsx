import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AttackByType } from '../../types/attack';

interface AttackTypePieChartProps {
  data: AttackByType[];
}

const COLORS = [
  'hsl(180, 100%, 50%)',   // cyan - primary
  'hsl(270, 60%, 55%)',    // purple - secondary
  'hsl(145, 80%, 45%)',    // green - success
  'hsl(35, 100%, 55%)',    // orange - warning
  'hsl(0, 85%, 55%)',      // red - destructive
  'hsl(200, 80%, 50%)',    // blue
  'hsl(320, 70%, 55%)',    // pink
  'hsl(160, 70%, 45%)',    // teal
  'hsl(45, 90%, 50%)',     // yellow
  'hsl(280, 50%, 50%)',    // violet
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-foreground">{data.type}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-primary">{data.count}</span> attacks ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5 text-xs">
          <div 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function AttackTypePieChart({ data }: AttackTypePieChartProps) {
  return (
    <div className="stat-card h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Attack Types Distribution</h3>
        <span className="text-xs text-muted-foreground font-mono">
          {data.length} CATEGORIES
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="count"
            nameKey="type"
            stroke="hsl(222, 47%, 6%)"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
