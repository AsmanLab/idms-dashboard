import { useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export function useUpdateProfileMutation(identityId: string, username: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: { name?: string; department?: string }) =>
      profileService.updateProfile(identityId, patch),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', username], updatedProfile)
    },
  })
}
