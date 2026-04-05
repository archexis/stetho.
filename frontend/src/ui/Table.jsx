export function Table({ children, className = "" }) {
  return (
    <div className={`overflow-auto border border-[#1F1F1F] ${className}`}>
      <table className="min-w-full border-collapse text-left text-[13px]">
        {children}
      </table>
    </div>
  );
}

export function Th({ children }) {
  return (
    <th className="sticky top-0 bg-[#0A0A0A] px-3 py-2 font-semibold text-[#737373] border-b border-[#1F1F1F]">
      {children}
    </th>
  );
}

export function Td({ children }) {
  return <td className="px-3 py-2 border-b border-[#1F1F1F]">{children}</td>;
}

