import { useAuthStore } from '../store/authStore'

// Temporary page. In the next step this becomes the real dashboard layout.
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto flex max-w-3xl items-center justify-between rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          {user?.image && <img src={user.image} alt="" className="size-12 rounded-full bg-slate-100" />}
          <div>
            <h1 className="text-xl font-bold text-slate-900">Welcome, {user?.firstName}</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Log out
        </button>
      </div>
    </main>
  )
}
