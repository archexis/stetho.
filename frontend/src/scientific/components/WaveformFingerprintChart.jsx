import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function WaveformFingerprintChart({ waveform, baselineWaveform, onSnapshot }) {
  const w = waveform ?? [];
  const b = baselineWaveform ?? [];
  const n = Math.min(w.length, b.length);
  const data = Array.from({ length: n }, (_, i) => ({
    x: i,
    live: w[i],
    baseline: b[i],
  }));

  return (
    <div className="instrument-card p-2" onClick={onSnapshot} role="button" tabIndex={0}>
      <div className="text-[12px] font-semibold tracking-[0.18em] mb-2" style={{ color: "var(--muted)" }}>
        LIVE ACOUSTIC FINGERPRINT
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} syncId="stetho-sync" margin={{ top: 6, right: 10, bottom: 6, left: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth={0.5} />
            <XAxis dataKey="x" hide />
            <YAxis hide domain={[-1.2, 1.2]} />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#E2E8F0"
              strokeWidth={1.0}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="live"
              stroke="var(--primary)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-[12px]" style={{ color: "var(--muted)" }}>
        Click chart to save snapshot (.wav + .json)
      </div>
    </div>
  );
}

