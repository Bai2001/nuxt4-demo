import { defineEventHandler, H3Event, EventHandler } from 'h3'

// 定义统一的响应数据结构
interface ApiResponse<T = any> {
  code: number
  data: T
  trace_id: string
  message: string | Object
}

// 封装原始的处理器逻辑
type CustomHandler = (event: H3Event) => Promise<any> | any

export const defineCustomHandler = (handler: CustomHandler): EventHandler => {
  return defineEventHandler(async (event) => {
    event.context.trace_id = crypto.randomUUID()

    const response: ApiResponse = {
      code: 200,
      data: null,
      trace_id: event.context.trace_id,
      message: '',
    }

    const startTime = Date.now()

    try {
      // 1. 执行原始的 API 逻辑
      const result = await handler(event)

      if (result instanceof Object) {
        response.data = result ?? null
      } else {
        response.message = result
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        response.code = error.statusCode as number

        if ('statusMessage' in error) {
          response.message = error.statusMessage as string
        }
      }

      // zod 校验错误
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        'message' in error &&
        error.name === 'ZodError'
      ) {
        response.message = JSON.parse(error.message as string)
      }

      // prisma 错误处理
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        'message' in error &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        response.message = error.message as string
      }

      // 4. 处理其他未捕获的错误 (默认 500)
      console.error('Uncaught server error:', error)
      if (response.code === 200) {
        response.code = 500
      }
      setResponseStatus(event, 500)
    }

    console.log(
      `${new Date().toLocaleString()} [${event.node.req.method?.toUpperCase()}] ${
        event.node.req.url
      } ${event.node.req.headers['user-agent']} ${response.code} ${Date.now() - startTime}ms`
    )

    return response
  })
}
