import { useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export function useRevokeMutation(identityId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentialId: string) => profileService.revokeCredential(credentialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credential', identityId] })
    },
  })
}
