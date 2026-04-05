export function HarmonicTable({ peaks }) {
  const safe = peaks ?? [];

  return (
    <div className="instrument-card p-2">
      <div className="text-[12px] font-semibold tracking-[0.18em] mb-2" style={{ color: "var(--muted)" }}>
        HARMONIC PEAKS
      </div>
      <div className="overflow-auto">
        <table className="min-w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="text-left py-2 pr-2" style={{ color: "var(--muted)", fontWeight: 600 }}>
                Frequency (Hz)
              </th>
              <th className="text-left py-2 pr-2" style={{ color: "var(--muted)", fontWeight: 600 }}>
                Magnitude
              </th>
              <th className="text-left py-2" style={{ color: "var(--muted)", fontWeight: 600 }}>
                Stability
              </th>
            </tr>
          </thead>
          <tbody>
            {safe.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4" style={{ color: "var(--muted)" }}>
                  No peaks detected yet.
                </td>
              </tr>
            ) : (
              safe.map((p) => (
                <tr key={p.bin}>
                  <td className="mono py-2 pr-2" style={{ color: "var(--text)" }}>
                    {p.frequencyHz.toFixed(1)}
                  </td>
                  <td className="mono py-2 pr-2" style={{ color: "var(--text)" }}>
                    {p.magnitude.toFixed(3)}
                  </td>
                  <td className="mono py-2" style={{ color: p.stabilityPercent >= 70 ? "var(--safe)" : p.stabilityPercent >= 40 ? "var(--warn)" : "var(--critical)" }}>
                    {p.stabilityPercent.toFixed(0)}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

