import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AttackByCountry } from '../../types/attack';

interface CountryBarChartProps {
  data: AttackByCountry[];
  limit?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-primary">{payload[0].value.toLocaleString()}</span> attacks
        </p>
      </div>
    );
  }
  return null;
};

export function CountryBarChart({ data, limit = 10 }: CountryBarChartProps) {
  const chartData = data.slice(0, limit);
  
  return (
    <div className="stat-card h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Attacks by Country</h3>
        <span className="text-xs text-muted-foreground font-mono">
          TOP {limit} ORIGINS
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(222, 30%, 18%)" 
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            type="number" 
            stroke="hsl(215, 20%, 55%)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="countryCode" 
            stroke="hsl(215, 20%, 55%)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(222, 30%, 15%)' }} />
          <Bar 
            dataKey="count" 
            radius={[0, 4, 4, 0]}
            maxBarSize={24}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={index === 0 
                  ? 'hsl(0, 85%, 55%)' 
                  : index < 3 
                    ? 'hsl(35, 100%, 55%)' 
                    : 'hsl(180, 100%, 50%)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
