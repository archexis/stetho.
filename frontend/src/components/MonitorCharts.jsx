import { useMemo } from "react";
import { Bar, Line } from "recharts";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, LineChart, BarChart } from "recharts";

const AXIS = "#1F1F1F";
const ACCENT = "#00FFD1";

export function MonitorCharts({ waveformData, fftMagnitude }) {
  const waveformSeries = useMemo(() => waveformData ?? [], [waveformData]);
  const fftSeries = useMemo(() => {
    const mag = fftMagnitude ?? [];
    return mag.map((v, i) => ({ k: i, v }));
  }, [fftMagnitude]);

  return (
    <div className="grid gap-0 lg:grid-cols-2">
      <div className="border-b border-r border-[#1F1F1F] lg:border-b-0 lg:border-r-[#1F1F1F] p-0">
        <div className="px-4 py-3 text-[12px] font-semibold text-[#737373] border-b border-[#1F1F1F]">
          WAVEFORM
        </div>
        <div className="h-[340px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waveformSeries} margin={{ top: 10, right: 16, bottom: 10, left: -10 }}>
              <CartesianGrid stroke={AXIS} opacity={0.25} strokeDasharray="3 4" />
              <XAxis dataKey="t" hide />
              <YAxis hide domain={[-1.5, 1.5]} />
              <Line
                type="monotone"
                dataKey="y"
                stroke={ACCENT}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-0">
        <div className="px-4 py-3 text-[12px] font-semibold text-[#737373] border-b border-[#1F1F1F]">
          FFT MAGNITUDE
        </div>
        <div className="h-[340px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fftSeries} margin={{ top: 10, right: 16, bottom: 10, left: -10 }}>
              <CartesianGrid stroke={AXIS} opacity={0.25} strokeDasharray="3 4" />
              <XAxis dataKey="k" hide />
              <YAxis hide domain={[0, 1.05]} />
              <Bar dataKey="v" fill={ACCENT} opacity={0.85} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

