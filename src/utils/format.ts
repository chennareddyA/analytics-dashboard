const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat('en-US')

export const formatCurrency = (value: number) => currency.format(value)
export const formatNumber = (value: number) => number.format(value)

const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Product prices keep their cents ($9.99), totals above are rounded
export const formatPrice = (value: number) => price.format(value)
