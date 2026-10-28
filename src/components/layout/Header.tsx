import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogoutIcon, MenuIcon } from '../Icons'
import { navItems } from './navItems'

type Props = {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: Props) {
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const title = navItems.find((item) => item.to === pathname)?.label ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        {user?.image && <img src={user.image} alt="" className="size-9 rounded-full bg-slate-100" />}
        <button
          type="button"
          onClick={logout}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Log out"
          title="Log out"
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  )
}
