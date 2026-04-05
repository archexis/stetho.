export function Panel({ className = "", ...props }) {
  return (
    <div
      className={`border border-[#1F1F1F] bg-[#0A0A0A] ${className}`}
      {...props}
    />
  );
}

