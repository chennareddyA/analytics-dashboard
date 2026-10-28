const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat('en-US')

export const formatCurrency = (value: number) => currency.format(value)
export const formatNumber = (value: number) => number.format(value)
