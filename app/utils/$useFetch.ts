import type { FetchResult, UseFetchOptions } from 'nuxt/app'
import type { NitroFetchRequest, AvailableRouterMethod } from 'nitropack'
import type { FetchError } from 'ofetch'
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'

export const $useFetch = <
  ResT = void,
  ErrorT = FetchError,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT> = ResT extends void
    ? 'get' extends AvailableRouterMethod<ReqT>
      ? 'get'
      : AvailableRouterMethod<ReqT>
    : AvailableRouterMethod<ReqT>,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
  DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = DataT
>(
  req: Ref<ReqT> | ReqT | (() => ReqT),
  opts: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method> = {}
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | undefined> => {
  const oldOnRequest = opts.onRequest
  const oldOnResponse = opts.onResponse

  opts.onRequest = (ctx) => {
    console.log('onRequest', ctx.options.headers.set('test', 't1'))

    if (oldOnRequest instanceof Function) {
      oldOnRequest(ctx)
    }
  }
  opts.onResponse = (ctx) => {
    if (oldOnResponse instanceof Function) {
      oldOnResponse(ctx)
    }

    const respData = ctx.response._data as any

    if (respData.code !== 200 && respData.message) {
      console.error('error', respData.message)
    }

    ctx.response._data = (ctx.response._data as any).data
  }

  return useFetch(req, opts)
}
