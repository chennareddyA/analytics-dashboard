import { formatCurrency, formatNumber } from '../utils/format'

type Props = {
  items: { id: number; title: string; thumbnail?: string; units: number; revenue: number }[]
}

export default function TopProductsList({ items }: Props) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No sales yet.</p>
  }

  return (
    <ol className="divide-y divide-slate-100">
      {items.map((p, i) => (
        <li key={p.id} className="flex items-center gap-3 py-3">
          <span className="w-4 text-sm font-semibold text-slate-400">{i + 1}</span>
          {p.thumbnail ? (
            <img src={p.thumbnail} alt="" loading="lazy" className="size-10 rounded-lg bg-slate-100 object-cover" />
          ) : (
            <div className="size-10 rounded-lg bg-slate-100" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{p.title}</p>
            <p className="text-xs text-slate-500">{formatNumber(p.units)} units</p>
          </div>
          <span className="text-sm font-semibold text-slate-900">{formatCurrency(p.revenue)}</span>
        </li>
      ))}
    </ol>
  )
}
