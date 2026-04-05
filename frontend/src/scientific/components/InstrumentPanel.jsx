export function InstrumentPanel({ className = "", children }) {
  return (
    <section
      className={`bg-white border-[0.5px] border-[var(--border)] rounded-[4px] p-3 ${className}`}
    >
      {children}
    </section>
  );
}

export function InstrumentHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <div className="text-[12px] font-semibold tracking-[0.18em] text-[var(--muted)]">
        {title}
      </div>
      {subtitle ? (
        <div className="mt-1 text-[13px] text-[var(--text)]">{subtitle}</div>
      ) : null}
    </div>
  );
}

