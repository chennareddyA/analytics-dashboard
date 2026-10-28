import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export default function ChartCard({ title, description, className = '', children }: Props) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function ChartCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl border border-slate-200 bg-white p-5 ${className}`} aria-hidden="true">
      <div className="h-5 w-40 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-56 rounded bg-slate-200" />
      <div className="mt-6 h-64 rounded-xl bg-slate-100" />
    </div>
  )
}
