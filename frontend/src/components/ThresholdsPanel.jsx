import { Slider } from "../ui/Slider";

export function ThresholdsPanel({ probabilityCutoff, onChange }) {
  return (
    <div className="border border-[#1F1F1F] bg-[#0A0A0A]">
      <div className="px-4 py-3 border-b border-[#1F1F1F]">
        <div className="text-[12px] font-semibold text-[#737373]">AI SENSITIVITY</div>
      </div>
      <div className="p-4 space-y-4">
        <Slider
          label="Probability cut-off"
          value={probabilityCutoff}
          min={0.05}
          max={0.95}
          step={0.01}
          onValueChange={onChange}
        />
        <div className="text-[12px] text-[#737373] leading-relaxed">
          Higher cut-off reduces false positives. Lower cut-off increases early anomaly detection.
        </div>
      </div>
    </div>
  );
}

