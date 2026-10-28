import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatNumber } from '../../utils/format'

type Props = {
  data: { name: string; value: number }[]
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export default function StockHealthChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div>
      <div className="relative h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={2} stroke="none">
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [formatNumber(Number(value)), String(name)]} />
          </PieChart>
        </ResponsiveContainer>
        {/* Total in the middle of the donut */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(total)}</p>
            <p className="text-xs text-slate-500">products</p>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              {d.name}
            </span>
            <span className="font-medium text-slate-900">{formatNumber(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
