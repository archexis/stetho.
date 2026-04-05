function mockHardware({ reactorId, frame }) {
  const seed = (String(reactorId) + (frame?.timestamp ?? "")).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const volt = 215 + (seed % 30);
  const temp = 46 + ((seed * 7) % 16);
  const conn = (seed % 12) === 0 ? "Lost" : (seed % 6) === 0 ? "Degraded" : "Connected";
  return { volt, temp, conn };
}

export function HardwareHealthPanel({ reactorId, frame }) {
  const hw = mockHardware({ reactorId, frame });
  const connColor = hw.conn === "Lost" ? "var(--critical)" : hw.conn === "Degraded" ? "var(--warn)" : "var(--safe)";

  return (
    <div className="instrument-card p-2">
      <div className="text-[12px] font-semibold tracking-[0.18em] mb-2" style={{ color: "var(--muted)" }}>
        HARDWARE HEALTH
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="border-[0.5px] border-[var(--border)] p-2">
          <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            Voltage
          </div>
          <div className="mono text-[18px] mt-1" style={{ color: "var(--text)" }}>
            {hw.volt.toFixed(1)} V
          </div>
        </div>
        <div className="border-[0.5px] border-[var(--border)] p-2">
          <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            Temperature
          </div>
          <div className="mono text-[18px] mt-1" style={{ color: "var(--text)" }}>
            {hw.temp.toFixed(1)} C
          </div>
        </div>
        <div className="border-[0.5px] border-[var(--border)] p-2 col-span-1">
          <div className="text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            Connection
          </div>
          <div className="mono text-[18px] mt-1" style={{ color: connColor }}>
            {hw.conn}
          </div>
        </div>
      </div>
    </div>
  );
}

