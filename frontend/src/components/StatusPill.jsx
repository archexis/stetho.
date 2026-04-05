export function StatusPill({ status, probability, severity }) {
  const { bg, fg, border } = (() => {
    if (status === "Result" && severity === "HIGH") {
      return { bg: "rgba(255,49,49,0.12)", fg: "#FF3131", border: "rgba(255,49,49,0.35)" };
    }
    if (status === "Result" && severity === "MEDIUM") {
      return { bg: "rgba(0,255,209,0.10)", fg: "#00FFD1", border: "rgba(0,255,209,0.35)" };
    }
    if (status === "Recording") {
      return { bg: "rgba(0,255,209,0.10)", fg: "#00FFD1", border: "rgba(0,255,209,0.35)" };
    }
    return { bg: "transparent", fg: "#FFFFFF", border: "rgba(31,31,31,1)" };
  })();

  return (
    <div
      className="inline-flex items-center justify-center border px-3 py-1 text-[12px] font-semibold mono"
      style={{ background: bg, color: fg, borderColor: border }}
    >
      {status}
      {typeof probability === "number" ? ` ${Math.round(probability * 100)}%` : ""}
    </div>
  );
}

