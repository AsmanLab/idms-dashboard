import api from '@/services/api'
import type { LoginCredentials, LoginResponse } from '../types/auth.types'

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/auth/login', credentials).then((r) => r.data),

  logout: () =>
    api.post('/auth/logout').catch(() => {}),
}
