import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export function useProfileQuery(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => profileService.getProfile(username),
    enabled: Boolean(username),
  })
}
