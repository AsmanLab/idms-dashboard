import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accessService } from '../services/access.service'
import type { AccessRequest } from '../types/access.types'

export function useApproveRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => accessService.approveRequest(id),
    onSuccess: (updated) => {
      queryClient.setQueryData<AccessRequest[]>(['access-requests'], (old) =>
        old ? old.map((r) => (r.id === updated.id ? updated : r)) : old,
      )
      queryClient.setQueryData<AccessRequest>(['access-request', updated.id], updated)
    },
  })
}
