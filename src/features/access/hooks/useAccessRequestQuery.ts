import { useQuery } from '@tanstack/react-query'
import { accessService } from '../services/access.service'

export function useAccessRequestQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['access-request', id],
    queryFn: () => accessService.getRequest(id!),
    enabled: Boolean(id),
  })
}
