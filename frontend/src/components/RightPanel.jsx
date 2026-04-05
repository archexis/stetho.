import { HistoryPanel } from "./HistoryPanel";
import { SensorsPanel } from "./SensorsPanel";
import { ThresholdsPanel } from "./ThresholdsPanel";
import { ExportPanel } from "./ExportPanel";
import { MonitorPanel } from "./MonitorPanel";

export function RightPanel(props) {
  switch (props.activePanel) {
    case "History":
      return <HistoryPanel history={props.history} />;
    case "Sensors":
      return <SensorsPanel sensors={props.sensors} />;
    case "Thresholds":
      return <ThresholdsPanel probabilityCutoff={props.probabilityCutoff} onChange={props.onProbabilityChange} />;
    case "Export":
      return <ExportPanel latestScan={props.latestScan} history={props.history} />;
    case "Monitor":
    default:
      return (
        <MonitorPanel
          status={props.status}
          progress={props.progress}
          onStartAnalysis={props.onStartAnalysis}
          probabilityCutoff={props.probabilityCutoff}
        />
      );
  }
}

