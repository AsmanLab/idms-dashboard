import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export function useAccessEventsQuery(identityId: string) {
  return useQuery({
    queryKey: ['access-events', identityId],
    queryFn: () => profileService.getAccessEvents(identityId),
    enabled: Boolean(identityId),
  })
}
