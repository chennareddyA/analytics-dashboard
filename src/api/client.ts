import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// One shared axios instance for the whole app
export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000,
})

// Attach the token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token has expired, the API returns 401: log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

// Turn any error into a message we can show the user
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Cannot reach the server. Check your internet connection.'
    const message = (error.response.data as { message?: string } | undefined)?.message
    return message ?? `Request failed (${error.response.status}).`
  }
  return 'Something went wrong. Please try again.'
}
