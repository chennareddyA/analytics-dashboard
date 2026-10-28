import type { ComponentType } from 'react'

type Props = {
  label: string
  value: string
  detail: string
  icon: ComponentType<{ className?: string }>
  tone: 'indigo' | 'emerald' | 'amber' | 'sky'
}

const tones = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
}

export default function KpiCard({ label, value, detail, icon: Icon, tone }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon />
        </span>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="size-10 rounded-xl bg-slate-200" />
      </div>
      <div className="mt-3 h-8 w-32 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-40 rounded bg-slate-200" />
    </div>
  )
}
