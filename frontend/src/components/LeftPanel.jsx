import { Activity, ShieldAlert, Thermometer, Zap } from "lucide-react";
import { reactorMeta } from "../data/reactorMeta";
import { StatusPill } from "./StatusPill";

const ICON_PROPS = { size: 16, strokeWidth: 1.5 };

function MetaRow({ icon, label, value, tone = "default" }) {
  const toneStyle =
    tone === "alert"
      ? "text-[#FF3131]"
      : tone === "success"
        ? "text-[#00FFD1]"
        : "text-[#FFFFFF]";
  return (
    <div className="grid grid-cols-[24px_1fr] items-center gap-2 py-2 border-b border-[#1F1F1F]">
      <div className={`flex items-center justify-center ${toneStyle}`}>{icon}</div>
      <div>
        <div className="text-[12px] font-semibold text-[#737373]">{label}</div>
        <div className={`mono text-[13px] ${toneStyle}`}>{value}</div>
      </div>
    </div>
  );
}

export function LeftPanel({ status, sensors, latestScan }) {
  const severity = latestScan?.severity;
  const anomalyProb = latestScan?.anomaly_probability;
  return (
    <div className="border border-[#1F1F1F] bg-[#0A0A0A]">
      <div className="px-4 py-3 border-b border-[#1F1F1F]">
        <div className="text-[12px] font-semibold tracking-[0.18em] text-[#737373]">
          STETHO SYSTEM
        </div>
        <div className="mt-1 text-[16px] font-semibold text-[#FFFFFF]">Reactor Diagnostics</div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <StatusPill status={status} probability={anomalyProb} severity={severity} />
          <div className="flex items-center justify-center w-[34px] h-[34px] border border-[#1F1F1F]">
            {status === "Result" && severity === "HIGH" ? (
              <ShieldAlert {...ICON_PROPS} className="text-[#FF3131]" />
            ) : (
              <Activity {...ICON_PROPS} className="text-[#00FFD1]" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <MetaRow
            icon={<span className="mono">#</span>}
            label="Reactor ID"
            value={reactorMeta.reactorId}
          />
          <MetaRow icon={<span className="mono">@</span>} label="Location" value={reactorMeta.location} />
          <MetaRow icon={<span className="mono">G</span>} label="Group" value={reactorMeta.group} />
        </div>

        <div>
          <div className="text-[12px] font-semibold text-[#737373] mb-3">Sensors (Health)</div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-[#1F1F1F] p-2">
                <div className="flex items-center gap-2 text-[#737373] text-[12px]">
                  <Thermometer {...ICON_PROPS} />
                  Temp
                </div>
                <div className="mono text-[13px] text-[#FFFFFF]">{sensors.temperature.toFixed(1)} C</div>
              </div>
              <div className="border border-[#1F1F1F] p-2">
                <div className="flex items-center gap-2 text-[#737373] text-[12px]">
                  <Zap {...ICON_PROPS} />
                  Voltage
                </div>
                <div className="mono text-[13px] text-[#FFFFFF]">{sensors.voltage.toFixed(1)} V</div>
              </div>
            </div>
            <div className="border border-[#1F1F1F] p-2">
              <div className="text-[#737373] text-[12px]">Connection</div>
              <div className={`mono text-[13px] ${sensors.connection === "Lost" ? "text-[#FF3131]" : sensors.connection === "Degraded" ? "text-[#00FFD1]" : "text-[#FFFFFF]"}`}>
                {sensors.connection}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

