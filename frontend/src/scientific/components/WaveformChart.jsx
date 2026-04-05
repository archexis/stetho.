import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function WaveformChart({ waveform }) {
  const data = (waveform ?? []).map((y, i) => ({ x: i, y }));
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="2 2" strokeWidth={0.5} />
          <XAxis dataKey="x" hide />
          <YAxis hide domain={[-1.2, 1.2]} />
          <Line type="monotone" dataKey="y" stroke="var(--graph)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

