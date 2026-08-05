interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 180 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = size / 2 - 10;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const seg = { ...d, dash, gap: circumference - dash, offset: -offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
              strokeLinecap="butt"
            />
          ))}
        </g>
        <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="700" fill="currentColor">
          {total.toLocaleString()}
        </text>
        <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="currentColor" fillOpacity="0.5">
          Students
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2.5 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
            <span className="ml-auto font-medium text-slate-900 dark:text-white">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
