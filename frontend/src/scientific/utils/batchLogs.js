function severityFromScore(score) {
  if (score >= 65) return { label: "HIGH", color: "var(--warn)" };
  if (score >= 35) return { label: "MEDIUM", color: "var(--safe)" };
  return { label: "LOW", color: "var(--text)" };
}

export function makeBatchLogRow(scan) {
  const sev = severityFromScore(scan.anomaly_score_percent ?? 0);
  return {
    timestamp: scan.timestamp,
    severity: sev.label,
    severity_color: sev.color,
    condition: scan.condition,
    anomaly_score_percent: `${Number(scan.anomaly_score_percent ?? 0).toFixed(1)}%`,
  };
}

export function severityFromScoreUi(score) {
  return severityFromScore(score);
}

