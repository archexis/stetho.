function severityFromScore(score, thresholdPercent) {
  if (score >= thresholdPercent + 10) return { label: "Critical", color: "var(--critical)" };
  if (score >= thresholdPercent) return { label: "Warning", color: "var(--warn)" };
  return { label: "Normal", color: "var(--safe)" };
}

export function CycleHistoryTable({ frames, thresholdPercent = 65 }) {
  const rows = (frames ?? []).slice(0, 10);
  return (
    <div className="instrument-card p-2">
      <div className="text-[12px] font-semibold tracking-[0.18em] mb-2" style={{ color: "var(--muted)" }}>
        CYCLE HISTORY (LAST 10)
      </div>
      <div className="overflow-auto">
        <table className="min-w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="text-left py-2 pr-2" style={{ color: "var(--muted)", fontWeight: 600 }}>
                Timestamp
              </th>
              <th className="text-left py-2 pr-2" style={{ color: "var(--muted)", fontWeight: 600 }}>
                Severity
              </th>
              <th className="text-left py-2 pr-2" style={{ color: "var(--muted)", fontWeight: 600 }}>
                Condition
              </th>
              <th className="text-left py-2 pr-2" style={{ color: "var(--muted)", fontWeight: 600 }}>
                Anomaly
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4" style={{ color: "var(--muted)" }}>
                  No history yet.
                </td>
              </tr>
            ) : (
              rows.map((f, idx) => {
                const score = Number(f?.anomaly_score_percent ?? 0);
                const sev = severityFromScore(score, thresholdPercent);
                return (
                  <tr key={`${f?.timestamp ?? "t"}-${idx}`} style={{ borderTop: "1px solid transparent" }}>
                    <td className="mono py-2 pr-2" style={{ color: "var(--text)" }}>
                      {f?.timestamp ?? "—"}
                    </td>
                    <td className="mono py-2 pr-2" style={{ color: sev.color }}>
                      {sev.label}
                    </td>
                    <td className="py-2 pr-2" style={{ color: "var(--text)" }}>
                      {f?.condition ?? "—"}
                    </td>
                    <td className="mono py-2 pr-2" style={{ color: "var(--text)" }}>
                      {score.toFixed(1)}%
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

