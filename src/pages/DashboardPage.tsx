import { useMemo } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import KpiCard, { KpiCardSkeleton } from '../components/KpiCard'
import ChartCard, { ChartCardSkeleton } from '../components/ChartCard'
import ErrorState from '../components/ErrorState'
import TopProductsList from '../components/TopProductsList'
import SalesByCategoryChart from '../components/charts/SalesByCategoryChart'
import StockHealthChart from '../components/charts/StockHealthChart'
import OrderValueChart from '../components/charts/OrderValueChart'
import { CartIcon, BoxIcon, DollarIcon, UsersIcon } from '../components/Icons'
import { formatCurrency, formatNumber } from '../utils/format'
import { LOW_STOCK, orderValueDistribution, salesByCategory, stockHealth, topProducts } from '../utils/analytics'

export default function DashboardPage() {
  const { data, loading, error, retry } = useDashboardData()

  // Work out all numbers once, only when the data changes
  const stats = useMemo(() => {
    if (!data) return null
    const revenue = data.carts.reduce((sum, c) => sum + c.discountedTotal, 0)
    const orders = data.carts.length
    return {
      revenue,
      orders,
      avgOrder: orders ? revenue / orders : 0,
      unitsSold: data.carts.reduce((sum, c) => sum + c.totalQuantity, 0),
      customers: data.userCount,
      products: data.products.length,
      lowStock: data.products.filter((p) => p.stock < LOW_STOCK).length,
      categories: new Set(data.products.map((p) => p.category)).size,
      byCategory: salesByCategory(data.carts, data.products),
      orderValues: orderValueDistribution(data.carts),
      stock: stockHealth(data.products),
      best: topProducts(data.carts),
    }
  }, [data])

  if (error) return <ErrorState message={error} onRetry={retry} />

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <KpiCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCardSkeleton className="lg:col-span-2" />
          <ChartCardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Sales by category"
          description="Revenue from all orders, top 8 categories"
          className="lg:col-span-2"
        >
          <SalesByCategoryChart data={stats.byCategory} />
        </ChartCard>
        <ChartCard title="Stock health" description={`Low stock means fewer than ${LOW_STOCK} units`}>
          <StockHealthChart data={stats.stock} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Order value" description="Number of orders in each price range" className="lg:col-span-2">
          <OrderValueChart data={stats.orderValues} />
        </ChartCard>
        <ChartCard title="Best sellers" description="Top 5 products by units sold">
          <TopProductsList items={stats.best} />
        </ChartCard>
      </div>
    </div>
  )
}
