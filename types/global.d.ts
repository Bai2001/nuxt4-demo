interface ApiResponse<T = unknown> {
  code: number
  data: T
  trace_id: string
  message: string | object
}
