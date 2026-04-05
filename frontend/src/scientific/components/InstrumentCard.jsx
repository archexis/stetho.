export function InstrumentCard({ className = "", children }) {
  return (
    <section
      className={`border-[0.5px] border-[var(--border)] rounded-[4px] p-3 bg-transparent ${className}`}
    >
      {children}
    </section>
  );
}

