export function ThinTable({ columns, rows }) {
  return (
    <div className="overflow-auto border-[0.5px] border-[var(--border)] rounded-[4px] bg-white">
      <table className="min-w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left px-3 py-2 border-b-[0.5px] border-[var(--border)] text-[var(--muted)] font-semibold">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} className="border-b-[0.5px] border-[var(--border)]">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-[var(--text)]">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

