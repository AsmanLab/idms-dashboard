import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export function useAccessSummaryQuery(identityId: string) {
  return useQuery({
    queryKey: ['access-summary', identityId],
    queryFn: () => profileService.getAccessSummary(identityId),
    enabled: Boolean(identityId),
  })
}
