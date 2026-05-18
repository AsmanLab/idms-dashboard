import api from '@/services/api'
import type { UsersResponse } from '../types/users.types'

export const usersService = {
  getAll: () => api.get<UsersResponse>('/users').then((r) => r.data.data),
}
