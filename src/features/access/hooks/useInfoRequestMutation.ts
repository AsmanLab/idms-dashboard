import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accessService } from '../services/access.service'
import type { AccessRequest } from '../types/access.types'

export function useInfoRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      accessService.requestInfo(id, message),
    onSuccess: (updated) => {
      queryClient.setQueryData<AccessRequest[]>(['access-requests'], (old) =>
        old ? old.map((r) => (r.id === updated.id ? updated : r)) : old,
      )
      queryClient.setQueryData<AccessRequest>(['access-request', updated.id], updated)
    },
  })
}
