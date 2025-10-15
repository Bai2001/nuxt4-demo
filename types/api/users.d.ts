type usersGetResponse = ApiResponse<{
  users: ({
    roles: {
      role_name: string
      role_level: number | null
    }
  } & {
    id: number
    username: string
    role_id: number
    is_active: boolean | null
    created_at: Date | null
  })[]
  total: number
}>
