import { defineEventHandler } from 'h3'
import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineCustomHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    event.context.trace_id = crypto.randomUUID()

    let resp: ApiResponse<D> = {
      code: 200,
      data: null as D,
      trace_id: event.context.trace_id,
      message: 'success',
    }
    let err
    setResponseHeader(event, 'trace-id', event.context.trace_id)

    const startTime = Date.now()

    try {
      // 1. 执行原始的 API 逻辑
      const result = await handler(event)

      resp.data = result
    } catch (error) {
      let errorMsg = ''

      if (error && typeof error === 'object' && 'statusCode' in error) {
        if ('statusMessage' in error) {
          errorMsg = error.statusMessage as string
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
        errorMsg = error.message as string
      }

      // prisma 错误处理
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        'message' in error &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        errorMsg = error.message as string
      }

      // 4. 处理其他未捕获的错误 (默认 500)
      logger.error(error)

      resp.message = errorMsg
      resp.code = 500

      err = createError({ statusCode: 500, message: errorMsg })
    }

    logger.info(
      `${new Date().toLocaleString()} [${event.node.req.method?.toUpperCase()}] {${
        event.context.trace_id
      }} ${event.node.req.url} [${event.node.req.headers['user-agent'] || '-'}] ${
        resp.code
      } ${Date.now() - startTime}ms`
    )
    if (err) {
      throw err
    }

    return resp
  })
