import type { Cart, Product } from '../types/api'

// Pure functions that turn raw API data into chart data.
// Keeping them out of components makes them easy to read and to unit test.

export const LOW_STOCK = 10

const titleCase = (s: string) =>
  s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/** Revenue per product category, highest first. */
export function salesByCategory(carts: Cart[], products: Product[], top = 8) {
  const categoryOf = new Map(products.map((p) => [p.id, p.category]))
  const totals = new Map<string, number>()

  for (const cart of carts) {
    for (const item of cart.products) {
      const category = categoryOf.get(item.id) ?? 'other'
      const value = item.discountedTotal ?? item.total
      totals.set(category, (totals.get(category) ?? 0) + value)
    }
  }

  return [...totals.entries()]
    .map(([category, revenue]) => ({ category: titleCase(category), revenue: Math.round(revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, top)
}

/** How many orders fall into each order-value range. */
export function orderValueDistribution(carts: Cart[]) {
  const buckets = [
    { label: 'Under $1k', min: 0, max: 1_000 },
    { label: '$1k–5k', min: 1_000, max: 5_000 },
    { label: '$5k–10k', min: 5_000, max: 10_000 },
    { label: '$10k–25k', min: 10_000, max: 25_000 },
    { label: '$25k+', min: 25_000, max: Infinity },
  ]
  return buckets.map((b) => ({
    range: b.label,
    orders: carts.filter((c) => c.discountedTotal >= b.min && c.discountedTotal < b.max).length,
  }))
}

/** Products split into stock health groups. */
export function stockHealth(products: Product[]) {
  const out = products.filter((p) => p.stock === 0).length
  const low = products.filter((p) => p.stock > 0 && p.stock < LOW_STOCK).length
  const healthy = products.length - out - low
  return [
    { name: 'In stock', value: healthy },
    { name: 'Low stock', value: low },
    { name: 'Out of stock', value: out },
  ]
}

/** Best-selling products by units sold. */
export function topProducts(carts: Cart[], top = 5) {
  const map = new Map<number, { id: number; title: string; thumbnail?: string; units: number; revenue: number }>()

  for (const cart of carts) {
    for (const item of cart.products) {
      const entry = map.get(item.id) ?? {
        id: item.id,
        title: item.title,
        thumbnail: item.thumbnail,
        units: 0,
        revenue: 0,
      }
      entry.units += item.quantity
      entry.revenue += item.discountedTotal ?? item.total
      map.set(item.id, entry)
    }
  }

  return [...map.values()].sort((a, b) => b.units - a.units).slice(0, top)
}
