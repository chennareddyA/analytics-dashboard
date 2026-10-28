import { api } from './client'
import type { LoginCredentials, LoginResponse } from '../types/auth'

export async function loginRequest(credentials: LoginCredentials) {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    ...credentials,
    expiresInMins: 60,
  })
  return data
}
