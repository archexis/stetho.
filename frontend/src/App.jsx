import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./shadcn/Tabs";
import { useBioStream } from "./lib/useBioStream";

import { LeftNavRail } from "./scientific/components/LeftNavRail";
import { ContextSidebar } from "./scientific/components/ContextSidebar";
import { ActionPanel } from "./scientific/components/ActionPanel";

import { WaveformFingerprintChart } from "./scientific/components/WaveformFingerprintChart";
import { SpectrumProfileChart } from "./scientific/components/SpectrumProfileChart";
import { HarmonicTable } from "./scientific/components/HarmonicTable";
import { BioMetricsWidget } from "./scientific/components/BioMetricsWidget";
import { CycleHistoryTable } from "./scientific/components/CycleHistoryTable";
import { HardwareHealthPanel } from "./scientific/components/HardwareHealthPanel";

import { computeHarmonicPeaks } from "./scientific/utils/fftPeaks";
import { downloadBlob, float32ToWavBlob } from "./scientific/utils/wav";

function downloadJson({ filename, data }) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, filename);
}

function exportCsv({ filename, rows }) {
  const header = ["timestamp", "reactor_id", "rpm", "vvm", "d_o2", "anomaly_score_percent", "condition"];
  const csvRows = rows.map((r) =>
    [
      r.timestamp,
      r.reactor_id,
      r.rpm,
      r.vvm,
      r.d_o2,
      r.anomaly_score_percent,
      r.condition,
    ].join(","),
  );
  const csv = [header.join(","), ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}

export default function App() {
  const [activeModule, setActiveModule] = useState("Monitor");
  const [activeReactorId, setActiveReactorId] = useState("RF-2026-A");
  const [thresholdPercent, setThresholdPercent] = useState(65);
  const [activeTab, setActiveTab] = useState("waveform");
  const [overlayHistoricalPeak, setOverlayHistoricalPeak] = useState(false);

  const {
    connection,
    baselineFft,
    baselineWaveform,
    sampleRateHz,
    latestFrame,
    recentFrames,
    sendCommand,
  } = useBioStream({ reactorId: activeReactorId, thresholdPercent });

  const fftHistory = useMemo(() => recentFrames ?? [], [recentFrames]);

  const historicalPeakFft = useMemo(() => {
    // Highest magnitude ever seen (within current session buffer) per frequency bin.
    const frames = recentFrames ?? [];
    if (frames.length === 0) return [];
    const first = frames[0]?.fft_magnitude ?? [];
    const maxBins = new Array(first.length).fill(0);
    for (const f of frames) {
      const mag = f?.fft_magnitude ?? [];
      for (let i = 0; i < mag.length; i++) {
        const v = mag[i] ?? 0;
        if (v > maxBins[i]) maxBins[i] = v;
      }
    }
    return maxBins;
  }, [recentFrames]);

  const harmonicPeaks = useMemo(() => {
    if (!latestFrame) return [];
    return computeHarmonicPeaks({
      fftMagnitude: latestFrame.fft_magnitude ?? [],
      fftHistory,
      sampleRateHz: latestFrame.sample_rate_hz ?? sampleRateHz,
      fftBins: latestFrame.fft_bins ?? (latestFrame.fft_magnitude?.length ?? 0),
      topK: 6,
    });
  }, [latestFrame, fftHistory, sampleRateHz]);

  const pageHeader = useMemo(() => {
    const ok = connection === "connected";
    return (
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold tracking-[0.18em]" style={{ color: "var(--muted)" }}>
            {activeModule.toUpperCase()}
          </div>
          <div className="mt-1 text-[13px]" style={{ color: "var(--text)" }}>
            {activeModule === "Monitor"
              ? "Live waveform + FFT with healthy baseline reference."
              : activeModule === "Cycle History"
                ? "Recent cycles with anomaly severity classification."
                : activeModule === "Calibration"
                  ? "Healthy baseline capture and verification."
                  : "Hardware telemetry and signal link status."}
          </div>
        </div>
        <div className={`mono text-[12px] ${ok ? "pulse-ok" : ""}`} style={{ color: ok ? "var(--safe)" : "var(--warn)" }}>
          {ok ? "STREAM OK" : "STREAM LOST"}
        </div>
      </div>
    );
  }, [activeModule, connection]);

  const waveformSnapshot = async () => {
    if (!latestFrame || !baselineWaveform) return;
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const filenameBase = `stetho_${latestFrame.reactor_id}_${ts}`;

    // WAV snapshot (waveform only).
    const wavBlob = float32ToWavBlob({
      samples: latestFrame.waveform ?? [],
      sampleRateHz: latestFrame.sample_rate_hz ?? sampleRateHz,
    });
    downloadBlob(wavBlob, `${filenameBase}.wav`);

    // JSON snapshot (waveform + reference baseline).
    downloadJson({
      filename: `${filenameBase}.json`,
      data: {
        timestamp: latestFrame.timestamp,
        reactor_id: latestFrame.reactor_id,
        sample_rate_hz: latestFrame.sample_rate_hz,
        waveform_points: latestFrame.waveform_points,
        fft_bins: latestFrame.fft_bins,
        waveform: latestFrame.waveform,
        baseline_waveform: baselineWaveform,
        fft_magnitude: latestFrame.fft_magnitude,
        baseline_fft_magnitude: baselineFft,
        rpm: latestFrame.rpm,
        vvm: latestFrame.vvm,
        d_o2: latestFrame.d_o2,
        anomaly_score_percent: latestFrame.anomaly_score_percent,
        condition: latestFrame.condition,
      },
    });
  };

  const exportLog = () => {
    const rows = recentFrames ?? [];
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const base = `stetho_export_${activeReactorId}_${ts}`;
    exportCsv({ filename: `${base}.csv`, rows });
    downloadJson({ filename: `${base}.json`, data: rows });
  };

  const onEmergencyStop = () => {
    sendCommand({ type: "set_emergency_stop" });
  };

  const onCalibration = () => {
    sendCommand({ type: "set_baseline" });
  };

  const cycleFramesForTable = useMemo(() => {
    return (recentFrames ?? []).slice(0, 10);
  }, [recentFrames]);

  let moduleContent = null;
  if (activeModule === "Monitor") {
    moduleContent = (
      <div className="space-y-3">
        <div className="instrument-card p-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="waveform">
            <div className="flex items-center justify-between gap-2 mb-2">
              <TabsList>
                <TabsTrigger value="waveform">Waveform View</TabsTrigger>
                <TabsTrigger value="spectrogram">Spectrogram View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="waveform">
              <div className="grid gap-3 lg:grid-cols-[1fr_360px]">
                <WaveformFingerprintChart
                  waveform={latestFrame?.waveform ?? []}
                  baselineWaveform={baselineWaveform ?? []}
                  onSnapshot={waveformSnapshot}
                />

                <div className="space-y-3">
                  <BioMetricsWidget frame={latestFrame} />
                  <HarmonicTable peaks={harmonicPeaks} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="spectrogram">
              <div className="grid gap-3 lg:grid-cols-[1fr_360px]">
                <SpectrumProfileChart
                  baselineFft={baselineFft ?? []}
                  fftMagnitude={latestFrame?.fft_magnitude ?? []}
                  historicalPeakFft={historicalPeakFft}
                  showHistoricalPeak={overlayHistoricalPeak}
                  sampleRateHz={latestFrame?.sample_rate_hz ?? sampleRateHz}
                  fftBins={latestFrame?.fft_bins ?? 128}
                />
                <div className="space-y-3">
                  <BioMetricsWidget frame={latestFrame} />
                  <HarmonicTable peaks={harmonicPeaks} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } else if (activeModule === "Cycle History") {
    moduleContent = (
      <div className="space-y-3">
        <CycleHistoryTable frames={cycleFramesForTable} thresholdPercent={thresholdPercent} />
      </div>
    );
  } else if (activeModule === "Calibration") {
    moduleContent = (
      <div className="space-y-3">
        <div className="border-[0.5px] border-[var(--border)] p-3">
          <div className="text-[12px] font-semibold tracking-[0.18em]" style={{ color: "var(--muted)" }}>
            CALIBRATION
          </div>
          <div className="mt-2 text-[13px]" style={{ color: "var(--text)" }}>
            Use the Action Panel to re-capture the Healthy Baseline. The chart reference updates instantly.
          </div>
        </div>
        <HarmonicTable peaks={harmonicPeaks} />
      </div>
    );
  } else {
    moduleContent = (
      <div className="space-y-3">
        <HardwareHealthPanel reactorId={activeReactorId} frame={latestFrame} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="grid grid-cols-[64px_240px_1fr_280px] min-h-screen max-w-[1400px] mx-auto">
        <LeftNavRail active={activeModule} onSelect={setActiveModule} />
        <ContextSidebar activeReactorId={activeReactorId} onReactorChange={setActiveReactorId} connection={connection} />

        <main className="p-3 border-r border-[var(--border)]">
          {pageHeader}
          <div className="mt-3">{moduleContent}</div>
        </main>

        <ActionPanel
          connection={connection}
          thresholdPercent={thresholdPercent}
          onThresholdChange={setThresholdPercent}
          overlayHistoricalPeak={overlayHistoricalPeak}
          onToggleOverlayHistoricalPeak={setOverlayHistoricalPeak}
          onCalibration={onCalibration}
          onEmergencyStop={onEmergencyStop}
          onExportLog={exportLog}
        />
      </div>
    </div>
  );
}

