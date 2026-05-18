import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export function useCredentialQuery(identityId: string) {
  return useQuery({
    queryKey: ['credential', identityId],
    queryFn: () => profileService.getCredential(identityId),
    enabled: Boolean(identityId),
  })
}
