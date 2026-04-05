import { AlertTriangle, CheckCircle2 } from "lucide-react";

function parseCondition(condition) {
  const text = String(condition ?? "");
  if (text.includes("Cavitation Detected")) {
    return { isCritical: true, label: text };
  }
  return { isCritical: false, label: text || "Condition: —" };
}

export function BioMetricsWidget({ frame }) {
  const rpm = frame?.rpm;
  const vvm = frame?.vvm;
  const dO2 = frame?.d_o2;
  const condition = frame?.condition ?? "Condition: —";

  const parsed = parseCondition(condition);
  const icon = parsed.isCritical ? <AlertTriangle size={18} strokeWidth={1.5} style={{ color: "var(--critical)" }} /> : <CheckCircle2 size={18} strokeWidth={1.5} style={{ color: "var(--safe)" }} />;

  return (
    <div className="instrument-card p-2">
      <div className="text-[12px] font-semibold tracking-[0.18em] mb-2" style={{ color: "var(--muted)" }}>
        BIO-METRICS
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="border-[0.5px] border-[var(--border)] p-2">
          <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            Impeller RPM
          </div>
          <div className="mono text-[18px] mt-1" style={{ color: "var(--text)" }}>
            {typeof rpm === "number" ? rpm.toFixed(0) : "—"}
          </div>
        </div>
        <div className="border-[0.5px] border-[var(--border)] p-2">
          <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            Aeration (vvm)
          </div>
          <div className="mono text-[18px] mt-1" style={{ color: "var(--text)" }}>
            {typeof vvm === "number" ? vvm.toFixed(2) : "—"}
          </div>
        </div>
        <div className="border-[0.5px] border-[var(--border)] p-2">
          <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            Dissolved Oxygen
          </div>
          <div className="mono text-[18px] mt-1" style={{ color: "var(--text)" }}>
            {typeof dO2 === "number" ? dO2.toFixed(2) : "—"}
          </div>
        </div>
      </div>

      <div className="mt-2 border-t-[0.5px] border-[var(--border)] pt-2 flex items-start gap-2">
        {icon}
        <div className="text-[13px] mono" style={{ color: parsed.isCritical ? "var(--critical)" : "var(--safe)", lineHeight: 1.4 }}>
          {condition}
        </div>
      </div>
    </div>
  );
}

