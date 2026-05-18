import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

export function useLoginMutation() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      const { user_info, authentication_info } = data
      setAuth(user_info, authentication_info.access_token, authentication_info.refresh_token)
      navigate('/users', { replace: true })
    },
  })
}
