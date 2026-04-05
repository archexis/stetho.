import { Table, Th, Td } from "../ui/Table";

export function HistoryPanel({ history }) {
  return (
    <div className="border border-[#1F1F1F] bg-[#0A0A0A]">
      <div className="px-4 py-3 border-b border-[#1F1F1F]">
        <div className="text-[12px] font-semibold text-[#737373]">PAST SCANS (LAST 10)</div>
      </div>
      <div className="p-0">
        <Table>
          <thead>
            <tr>
              <Th>Timestamp</Th>
              <Th>Severity</Th>
              <Th>Status</Th>
              <Th>Anom Prob</Th>
              <Th>Confidence</Th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <Td>No scans yet.</Td>
                <Td />
                <Td />
                <Td />
                <Td />
              </tr>
            ) : (
              history.map((scan, idx) => (
                <tr key={`${scan.timestamp}-${idx}`}>
                  <Td>
                    <span className="mono">{scan.timestamp}</span>
                  </Td>
                  <Td>
                    <span
                      className="mono"
                      style={{
                        color:
                          scan.severity === "HIGH"
                            ? "#FF3131"
                            : scan.severity === "MEDIUM"
                              ? "#00FFD1"
                              : "#FFFFFF",
                      }}
                    >
                      {scan.severity}
                    </span>
                  </Td>
                  <Td className="mono">{scan.status}</Td>
                  <Td className="mono">{Math.round(scan.anomaly_probability * 100)}%</Td>
                  <Td className="mono">{scan.confidence}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

