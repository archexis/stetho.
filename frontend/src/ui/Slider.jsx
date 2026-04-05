export function Slider({
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onValueChange,
  label,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold text-[#737373]">{label}</div>
        <div className="mono text-[12px] text-[#FFFFFF]">{value.toFixed(2)}</div>
      </div>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="w-full accent-[#00FFD1]"
      />
    </div>
  );
}

