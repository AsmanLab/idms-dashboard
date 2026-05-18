export type User = {
  user_id: number
  username: string
  profile_id: number
  role: string
}

export type LoginCredentials = {
  username: string
  password: string
}

export type LoginResponse = {
  status_code: number
  message: string
  data: {
    user_info: User
    authentication_info: {
      token_type: string
      access_token: string
      refresh_token: string
      access_token_expires_in: number
      refresh_token_expires_in: number
    }
  }
}
