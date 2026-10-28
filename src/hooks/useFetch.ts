import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { getErrorMessage } from '../api/client'

// Generic data loader: runs `fetcher` on mount, cancels it on unmount,
// and exposes loading / error state plus a retry function.
// Pass a stable function (defined outside the component) so it doesn't refetch on every render.
export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    fetcher(controller.signal)
      .then((result) => {
        setData(result)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        setError(getErrorMessage(err))
        setLoading(false)
      })

    return () => controller.abort()
  }, [fetcher, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { data, loading, error, retry }
}
