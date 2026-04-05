import { AlertTriangle } from "lucide-react";

export function BiologicalContextPanel({ frame }) {
  const condition = frame?.condition ?? "Condition: —";

  const isCavitation = String(condition).includes("Cavitation");
  const accent = isCavitation ? "var(--warn)" : "var(--safe)";

  return (
    <div className="border-[0.5px] border-[var(--border)] rounded-[4px] bg-white p-3">
      <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)] mb-2">BIOLOGICAL CONTEXT</div>

      <div className="grid grid-cols-2 gap-2">
        <div className="border-[0.5px] border-[var(--border)] rounded-[4px] p-2">
          <div className="text-[12px] font-semibold text-[var(--muted)]">Agitation (RPM)</div>
          <div className="mono text-[18px] mt-1" style={{ color: "var(--text)" }}>
            {frame ? frame.rpm.toFixed(1) : "—"}
          </div>
        </div>

        <div className="border-[0.5px] border-[var(--border)] rounded-[4px] p-2">
          <div className="text-[12px] font-semibold text-[var(--muted)]">Dissolved Oxygen (dO2)</div>
          <div className="mono text-[18px] mt-1" style={{ color: "var(--text)" }}>
            {frame ? frame.d_o2.toFixed(2) : "—"}
          </div>
        </div>

        <div className="border-[0.5px] border-[var(--border)] rounded-[4px] p-2 col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[12px] font-semibold text-[var(--muted)]">Acoustic Anomaly Score</div>
            <div className="mono text-[18px]" style={{ color: "var(--text)" }}>
              {frame ? `${frame.anomaly_score_percent.toFixed(1)}%` : "—"}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="text-[12px] text-[var(--muted)]">Status Indicator</div>
            <div className="flex items-center gap-2 mono text-[13px]" style={{ color: accent }}>
              {isCavitation ? <AlertTriangle size={16} strokeWidth={1.5} /> : null}
              {condition}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 text-[12px] text-[var(--muted)]">
        Threshold is computed from the live spectral energy and click proxy.
      </div>
    </div>
  );
}

