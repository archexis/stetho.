export function ResultSummary({ latestScan }) {
  const has = !!latestScan;
  if (!has) {
    return (
      <div className="border border-[#1F1F1F] bg-[#0A0A0A] p-4">
        <div className="text-[12px] font-semibold text-[#737373] mb-2">HEALTH STATUS</div>
        <div className="mono text-[13px] text-[#737373]">No result yet. Start a capture.</div>
      </div>
    );
  }

  const accent = latestScan.severity === "HIGH" ? "#FF3131" : latestScan.severity === "MEDIUM" ? "#00FFD1" : "#FFFFFF";

  return (
    <div className="border border-[#1F1F1F] bg-[#0A0A0A] p-4">
      <div className="text-[12px] font-semibold text-[#737373] mb-2">HEALTH STATUS</div>
      <div className="flex items-center justify-between gap-3">
        <div className="mono text-[18px]" style={{ color: accent }}>
          {latestScan.status}
        </div>
        <div className="text-right">
          <div className="text-[12px] font-semibold text-[#737373]">Confidence</div>
          <div className="mono text-[26px] text-[#00FFD1]">{latestScan.confidence}%</div>
        </div>
      </div>
      <div className="mt-3 text-[12px] text-[#737373] leading-relaxed">
        Anomaly probability:{" "}
        <span className="mono" style={{ color: accent }}>
          {Math.round(latestScan.anomaly_probability * 100)}%
        </span>{" "}
        • Severity: <span className="mono">{latestScan.severity}</span>
      </div>
    </div>
  );
}

