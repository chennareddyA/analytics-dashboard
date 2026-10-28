import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { loginRequest } from '../api/auth'
import { getErrorMessage } from '../api/client'
import { useAuthStore } from '../store/authStore'

const DEMO = { username: 'emilys', password: 'emilyspass' }

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAuthStore((s) => s.token)
  const setSession = useAuthStore((s) => s.setSession)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Where to go after login: the page they tried to open, or the dashboard
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  // Already logged in? Skip the login page.
  if (token) return <Navigate to={from} replace />

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Enter your username and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await loginRequest({ username: username.trim(), password })
      // Keep only what the app needs; never store the password
      setSession(
        {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
        },
        data.accessToken,
      )
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function fillDemo() {
    setUsername(DEMO.username)
    setPassword(DEMO.password)
    setError('')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            A
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Track sales, products and customers in one place.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-16 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 my-auto h-fit rounded px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-600">
          Demo account: <span className="font-medium">{DEMO.username}</span> /{' '}
          <span className="font-medium">{DEMO.password}</span>
          <button
            type="button"
            onClick={fillDemo}
            className="mt-2 block w-full rounded-lg bg-slate-200 py-1.5 font-medium text-slate-800 hover:bg-slate-300"
          >
            Fill demo credentials
          </button>
        </div>
      </div>
    </main>
  )
}
