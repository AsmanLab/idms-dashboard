import api from '@/services/api'
import type { AuthResponse, LoginCredentials } from '../types/auth.types'

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials).then((r) => r.data),

  logout: () => api.post('/auth/logout'),
}
