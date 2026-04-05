import { ListTree, Sigma } from "lucide-react";

const UNIT_TREE = [
  {
    id: "section-a",
    label: "Section A",
    nodes: [
      { id: "RF-2026-A", label: "Reactor RF-2026-A", sensor: "Sensor Node 01" },
      { id: "RF-2026-B", label: "Reactor RF-2026-B", sensor: "Sensor Node 02" },
    ],
  },
];

function batchStageFromClock() {
  // Mock fermentation stage: cycles every ~2 minutes.
  const phases = ["Lag Phase", "Exponential Growth", "Stationary Phase", "Transition"];
  const idx = Math.floor(Date.now() / (2 * 60 * 1000)) % phases.length;
  return phases[idx];
}

function phaseProgressFromClock() {
  const phaseDurationMs = 2 * 60 * 1000;
  const t = Date.now() % phaseDurationMs;
  const pct = Math.round((t / phaseDurationMs) * 100);
  return pct;
}

export function ContextSidebar({ activeReactorId, onReactorChange, connection }) {
  const stage = batchStageFromClock();
  const phasePct = phaseProgressFromClock();

  return (
    <aside className="w-[240px] border-r border-[var(--border)] p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[12px] font-semibold tracking-[0.18em]" style={{ color: "var(--muted)" }}>
          UNIT TREE
        </div>
        <ListTree size={16} strokeWidth={1.5} color="var(--muted)" />
      </div>

      <div className="space-y-2">
        {UNIT_TREE.map((section) => (
          <div key={section.id} className="space-y-2">
            <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
              {section.label}
            </div>
            <div className="space-y-1">
              {section.nodes.map((n) => {
                const active = n.id === activeReactorId;
                const dotColor =
                  active && connection === "connected" ? "var(--safe)" : "var(--warn)";
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => onReactorChange?.(n.id)}
                    className="w-full text-left px-2 py-2 border rounded-[4px] transition hover:bg-black/[0.02] active:bg-black/[0.04]"
                    style={{
                      borderColor: active ? "var(--primary)" : "var(--border)",
                      color: active ? "var(--primary)" : "var(--text)",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13px] font-semibold">{n.label}</div>
                      <div
                        className="w-[8px] h-[8px] rounded-full"
                        style={{ backgroundColor: dotColor }}
                        aria-label={active ? "Active reactor status" : "Reactor status"}
                      />
                    </div>
                    <div className="mono text-[11px] mt-1" style={{ color: "var(--muted)" }}>
                      {n.sensor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t instrument-divider pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            Batch Info
          </div>
          <Sigma size={16} strokeWidth={1.5} color="var(--muted)" />
        </div>
        <div className="mono text-[13px]" style={{ color: "var(--text)" }}>{stage}: {phasePct}%</div>
        <div className="h-[8px] border border-[var(--border)] rounded-[4px] overflow-hidden">
          <div
            className="h-full"
            style={{
              width: `${phasePct}%`,
              backgroundColor: "var(--primary)",
              transition: "width 200ms linear",
            }}
          />
        </div>
        <div className="text-[12px]" style={{ color: "var(--muted)" }}>
          Fufeng Group • Bio-fermentation reactor monitoring
        </div>
      </div>
    </aside>
  );
}

