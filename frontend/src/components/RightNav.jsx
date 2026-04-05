import {
  Download,
  History,
  Activity,
  SlidersHorizontal,
  Thermometer,
} from "lucide-react";

const ICON_PROPS = { size: 18, strokeWidth: 1.5 };

const navItems = [
  { id: "Monitor", label: "Monitor", Icon: Activity },
  { id: "History", label: "History", Icon: History },
  { id: "Sensors", label: "Sensors", Icon: Thermometer },
  { id: "Thresholds", label: "Thresholds", Icon: SlidersHorizontal },
  { id: "Export", label: "Export", Icon: Download },
];

export function RightNav({ activePanel, onSelect }) {
  return (
    <div className="space-y-2">
      {navItems.map((item) => {
        const isActive = activePanel === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex w-full items-center gap-2 border border-[#1F1F1F] px-3 py-2 text-left text-[13px] font-medium transition ${
              isActive
                ? "bg-[#00FFD1]/10 text-[#00FFD1] border-[#00FFD1]/40"
                : "bg-transparent text-[#FFFFFF] hover:bg-[#1F1F1F]"
            }`}
          >
            <item.Icon {...ICON_PROPS} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

