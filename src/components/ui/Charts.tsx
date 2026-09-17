import type { SkillScore } from "@/types";

interface PerformanceChartProps {
  scores: SkillScore[];
}

export function PerformanceChart({ scores }: PerformanceChartProps) {
  const maxValue = 100;
  const chartHeight = 240;
  const barWidth = 48;
  const gap = 24;
  const totalWidth = scores.length * (barWidth + gap) + gap;

  const getColor = (score: number) => {
    if (score >= 75) return "#10b981";
    if (score >= 50) return "#f59e0b";
    return "#f43f5e";
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalWidth} ${chartHeight + 60}`}
        className="w-full"
        style={{ minWidth: totalWidth }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = chartHeight - (v / maxValue) * chartHeight + 10;
          return (
            <g key={v}>
              <line
                x1={gap}
                y1={y}
                x2={totalWidth - gap / 2}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth={1}
                strokeDasharray={v === 0 ? "0" : "4 4"}
              />
              <text x={4} y={y + 4} fontSize={11} fill="#94a3b8" fontWeight={500}>
                {v}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {scores.map((score, i) => {
          const barHeight = (score.score / maxValue) * chartHeight;
          const x = gap + i * (barWidth + gap);
          const y = chartHeight - barHeight + 10;
          const color = getColor(score.score);

          return (
            <g key={score.skillName}>
              <defs>
                <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill={`url(#grad-${i})`}
              >
                <animate
                  attributeName="height"
                  from="0"
                  to={barHeight}
                  dur="0.8s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
                <animate
                  attributeName="y"
                  from={chartHeight + 10}
                  to={y}
                  dur="0.8s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
              </rect>
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill={color}
              >
                {score.score}%
              </text>
              <text
                x={x + barWidth / 2}
                y={chartHeight + 30}
                textAnchor="middle"
                fontSize={11}
                fill="#475569"
                fontWeight={500}
              >
                {score.skillName.length > 12
                  ? score.skillName.substring(0, 10) + "..."
                  : score.skillName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface RadarChartProps {
  scores: SkillScore[];
}

export function RadarChart({ scores }: RadarChartProps) {
  const size = 280;
  const center = size / 2;
  const radius = 100;
  const n = scores.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius + 30;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = scores
    .map((s, i) => {
      const p = getPoint(i, s.score);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm mx-auto">
      {/* Grid circles */}
      {[25, 50, 75, 100].map((v) => (
        <circle
          key={v}
          cx={center}
          cy={center}
          r={(v / 100) * radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={1}
          strokeDasharray="2 3"
        />
      ))}

      {/* Axis lines */}
      {scores.map((_, i) => {
        const p = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(37, 99, 235, 0.15)"
        stroke="#2563eb"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {scores.map((s, i) => {
        const p = getPoint(i, s.score);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#2563eb" />
        );
      })}

      {/* Labels */}
      {scores.map((s, i) => {
        const p = getLabelPoint(i);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill="#475569"
            fontWeight={500}
          >
            {s.skillName.length > 12 ? s.skillName.substring(0, 10) + "..." : s.skillName}
          </text>
        );
      })}
    </svg>
  );
}
