import clsx from 'clsx'

export interface Column<T> {
  header: string
  accessor?: keyof T
  render?: (row: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  rowKey: (row: T) => string | number
}

export default function Table<T>({ columns, data, loading, emptyMessage = 'Sin registros', rowKey }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col, i) => (
              <th
                key={i}
                className={clsx('px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100">
                {columns.map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr key={rowKey(row)} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                {columns.map((col, i) => (
                  <td key={i} className={clsx('px-4 py-3 text-slate-700', col.className)}>
                    {col.render ? col.render(row) : col.accessor ? String(row[col.accessor] ?? '') : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
