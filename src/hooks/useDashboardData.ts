import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { fetchAllCarts, fetchAllProducts, fetchUserCount } from '../api/dashboard'
import { getErrorMessage } from '../api/client'
import type { Cart, Product } from '../types/api'

type DashboardData = {
  products: Product[]
  carts: Cart[]
  userCount: number
}

// Loads everything the overview page needs in parallel.
// Returns loading / error state and a `retry` function.
export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Cancel the requests if the user leaves the page before they finish
    const controller = new AbortController()
    const { signal } = controller

    setLoading(true)
    setError('')

    Promise.all([fetchAllProducts(signal), fetchAllCarts(signal), fetchUserCount(signal)])
      .then(([products, carts, userCount]) => {
        setData({ products, carts, userCount })
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        setError(getErrorMessage(err))
        setLoading(false)
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { data, loading, error, retry }
}
