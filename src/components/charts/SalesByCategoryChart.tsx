import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../../utils/format'

type Props = {
  data: { category: string; revenue: number }[]
}

// Horizontal bars read better than vertical ones when labels are long
export default function SalesByCategoryChart({ data }: Props) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={110}
            tick={{ fontSize: 12, fill: '#334155' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
