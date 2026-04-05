export function SensorsPanel({ sensors }) {
  const tone = (value, type) => {
    if (type === "connection") {
      if (value === "Lost") return "text-[#FF3131]";
      if (value === "Degraded") return "text-[#00FFD1]";
      return "text-[#FFFFFF]";
    }
    return "text-[#FFFFFF]";
  };

  return (
    <div className="border border-[#1F1F1F] bg-[#0A0A0A]">
      <div className="px-4 py-3 border-b border-[#1F1F1F]">
        <div className="text-[12px] font-semibold text-[#737373]">HARDWARE HEALTH</div>
      </div>
      <div className="p-4 space-y-3">
        <div className="border border-[#1F1F1F] p-3">
          <div className="text-[12px] font-semibold text-[#737373] mb-2">Voltage</div>
          <div className={`mono text-[18px] ${tone(sensors.voltage, "voltage")}`}>{sensors.voltage.toFixed(1)} V</div>
        </div>
        <div className="border border-[#1F1F1F] p-3">
          <div className="text-[12px] font-semibold text-[#737373] mb-2">Temperature</div>
          <div className="mono text-[18px] text-[#FFFFFF]">{sensors.temperature.toFixed(1)} C</div>
        </div>
        <div className="border border-[#1F1F1F] p-3">
          <div className="text-[12px] font-semibold text-[#737373] mb-2">Connection</div>
          <div className={`mono text-[18px] ${tone(sensors.connection, "connection")}`}>{sensors.connection}</div>
        </div>
      </div>
    </div>
  );
}

