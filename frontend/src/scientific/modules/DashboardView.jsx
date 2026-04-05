import { useMemo, useState } from "react";
import { SpectrumChart } from "../components/SpectrumChart";
import { WaveformChart } from "../components/WaveformChart";
import { BiologicalContextPanel } from "../components/BiologicalContextPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/Tabs";

export function DashboardView({ reactors, activeReactor, onReactorChange, latestFrame, baselineFft }) {
  const baseline = useMemo(() => baselineFft ?? [], [baselineFft]);
  const currentFft = latestFrame?.fft_magnitude ?? [];
  const waveform = latestFrame?.waveform ?? [];
  const [tab, setTab] = useState("waveform");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)]">DASHBOARD</div>
          <div className="mt-1 text-[13px] text-[var(--text)]">Real-time acoustic feed + spectral baseline comparison</div>
        </div>

        <label className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--muted)]">Reactor</span>
          <select
            className="border-[0.5px] border-[var(--border)] rounded-[4px] px-2 py-1 text-[13px] bg-white text-[var(--text)]"
            value={activeReactor}
            onChange={(e) => onReactorChange(e.target.value)}
          >
            {reactors.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="border-[0.5px] border-[var(--border)] bg-white rounded-[4px] p-3 lg:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)]">LIVE INSTRUMENT FEED</div>
            <Tabs value={tab} onValueChange={setTab} defaultValue="waveform">
              <TabsList>
                <TabsTrigger value="waveform">Waveform</TabsTrigger>
                <TabsTrigger value="spectrum">Spectrum</TabsTrigger>
              </TabsList>
              <TabsContent value="waveform" className="mt-3">
                <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)] mb-2">ACOUSTIC FEED</div>
                <WaveformChart waveform={waveform} />
              </TabsContent>
              <TabsContent value="spectrum" className="mt-3">
                <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)] mb-2">SPECTRAL PROFILE</div>
                <SpectrumChart baselineFft={baseline} currentFft={currentFft} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <BiologicalContextPanel frame={latestFrame} />
    </div>
  );
}

