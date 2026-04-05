import { Download, ShieldAlert, SlidersHorizontal, Zap } from "lucide-react";

function Divider() {
  return <div className="border-t my-3 instrument-divider" />;
}

export function ActionPanel({
  connection,
  thresholdPercent,
  onThresholdChange,
  overlayHistoricalPeak,
  onToggleOverlayHistoricalPeak,
  onCalibration,
  onEmergencyStop,
  onExportLog,
}) {
  return (
    <aside className="w-[280px] border-l border-[var(--border)] p-3">
      <div className="text-[12px] font-semibold tracking-[0.18em]" style={{ color: "var(--muted)" }}>
        ACTION PANEL
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            AI Sensitivity (p-value)
          </div>
          <div className="mono text-[13px]" style={{ color: "var(--text)" }}>
            {thresholdPercent.toFixed(0)}
          </div>
        </div>

        <input
          aria-label="AI sensitivity"
          type="range"
          min={10}
          max={90}
          step={1}
          value={thresholdPercent}
          onChange={(e) => onThresholdChange?.(Number(e.target.value))}
          className="w-full"
        />

        <div className="text-[12px]" style={{ color: "var(--muted)" }}>
          Higher threshold reduces false positives.
        </div>
      </div>

      <Divider />

      <div className="space-y-2">
        <label className="flex items-center justify-between gap-3 text-[12px]">
          <span className="font-semibold" style={{ color: "var(--muted)" }}>
            Overlay Historical Peak
          </span>
          <input
            type="checkbox"
            checked={!!overlayHistoricalPeak}
            onChange={(e) => onToggleOverlayHistoricalPeak?.(e.target.checked)}
          />
        </label>
        <div className="text-[12px]" style={{ color: "var(--muted)" }}>
          Shows the highest recorded noise as a dotted reference line.
        </div>
      </div>

      <Divider />

      <div className="space-y-2">
        <button
          type="button"
          onClick={onCalibration}
          className="w-full flex items-center justify-between gap-2 px-2 py-2 border border-[var(--border)] rounded-[4px] transition hover:bg-[rgba(3,105,161,0.05)] active:bg-[rgba(3,105,161,0.10)]"
          style={{ backgroundColor: "transparent" }}
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--primary)" }}>
            <SlidersHorizontal size={18} strokeWidth={1.5} />
            Calibration: Healthy Baseline
          </span>
          <span className="mono text-[11px]" style={{ color: "var(--muted)" }}>
            recapture
          </span>
        </button>

        <button
          type="button"
          onClick={onEmergencyStop}
          className="w-full flex items-center justify-between gap-2 px-2 py-2 border border-[var(--border)] rounded-[4px] transition hover:bg-[rgba(245,158,11,0.08)] active:bg-[rgba(245,158,11,0.14)]"
          style={{ backgroundColor: "transparent" }}
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--warn)" }}>
            <ShieldAlert size={18} strokeWidth={1.5} />
            Emergency Stop Simulation
          </span>
          <span className="mono text-[11px]" style={{ color: "var(--muted)" }}>
            anomaly
          </span>
        </button>

        <button
          type="button"
          onClick={onExportLog}
          className="w-full flex items-center justify-between gap-2 px-2 py-2 border border-[var(--border)] rounded-[4px] transition hover:bg-[rgba(3,105,161,0.05)] active:bg-[rgba(3,105,161,0.10)]"
          style={{ backgroundColor: "transparent" }}
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--primary)" }}>
            <Download size={18} strokeWidth={1.5} />
            Export Log
          </span>
          <span className="mono text-[11px]" style={{ color: "var(--muted)" }}>
            csv/json
          </span>
        </button>
      </div>

      <div className="mt-4 border-t instrument-divider pt-3 text-[12px]" style={{ color: "var(--muted)" }}>
        Stream:{" "}
        <span
          className={`mono ${connection === "connected" ? "pulse-ok" : ""}`}
          style={{ color: connection === "connected" ? "var(--safe)" : "var(--warn)" }}
        >
          {connection}
        </span>
      </div>
    </aside>
  );
}

