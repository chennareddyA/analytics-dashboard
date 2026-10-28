import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../types/auth'

type AuthState = {
  user: AuthUser | null
  token: string | null
  setSession: (user: AuthUser, token: string) => void
  logout: () => void
}

// Global auth state. `persist` saves it to localStorage so the user
// stays logged in after a page refresh.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth' },
  ),
)
