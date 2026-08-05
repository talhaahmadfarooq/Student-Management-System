interface AreaChartProps {
  data: { month: string; students: number }[];
  height?: number;
}

export function AreaChart({ data, height = 240 }: AreaChartProps) {
  const width = 720;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const max = Math.max(...data.map((d) => d.students));
  const min = Math.min(...data.map((d) => d.students));
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.students - min) / range) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const gridLines = 4;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const y = padding.top + (i / gridLines) * chartH;
        return (
          <line
            key={i}
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Area */}
      <path d={areaPath} fill="url(#areaGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i} className="group">
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#3b82f6" strokeWidth="2" className="transition-all group-hover:r-6" />
          <rect
            x={p.x - 30}
            y={p.y - 38}
            width="60"
            height="26"
            rx="6"
            fill="#1e293b"
            opacity="0"
            className="transition-opacity group-hover:opacity-100"
          />
          <text
            x={p.x}
            y={p.y - 22}
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="600"
            opacity="0"
            className="transition-opacity group-hover:opacity-100"
          >
            {p.students.toLocaleString()}
          </text>
        </g>
      ))}

      {/* X labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={height - 8}
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
          fillOpacity="0.5"
        >
          {p.month}
        </text>
      ))}
    </svg>
  );
}
