import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accessService } from '../services/access.service'
import type { AccessRequest } from '../types/access.types'

export function useBulkApproveMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => accessService.bulkApprove(ids),
    onSuccess: (updatedRequests) => {
      queryClient.setQueryData<AccessRequest[]>(['access-requests'], (old) => {
        if (!old) return old
        const updatedMap = new Map(updatedRequests.map((r) => [r.id, r]))
        return old.map((r) => updatedMap.get(r.id) ?? r)
      })
      for (const updated of updatedRequests) {
        queryClient.setQueryData<AccessRequest>(['access-request', updated.id], updated)
      }
    },
  })
}
