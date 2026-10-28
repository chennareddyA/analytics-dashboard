import { useMemo } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import KpiCard, { KpiCardSkeleton } from '../components/KpiCard'
import ErrorState from '../components/ErrorState'
import { CartIcon, BoxIcon, DollarIcon, UsersIcon } from '../components/Icons'
import { formatCurrency, formatNumber } from '../utils/format'

const LOW_STOCK = 10

export default function DashboardPage() {
  const { data, loading, error, retry } = useDashboardData()

  // Work out the KPI numbers once, only when the data changes
  const stats = useMemo(() => {
    if (!data) return null
    const revenue = data.carts.reduce((sum, c) => sum + c.discountedTotal, 0)
    const orders = data.carts.length
    const unitsSold = data.carts.reduce((sum, c) => sum + c.totalQuantity, 0)
    const lowStock = data.products.filter((p) => p.stock < LOW_STOCK).length
    const categories = new Set(data.products.map((p) => p.category)).size
    return {
      revenue,
      orders,
      avgOrder: orders ? revenue / orders : 0,
      unitsSold,
      customers: data.userCount,
      products: data.products.length,
      lowStock,
      categories,
    }
  }, [data])

  if (error) return <ErrorState message={error} onRetry={retry} />

  return (
    <div className="space-y-6">
      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !stats ? (
          Array.from({ length: 4 }, (_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              label="Revenue"
              value={formatCurrency(stats.revenue)}
              detail={`Avg order ${formatCurrency(stats.avgOrder)}`}
              icon={DollarIcon}
              tone="indigo"
            />
            <KpiCard
              label="Orders"
              value={formatNumber(stats.orders)}
              detail={`${formatNumber(stats.unitsSold)} units sold`}
              icon={CartIcon}
              tone="emerald"
            />
            <KpiCard
              label="Customers"
              value={formatNumber(stats.customers)}
              detail="Registered accounts"
              icon={UsersIcon}
              tone="sky"
            />
            <KpiCard
              label="Products"
              value={formatNumber(stats.products)}
              detail={`${stats.lowStock} low in stock, ${stats.categories} categories`}
              icon={BoxIcon}
              tone="amber"
            />
          </>
        )}
      </section>

      {/* Charts arrive in step 3 */}
      <section className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Charts coming in step 3
      </section>
    </div>
  )
}
