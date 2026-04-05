import { ThinTable } from "../components/ThinTable";

export function BatchLogsView({ history }) {
  const rows = (history ?? []).slice(0, 10);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)]">BATCH LOGS</div>

      <ThinTable
        columns={[
          { key: "timestamp", header: "Timestamp" },
          {
            key: "severity",
            header: "Severity",
            render: (r) => (
              <span className="mono" style={{ color: r.severity_color }}>
                {r.severity}
              </span>
            ),
          },
          { key: "condition", header: "Condition" },
          { key: "anomaly_score_percent", header: "Anomaly Score" },
        ]}
        rows={rows}
      />
    </div>
  );
}

