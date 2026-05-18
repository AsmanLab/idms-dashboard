export type UserRecord = {
  username: string
  first_name: string
  last_name: string
  role: string
  avatar_url: string | null
}

export type UsersResponse = {
  status_code: number
  message: string
  data: UserRecord[]
}
