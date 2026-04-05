import { Button } from "../ui/Button";

export function MonitorPanel({ status, progress, onStartAnalysis, probabilityCutoff }) {
  return (
    <div className="border border-[#1F1F1F] bg-[#0A0A0A]">
      <div className="px-4 py-3 border-b border-[#1F1F1F]">
        <div className="text-[12px] font-semibold text-[#737373]">SYSTEM CONTROL</div>
      </div>

      <div className="p-4 space-y-4">
        <Button
          variant="primary"
          className="w-full"
          disabled={status === "Recording" || status === "Analyzing"}
          onClick={onStartAnalysis}
        >
          Start 3s Capture
        </Button>

        <div className="border border-[#1F1F1F] p-3">
          <div className="text-[12px] font-semibold text-[#737373] mb-2">Capture</div>
          <div className="mono text-[13px] text-[#FFFFFF] mb-2">
            Status: {status}
          </div>
          <div className="h-[10px] border border-[#1F1F1F] bg-[#0A0A0A]">
            <div
              className="h-full bg-[#00FFD1]"
              style={{ width: `${Math.round(progress * 100)}%`, transition: "width 100ms linear" }}
            />
          </div>
          <div className="mt-2 text-[12px] text-[#737373]">
            Probability cut-off: <span className="mono text-[#FFFFFF]">{probabilityCutoff.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-[12px] text-[#737373] leading-relaxed">
          Capture simulates vibro-acoustic sensor acquisition for 3 seconds, then runs inference via <span className="mono">/v1/analyze</span>.
        </div>
      </div>
    </div>
  );
}

