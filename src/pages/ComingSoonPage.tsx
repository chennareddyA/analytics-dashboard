type Props = { title: string; step: string }

// Placeholder for pages we build in later steps
export default function ComingSoonPage({ title, step }: Props) {
  return (
    <div className="grid min-h-[50vh] place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div>
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">Coming in {step}.</p>
      </div>
    </div>
  )
}
