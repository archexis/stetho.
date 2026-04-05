import { createContext, useContext, useMemo, useState } from "react";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value: controlledValue, onValueChange, children }) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue ?? internal;

  const ctx = useMemo(() => {
    return {
      value,
      setValue: (next) => {
        if (onValueChange) onValueChange(next);
        if (controlledValue === undefined) setInternal(next);
      },
    };
  }, [value, onValueChange, controlledValue]);

  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}

export function TabsList({ children, className = "" }) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className = "" }) {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={`px-3 py-2 text-[13px] border-[0.5px] border-[var(--border)] rounded-[4px] transition ${
        isActive ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return <div className={className}>{children}</div>;
}

