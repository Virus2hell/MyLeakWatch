import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AttackByType } from "../../types/attack";

interface AttackTypePieChartProps {
  data: AttackByType[];
}

const COLORS = [
  "hsl(180, 100%, 50%)",
  "hsl(270, 60%, 55%)",
  "hsl(145, 80%, 45%)",
  "hsl(35, 100%, 55%)",
  "hsl(0, 85%, 55%)",
  "hsl(200, 80%, 50%)",
  "hsl(320, 70%, 55%)",
  "hsl(160, 70%, 45%)",
  "hsl(45, 90%, 50%)",
  "hsl(280, 50%, 50%)",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-foreground">{data.type}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-primary">{data.count}</span> attacks (
          {data.percentage}%)
        </p>
      </div>
    );
  }

  return null;
};

export function AttackTypePieChart({ data }: AttackTypePieChartProps) {

  // sort by attack count
const sorted = [...data].sort((a, b) => b.count - a.count);

// how many slices we want
const MAX_PIE_ITEMS = 12;

// top categories for pie
const topTypes = sorted.slice(0, MAX_PIE_ITEMS);

// merge remaining into "Other"
const otherCount = sorted
  .slice(MAX_PIE_ITEMS)
  .reduce((sum, item) => sum + item.count, 0);

const pieData =
  otherCount > 0
    ? [...topTypes, { type: "Other", count: otherCount }]
    : topTypes;

  return (
    <div className="stat-card h-[400px]">

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Attack Types Distribution</h3>

        <span className="text-xs text-muted-foreground font-mono">
          {data.length} CATEGORIES
        </span>
      </div>

      <div className="flex h-[85%]">

        {/* LEFT : PIE CHART */}
        <div className="w-1/2 h-full">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="count"
                nameKey="type"
                stroke="hsl(222, 47%, 6%)"
                strokeWidth={2}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* RIGHT : ATTACK LIST */}
        <div className="w-1/2 h-full overflow-y-auto pl-4 pr-1">

          <div className="space-y-2">

            {sorted.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm bg-muted/20 px-3 py-2 rounded-md"
              >
                <div className="flex items-center gap-2">

                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-muted-foreground">
                    {item.type}
                  </span>

                </div>

                <span className="font-mono text-primary">
                  {item.count}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}