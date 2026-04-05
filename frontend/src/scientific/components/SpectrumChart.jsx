import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const baselineStroke = "#737373";
const graphStroke = "var(--graph)";

export function SpectrumChart({ baselineFft, currentFft }) {
  const n = Math.min(baselineFft?.length ?? 0, currentFft?.length ?? 0);
  const data = Array.from({ length: n }).map((_, i) => ({
    bin: i,
    baseline: baselineFft[i],
    current: currentFft[i],
  }));

  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="2 2" strokeWidth={0.5} />
          <XAxis dataKey="bin" hide />
          <YAxis hide domain={[0, 1.05]} />
          <Line type="monotone" dataKey="baseline" stroke={baselineStroke} strokeWidth={1.0} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="current" stroke={graphStroke} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

