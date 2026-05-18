import { useQuery } from '@tanstack/react-query'
import { usersService } from '../services/users.service'

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  })
}
