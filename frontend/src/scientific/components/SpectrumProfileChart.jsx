import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const fixedFreqTicks = [0, 50, 100, 150, 200];

function formatHz(v) {
  return `${Math.round(v)}`;
}

function MinimalTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  const live = payload.find((p) => p.dataKey === "live")?.value;
  return (
    <div className="border border-[var(--border)] rounded-[4px] px-2 py-1 bg-white">
      <div className="mono text-[12px]" style={{ color: "var(--text)" }}>
        {formatHz(label)} Hz
      </div>
      <div className="mono text-[12px]" style={{ color: "var(--muted)" }}>
        Mag: {typeof live === "number" ? live.toFixed(3) : "—"}
      </div>
    </div>
  );
}

export function SpectrumProfileChart({
  baselineFft,
  fftMagnitude,
  historicalPeakFft,
  showHistoricalPeak = false,
  sampleRateHz,
  fftBins,
}) {
  const base = baselineFft ?? [];
  const current = fftMagnitude ?? [];
  const hist = historicalPeakFft ?? [];
  const n = Math.min(base.length, current.length, fftBins ?? base.length, showHistoricalPeak ? (hist.length || Infinity) : Infinity);
  const sr = sampleRateHz ?? 400;
  const bins = Math.max(1, n - 1);

  const data = Array.from({ length: n }, (_, i) => ({
    f: (i / bins) * (sr / 2),
    baseline: base[i] ?? 0,
    live: current[i] ?? 0,
    historical: showHistoricalPeak ? (hist[i] ?? 0) : undefined,
  }));

  return (
    <div className="instrument-card p-2">
      <div className="text-[12px] font-semibold tracking-[0.18em] mb-2" style={{ color: "var(--muted)" }}>
        SPECTRAL PROFILE (FFT vs BASELINE)
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} syncId="stetho-sync" margin={{ top: 6, right: 10, bottom: 6, left: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth={0.5} />
            <XAxis
              dataKey="f"
              ticks={fixedFreqTicks}
              tickFormatter={(v) => formatHz(v)}
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              tickFormatter={(v) => Number(v).toFixed(1)}
              tickLine={false}
              axisLine={false}
              domain={[0, 1.05]}
            />
            <Tooltip
              cursor={{ stroke: "rgba(142,142,147,0.55)", strokeWidth: 1 }}
              content={<MinimalTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
            <Line type="monotone" dataKey="baseline" stroke="#E2E8F0" strokeWidth={1.0} dot={false} isAnimationActive={false} />
            {showHistoricalPeak ? (
              <Line
                type="monotone"
                dataKey="historical"
                stroke="rgba(142,142,147,0.85)"
                strokeWidth={1.0}
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
              />
            ) : null}
            <Line type="monotone" dataKey="live" stroke="var(--primary)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

