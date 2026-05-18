import { useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'
import type { IdentitySettings } from '../types/profile.types'

export function useUpdateSettingsMutation(identityId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<IdentitySettings>) =>
      profileService.updateSettings(identityId, patch),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: ['settings', identityId] })
      const previous = queryClient.getQueryData<IdentitySettings>(['settings', identityId])
      queryClient.setQueryData<IdentitySettings>(['settings', identityId], (old) =>
        old ? { ...old, ...patch } : old,
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['settings', identityId], ctx.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', identityId] })
    },
  })
}
