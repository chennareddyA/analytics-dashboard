import type { ReactTable, RowData } from '@tanstack/react-table'
import type { AppFeatures } from '../../lib/table'

type Props<TData extends RowData> = {
  table: ReactTable<AppFeatures, TData>
  emptyMessage?: string
}

const sortIcon = { asc: '↑', desc: '↓' } as const

// Renders any table built with our shared `features`.
// Header cells become sort buttons when the column can sort.
export default function DataTable<TData extends RowData>({ table, emptyMessage = 'No results match your filters.' }: Props<TData>) {
  const rows = table.getRowModel().rows

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted()
                const canSort = header.column.getCanSort()
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                    className="px-4 py-3 font-semibold"
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 hover:text-slate-900"
                      >
                        <table.FlexRender header={header} />
                        <span className="w-3 text-indigo-600" aria-hidden="true">
                          {sorted ? sortIcon[sorted] : ''}
                        </span>
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={table.getAllLeafColumns().length} className="px-4 py-12 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-700">
                    <table.FlexRender cell={cell} />
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
