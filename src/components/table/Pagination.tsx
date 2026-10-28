import type { ReactTable, RowData } from '@tanstack/react-table'
import type { AppFeatures } from '../../lib/table'
import { formatNumber } from '../../utils/format'

type Props<TData extends RowData> = {
  table: ReactTable<AppFeatures, TData>
  itemLabel: string
}

const PAGE_SIZES = [10, 20, 50]

export default function Pagination<TData extends RowData>({ table, itemLabel }: Props<TData>) {
  const { pageIndex, pageSize } = table.state.pagination
  const total = table.getPrePaginatedRowModel().rows.length
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)
  const pageCount = Math.max(1, table.getPageCount())

  const button =
    'rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing <span className="font-medium text-slate-900">{formatNumber(from)}</span>–
        <span className="font-medium text-slate-900">{formatNumber(to)}</span> of{' '}
        <span className="font-medium text-slate-900">{formatNumber(total)}</span> {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          Rows
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <span>
          Page {pageIndex + 1} of {pageCount}
        </span>

        <div className="flex gap-2">
          <button type="button" className={button} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </button>
          <button type="button" className={button} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
