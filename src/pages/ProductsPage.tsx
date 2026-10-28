import { useEffect, useMemo, useState } from 'react'
import { createColumnHelper, useTable } from '@tanstack/react-table'
import { fetchAllProducts } from '../api/dashboard'
import { useFetch } from '../hooks/useFetch'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { features } from '../lib/table'
import type { Product } from '../types/api'
import DataTable from '../components/table/DataTable'
import Pagination from '../components/table/Pagination'
import ErrorState from '../components/ErrorState'
import { FilterSelect, SearchInput, TableSkeleton, ToolbarButton } from '../components/table/Toolbar'
import { LOW_STOCK } from '../utils/analytics'
import { formatPrice } from '../utils/format'
import { exportToExcel } from '../utils/exportExcel'

type StockStatus = 'in' | 'low' | 'out'

function stockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out'
  if (stock < LOW_STOCK) return 'low'
  return 'in'
}

const statusStyles: Record<StockStatus, string> = {
  in: 'bg-emerald-50 text-emerald-700',
  low: 'bg-amber-50 text-amber-700',
  out: 'bg-red-50 text-red-700',
}
const statusLabels: Record<StockStatus, string> = { in: 'In stock', low: 'Low stock', out: 'Out of stock' }

const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

// Columns live outside the component so they are created once (TanStack recommends stable columns)
const helper = createColumnHelper<typeof features, Product>()

const columns = helper.columns([
  helper.accessor('title', {
    header: 'Product',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img src={row.original.thumbnail} alt="" loading="lazy" className="size-10 rounded-lg bg-slate-100 object-cover" />
        <span className="font-medium text-slate-900">{row.original.title}</span>
      </div>
    ),
  }),
  helper.accessor((p) => p.brand ?? '', {
    id: 'brand',
    header: 'Brand',
    cell: (info) => info.getValue() || <span className="text-slate-400">None</span>,
  }),
  helper.accessor('category', {
    header: 'Category',
    filterFn: 'equalsString',
    cell: (info) => titleCase(info.getValue()),
  }),
  helper.accessor('price', {
    header: 'Price',
    cell: (info) => formatPrice(info.getValue()),
  }),
  helper.accessor('stock', {
    header: 'Stock',
    // Custom filter: compare the stock number's status with the selected status
    filterFn: (row, columnId, filterValue: StockStatus) => stockStatus(row.getValue<number>(columnId)) === filterValue,
    cell: (info) => {
      const status = stockStatus(info.getValue())
      return (
        <span className="inline-flex items-center gap-2">
          <span className="w-8 tabular-nums">{info.getValue()}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
            {statusLabels[status]}
          </span>
        </span>
      )
    },
  }),
  helper.accessor('rating', {
    header: 'Rating',
    cell: (info) => `★ ${info.getValue().toFixed(1)}`,
  }),
])

const EMPTY: Product[] = []

export default function ProductsPage() {
  const { data, loading, error, retry } = useFetch(fetchAllProducts)
  const products = data ?? EMPTY

  const table = useTable({
    features,
    columns,
    data: products,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    globalFilterFn: 'includesString',
    // Search only looks at text columns
    getColumnCanGlobalFilter: (column) => ['title', 'brand', 'category'].includes(column.id),
  })

  // Debounced search box wired to the table's global filter
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  useEffect(() => {
    table.setGlobalFilter(debouncedSearch)
  }, [debouncedSearch, table])

  const categoryOptions = useMemo(
    () =>
      [...new Set(products.map((p) => p.category))]
        .sort()
        .map((c) => ({ value: c, label: titleCase(c) })),
    [products],
  )

  const category = (table.getColumn('category')?.getFilterValue() as string | undefined) ?? ''
  const status = (table.getColumn('stock')?.getFilterValue() as string | undefined) ?? ''
  const hasFilters = Boolean(search || category || status)

  function clearFilters() {
    setSearch('')
    table.resetColumnFilters()
    table.resetGlobalFilter()
  }

  const [exporting, setExporting] = useState(false)
  async function handleExport() {
    setExporting(true)
    try {
      // Filtered + sorted rows across all pages
      const rows = table.getPrePaginatedRowModel().rows.map((r) => r.original)
      await exportToExcel(
        rows,
        [
          { header: 'ID', value: (p) => p.id, width: 6 },
          { header: 'Product', value: (p) => p.title, width: 36 },
          { header: 'Brand', value: (p) => p.brand ?? '', width: 18 },
          { header: 'Category', value: (p) => titleCase(p.category), width: 18 },
          { header: 'Price', value: (p) => p.price, format: '$#,##0.00', width: 12 },
          { header: 'Stock', value: (p) => p.stock, width: 8 },
          { header: 'Status', value: (p) => statusLabels[stockStatus(p.stock)], width: 14 },
          { header: 'Rating', value: (p) => p.rating, format: '0.0', width: 8 },
        ],
        'products.xlsx',
      )
    } finally {
      setExporting(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={retry} />

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products, brands, categories" />
        <div className="flex flex-wrap gap-3">
          <FilterSelect
            label="All categories"
            value={category}
            onChange={(v) => table.getColumn('category')?.setFilterValue(v || undefined)}
            options={categoryOptions}
          />
          <FilterSelect
            label="Any stock status"
            value={status}
            onChange={(v) => table.getColumn('stock')?.setFilterValue(v || undefined)}
            options={(Object.keys(statusLabels) as StockStatus[]).map((s) => ({ value: s, label: statusLabels[s] }))}
          />
          {hasFilters && <ToolbarButton onClick={clearFilters}>Clear filters</ToolbarButton>}
        </div>
        <div className="lg:ml-auto">
          <ToolbarButton
            variant="primary"
            onClick={handleExport}
            disabled={loading || exporting || table.getPrePaginatedRowModel().rows.length === 0}
          >
            {exporting ? 'Exporting…' : 'Export to Excel'}
          </ToolbarButton>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable table={table} emptyMessage="No products match your search or filters." />
          <Pagination table={table} itemLabel="products" />
        </>
      )}
    </div>
  )
}
