import { LayoutDashboard, Sigma, ClipboardList, Settings2 } from "lucide-react";
import { Sidebar } from "../../shadcn/Sidebar";

const ICON_PROPS = { size: 16, strokeWidth: 1.5 };

const leftItems = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "Analytics", label: "Analytics", icon: Sigma },
  { id: "Batch Logs", label: "Batch Logs", icon: ClipboardList },
  { id: "Settings", label: "Settings", icon: Settings2 },
];

export function LeftRail({ active, onSelect }) {
  return (
    <Sidebar
      items={leftItems.map((i) => ({
        ...i,
        icon: i.icon,
      }))}
      activeId={active}
      onSelect={onSelect}
      className="w-[240px]"
    />
  );
}

