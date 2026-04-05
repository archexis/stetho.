import { Button } from "../ui/Button";
import { downloadCsv, downloadPdf } from "../lib/export";

export function ExportPanel({ latestScan, history }) {
  return (
    <div className="border border-[#1F1F1F] bg-[#0A0A0A]">
      <div className="px-4 py-3 border-b border-[#1F1F1F]">
        <div className="text-[12px] font-semibold text-[#737373]">EXPORT</div>
      </div>
      <div className="p-4 space-y-3">
        <Button
          variant="primary"
          className="w-full"
          disabled={history.length === 0}
          onClick={() =>
            downloadCsv({
              filename: `stetho_history_${new Date().toISOString().slice(0, 10)}.csv`,
              history,
            })
          }
        >
          Download CSV (History)
        </Button>
        <Button
          variant="default"
          className="w-full"
          disabled={history.length === 0}
          onClick={() =>
            downloadPdf({
              filename: `stetho_report_${new Date().toISOString().slice(0, 10)}.pdf`,
              latestScan,
              history,
            })
          }
        >
          Download PDF (Report)
        </Button>

        <div className="text-[12px] text-[#737373] leading-relaxed">
          Exports are generated locally in your browser for this MVP.
        </div>
      </div>
    </div>
  );
}

