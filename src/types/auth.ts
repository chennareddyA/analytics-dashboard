// Shape of the user returned by DummyJSON's /auth/login endpoint
export type AuthUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}

export type LoginResponse = AuthUser & {
  accessToken: string
  refreshToken: string
}

export type LoginCredentials = {
  username: string
  password: string
}
