import 'h3'

declare module 'h3' {
  interface H3EventContext {
    trace_id?: string // 添加 traceId 属性
  }
}
