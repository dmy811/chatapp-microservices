export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface UserData {
  id: string
  email: string
  displayName: string
  createdAt: string
}

export interface AuthResponse extends AuthTokens {
  user: UserData
}

export interface RegisterPayload {
  email: string
  password: string
  displayName: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RefreshPayload {
  refreshToken: string
}
