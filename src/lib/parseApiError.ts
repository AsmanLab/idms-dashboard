import { isAxiosError } from 'axios'

export function parseApiError(error: unknown): string {
  if (!isAxiosError(error)) {
    return 'An unexpected error occurred.'
  }

  if (!error.response) {
    return 'Cannot reach the server. Check your connection.'
  }

  const { status, data } = error.response

  // FastAPI validation error (422)
  if (status === 422 && Array.isArray(data?.detail)) {
    return data.detail.map((d: { msg: string }) => d.msg).join(', ')
  }

  // FastAPI/generic detail string (401, 403, 400…)
  if (typeof data?.detail === 'string') {
    return data.detail
  }

  if (status === 401) return 'Invalid username or password.'
  if (status === 403) return 'You do not have permission to do that.'
  if (status >= 500) return 'Server error. Please try again later.'

  return 'Something went wrong. Please try again.'
}
