import { useMemo } from "react";

export function SettingsView({ thresholdPercent, onChangeThreshold }) {
  const labelColor = useMemo(() => {
    if (thresholdPercent >= 70) return "var(--warn)";
    return "var(--safe)";
  }, [thresholdPercent]);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)]">SETTINGS</div>

      <div className="border-[0.5px] border-[var(--border)] bg-white rounded-[4px] p-3">
        <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)] mb-3">
          HARDWARE CALIBRATION
        </div>

        <div className="border-[0.5px] border-[var(--border)] rounded-[4px] p-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-[12px] font-semibold text-[var(--muted)]">Cavitation Threshold</div>
            <div className="mono text-[13px]" style={{ color: labelColor }}>
              {thresholdPercent.toFixed(0)}%
            </div>
          </div>
          <input
            type="range"
            min={30}
            max={90}
            step={1}
            value={thresholdPercent}
            onChange={(e) => onChangeThreshold(Number(e.target.value))}
            className="w-full accent-[var(--safe)]"
          />
          <div className="mt-2 text-[12px] text-[var(--muted)]">
            Lower threshold flags cavitation earlier. Higher threshold reduces false positives.
          </div>
        </div>
      </div>
    </div>
  );
}

