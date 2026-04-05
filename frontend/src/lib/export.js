import jsPDF from "jspdf";

function toCsv(history) {
  const header = ["timestamp", "severity", "status", "anomaly_probability", "confidence"];
  const rows = history.map((s) => [
    s.timestamp,
    s.severity,
    s.status,
    s.anomaly_probability,
    s.confidence,
  ]);
  return [header, ...rows].map((r) => r.join(",")).join("\n");
}

export function downloadCsv({ filename, history }) {
  const csv = toCsv(history);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadPdf({ filename, latestScan, history }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  doc.text("Stetho Diagnostics Report", 40, 40);
  doc.setFontSize(10);

  const latestLine = latestScan
    ? `Latest: ${latestScan.timestamp} | ${latestScan.status} | Severity=${latestScan.severity} | Anom=${Math.round(
        latestScan.anomaly_probability * 100,
      )}% | Conf=${latestScan.confidence}%`
    : "Latest: N/A";
  doc.text(latestLine, 40, 60);

  let y = 90;
  doc.setFontSize(9);
  doc.text("History (last 10):", 40, y);
  y += 14;

  history.slice(0, 10).forEach((s, idx) => {
    const line = `${idx + 1}. ${s.timestamp} | ${s.severity} | ${s.status} | Anom=${Math.round(
      s.anomaly_probability * 100,
    )}% | Conf=${s.confidence}%`;
    doc.text(line, 40, y);
    y += 12;
  });

  doc.save(filename);
}

