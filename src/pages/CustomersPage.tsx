import { useEffect, useState } from 'react'
import { createColumnHelper, useTable } from '@tanstack/react-table'
import { fetchAllCustomers } from '../api/dashboard'
import { useFetch } from '../hooks/useFetch'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { features } from '../lib/table'
import type { Customer } from '../types/api'
import DataTable from '../components/table/DataTable'
import Pagination from '../components/table/Pagination'
import ErrorState from '../components/ErrorState'
import { FilterSelect, SearchInput, TableSkeleton, ToolbarButton } from '../components/table/Toolbar'
import { exportToExcel } from '../utils/exportExcel'

const roleStyles: Record<string, string> = {
  admin: 'bg-indigo-50 text-indigo-700',
  moderator: 'bg-sky-50 text-sky-700',
  user: 'bg-slate-100 text-slate-700',
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const helper = createColumnHelper<typeof features, Customer>()

const columns = helper.columns([
  helper.accessor((c) => `${c.firstName} ${c.lastName}`, {
    id: 'name',
    header: 'Customer',
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-3">
        <img src={row.original.image} alt="" loading="lazy" className="size-9 rounded-full bg-slate-100" />
        <div>
          <p className="font-medium text-slate-900">{getValue()}</p>
          <p className="text-xs text-slate-500">{row.original.email}</p>
        </div>
      </div>
    ),
  }),
  helper.accessor('phone', { header: 'Phone' }),
  helper.accessor((c) => c.address.city, { id: 'city', header: 'City' }),
  helper.accessor((c) => c.company.name, { id: 'company', header: 'Company' }),
  helper.accessor('age', { header: 'Age' }),
  helper.accessor('gender', {
    header: 'Gender',
    filterFn: 'equalsString',
    cell: (info) => capitalize(info.getValue()),
  }),
  helper.accessor('role', {
    header: 'Role',
    filterFn: 'equalsString',
    cell: (info) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleStyles[info.getValue()] ?? roleStyles.user}`}>
        {capitalize(info.getValue())}
      </span>
    ),
  }),
])

const EMPTY: Customer[] = []

export default function CustomersPage() {
  const { data, loading, error, retry } = useFetch(fetchAllCustomers)

  const table = useTable({
    features,
    columns,
    data: data ?? EMPTY,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    globalFilterFn: 'includesString',
    getColumnCanGlobalFilter: (column) => ['name', 'city', 'company'].includes(column.id),
  })

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  useEffect(() => {
    table.setGlobalFilter(debouncedSearch)
  }, [debouncedSearch, table])

  const role = (table.getColumn('role')?.getFilterValue() as string | undefined) ?? ''
  const gender = (table.getColumn('gender')?.getFilterValue() as string | undefined) ?? ''
  const hasFilters = Boolean(search || role || gender)

  function clearFilters() {
    setSearch('')
    table.resetColumnFilters()
    table.resetGlobalFilter()
  }

  const [exporting, setExporting] = useState(false)
  async function handleExport() {
    setExporting(true)
    try {
      const rows = table.getPrePaginatedRowModel().rows.map((r) => r.original)
      await exportToExcel(
        rows,
        [
          { header: 'ID', value: (c) => c.id, width: 6 },
          { header: 'Name', value: (c) => `${c.firstName} ${c.lastName}`, width: 24 },
          { header: 'Email', value: (c) => c.email, width: 34 },
          { header: 'Phone', value: (c) => c.phone, width: 18 },
          { header: 'City', value: (c) => c.address.city, width: 16 },
          { header: 'Company', value: (c) => c.company.name, width: 28 },
          { header: 'Age', value: (c) => c.age, width: 6 },
          { header: 'Gender', value: (c) => capitalize(c.gender), width: 10 },
          { header: 'Role', value: (c) => capitalize(c.role), width: 12 },
        ],
        'customers.xlsx',
      )
    } finally {
      setExporting(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={retry} />

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, city, company" />
        <div className="flex flex-wrap gap-3">
          <FilterSelect
            label="All roles"
            value={role}
            onChange={(v) => table.getColumn('role')?.setFilterValue(v || undefined)}
            options={['admin', 'moderator', 'user'].map((r) => ({ value: r, label: capitalize(r) }))}
          />
          <FilterSelect
            label="Any gender"
            value={gender}
            onChange={(v) => table.getColumn('gender')?.setFilterValue(v || undefined)}
            options={['female', 'male'].map((g) => ({ value: g, label: capitalize(g) }))}
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
          <DataTable table={table} emptyMessage="No customers match your search or filters." />
          <Pagination table={table} itemLabel="customers" />
        </>
      )}
    </div>
  )
}
