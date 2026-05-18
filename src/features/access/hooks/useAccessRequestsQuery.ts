import { useQuery } from '@tanstack/react-query'
import { accessService } from '../services/access.service'

export function useAccessRequestsQuery() {
  return useQuery({
    queryKey: ['access-requests'],
    queryFn: accessService.getRequests,
  })
}
