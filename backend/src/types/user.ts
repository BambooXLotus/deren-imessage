export type User = {
  id: string
  username: string
  image: string
  email: string
  name: string
}

export type CreateUsernameResponse = {
  success?: boolean
  error?: string
}

