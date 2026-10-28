import { useEffect, useState } from 'react'

// Returns `value` only after it has stopped changing for `delay` ms.
// Used so the table filters once the user pauses typing, not on every key.
export function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(t)
  }, [value, delay])

  return debounced
}
