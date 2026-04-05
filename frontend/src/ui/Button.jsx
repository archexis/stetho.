export function Button({
  variant = "default",
  className = "",
  disabled = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 border border-[#1F1F1F] bg-transparent px-3 py-2 text-[13px] font-medium text-[#FFFFFF] transition";

  const variants = {
    default: "hover:bg-[#1F1F1F]",
    primary: "border-[#00FFD1]/50 text-[#00FFD1] hover:bg-[#00FFD1]/10",
    danger: "border-[#FF3131]/50 text-[#FF3131] hover:bg-[#FF3131]/10",
    subtle: "text-[#737373] hover:bg-[#1F1F1F] hover:text-[#FFFFFF]",
  };

  const disabledClass = disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent" : "";
  return (
    <button
      disabled={disabled}
      className={`${base} ${variants[variant] ?? variants.default} ${disabledClass} ${className}`}
      {...props}
    />
  );
}

