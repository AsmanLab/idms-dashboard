import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export function useSettingsQuery(identityId: string) {
  return useQuery({
    queryKey: ['settings', identityId],
    queryFn: () => profileService.getSettings(identityId),
    enabled: Boolean(identityId),
  })
}
