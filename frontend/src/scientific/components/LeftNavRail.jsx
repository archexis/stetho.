import { History, Radar, Settings2, ThermometerSun } from "lucide-react";
import { Sidebar } from "../../shadcn/Sidebar";

const NAV = [
  { id: "Monitor", label: "Monitor", Icon: Radar },
  { id: "Cycle History", label: "Cycle History", Icon: History },
  { id: "Calibration", label: "Calibration", Icon: Settings2 },
  { id: "Hardware Health", label: "Hardware Health", Icon: ThermometerSun },
];

export function LeftNavRail({ active, onSelect }) {
  return (
    <nav className="w-[64px] border-r-[0.5px] border-[var(--border)] flex flex-col py-2 gap-2">
      <Sidebar
        iconOnly
        items={NAV.map((i) => ({ id: i.id, label: i.label, icon: i.Icon }))}
        activeId={active}
        onSelect={onSelect}
        className="flex-1 flex flex-col items-center gap-2"
      />
      <div className="mb-2 text-[11px] mono" style={{ color: "var(--muted)" }}>
        ST
      </div>
    </nav>
  );
}

