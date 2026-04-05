import { useMemo } from "react";

export function Sidebar({ items, activeId, onSelect, className = "", iconOnly = false }) {
  const safeItems = useMemo(() => items ?? [], [items]);
  return (
    <nav className={`flex flex-col gap-2 ${className}`}>
      {safeItems.map((item) => {
        const isActive = item.id === activeId;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={`flex items-center border-[0.5px] border-[var(--border)] rounded-[4px] transition ${
              iconOnly ? "w-[44px] h-[44px] justify-center p-0" : "px-3 py-2 gap-2 text-[13px]"
            } ${isActive ? "text-[var(--primary)] border-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
            style={{ backgroundColor: "transparent" }}
          >
            {Icon ? <Icon size={16} strokeWidth={1.5} /> : null}
            {!iconOnly ? <span className="truncate">{item.label}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}

