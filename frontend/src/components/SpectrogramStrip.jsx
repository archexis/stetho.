export function SpectrogramStrip({ values, label = "SPECTROGRAM" }) {
  const safe = values ?? [];
  return (
    <div className="border-t border-[#1F1F1F]">
      <div className="px-4 py-3 text-[12px] font-semibold text-[#737373] border-b border-[#1F1F1F]">
        {label}
      </div>
      <div className="p-2">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 100 }).map((_, idx) => {
            const v = safe[idx] ?? 0;
            const color =
              v > 0.8 ? "#FF3131" : v > 0.55 ? "#00FFD1" : "rgba(255,255,255,0.10)";
            return (
              <div
                key={idx}
                className="h-4 border border-[#1F1F1F]"
                style={{
                  backgroundColor: color,
                  opacity: 0.25 + v * 0.75,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

