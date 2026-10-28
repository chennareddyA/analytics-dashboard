export default function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      <span className="sr-only">Loading page</span>
    </div>
  )
}
