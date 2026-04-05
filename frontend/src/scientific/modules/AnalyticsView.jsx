import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { SpectrumChart } from "../components/SpectrumChart";

const graphStroke = "var(--graph)";

function computeHarmonicTotal({ fftMagnitude, baselineFft }) {
  const current = fftMagnitude ?? [];
  const base = baselineFft ?? [];
  const n = Math.min(current.length, base.length);
  if (n < 8) return 0;

  // Find "fundamental" bin from baseline.
  let fundamental = 1;
  let best = -Infinity;
  for (let i = 1; i < n; i++) {
    if ((base[i] ?? 0) > best) {
      best = base[i] ?? 0;
      fundamental = i;
    }
  }

  const window = 2;
  const harmonics = [2, 3, 4, 5];
  let total = 0;
  for (const mult of harmonics) {
    const idx = Math.min(n - 1, Math.round(fundamental * mult));
    const a = Math.max(0, idx - window);
    const b = Math.min(n, idx + window + 1);
    const slice = current.slice(a, b);
    const sum = slice.reduce((acc, v) => acc + (v ?? 0), 0);
    total += sum;
  }

  // Normalize into 0..100-ish.
  return Math.min(100, (total / Math.max(1e-6, n)) * 600);
}

export function AnalyticsView({ baselineFft, recentFrames }) {
  const frames = recentFrames ?? [];
  const baseline = baselineFft ?? [];
  const series = frames
    .slice()
    .reverse()
    .map((f) => ({
      ts: f.timestamp,
      harmonic_total: computeHarmonicTotal({ fftMagnitude: f.fft_magnitude, baselineFft: baseline }),
    }));

  const last = series[series.length - 1];
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)]">ANALYTICS</div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="border-[0.5px] border-[var(--border)] bg-white rounded-[4px] p-3">
          <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)] mb-2">FFT ANALYSIS</div>
          <SpectrumChart baselineFft={baseline} currentFft={frames[0]?.fft_magnitude ?? []} />
        </div>

        <div className="border-[0.5px] border-[var(--border)] bg-white rounded-[4px] p-3">
          <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)] mb-2">HARMONIC HISTORY</div>

          <div className="mb-2 text-[12px] text-[var(--muted)]">
            Current harmonic total: <span className="mono text-[13px] text-[var(--text)]">{last ? last.harmonic_total.toFixed(1) : "—"}</span>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="2 2" strokeWidth={0.5} />
                <XAxis dataKey="ts" hide />
                <YAxis hide domain={[0, 110]} />
                <Line type="monotone" dataKey="harmonic_total" stroke={graphStroke} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

