export type CreateUsernameData = {
  createUsername: {
    success: boolean
    error: string
  }
}

export type CreateusernameVariables = {
  username: string
}

export type SearchUsersInput = {
  username: string
}

export type SearchUsersData = {
  searchUsers: Array<SearchedUser>
}

export type SearchedUser = {
  id: string
  username: string
  image: string
}