import type { Input, Options } from 'ky'
import { error as toastError } from '@thinke/toast'
import ky, { HTTPError } from 'ky'
import { BASEURL, isDEV, isRDM } from '../config'
import { sleep } from './index'

/** 自定义的错误的错误码 */
const myErrStatus = 499
/** 是否打印请求日志 */
const isShowLogger = isRDM && !isDEV // 测试环境 且 非开发环境

/** 获取鉴权数据 */
async function getAuthParam() {
  await sleep(100) // TODO: 根据实际情况调整
  const headerParam = {}
  let bodyParam = {
    openid: 'OPENID',
    token: 'TOKEN',
  }

  if (import.meta.env.DEV) {
    // 开发时注入测试登录态
    bodyParam = { ...bodyParam }
  }
  return {
    bodyParam,
    headerParam,
  }
}

const myKyInstance = ky.create({
  prefixUrl: BASEURL,
  retry: { limit: 0 },
  // throwHttpErrors: true,
  hooks: {
    // 请求发出前
    beforeRequest: [async (request, options: Options) => {
      const authParam = await getAuthParam()
      // 处理表单提交时，自动添加鉴权参数
      if (options.method === 'POST' && options.body instanceof FormData) {
        const formData = options.body!
        Object.entries(authParam.bodyParam).forEach(([key, value]) => {
          formData.append(key, value)
        })
        return new Request(request, { body: formData })
      }
      // 处理json
      if (options.method === 'POST' && options.json && options.json instanceof Object) {
        const body = { ...authParam.bodyParam, ...options.json }
        if (isShowLogger) {
          // eslint-disable-next-line no-console
          console.log(`[start ${options.method} fetch] =>`, request.url, body)
        }
        return new Request(request, { body: JSON.stringify(body) })
      }
      // 其他情况直接返回原始的request
      return request
    }],
    // 请求返回后
    afterResponse: [async (request, options, response) => {
      // console.log('收到响应', { _request, _options, response })
      if (isShowLogger) {
        try {
          // eslint-disable-next-line no-console
          console.log(`[end ${options.method} fetch] =>`, request.url, await response.clone().json())
        }
        catch (e) { }
      }

      if (response.status === 200 && (await response.clone().arrayBuffer()).byteLength > 0) {
        const resData = await response.clone().json()
        const code = objGetFirstKeyValue(resData, 'code', 'err_code', 'errcode', 'errCode') ?? 0
        const data = objGetFirstKeyValue(resData, 'data', 'content') ?? resData

        if ([0, 200].includes(code)) { // 成功请求，直接返回数据
          return new Response(JSON.stringify(data), { status: 200 })
        }
        else { // 失败请求，包装成MyResponse对象
          const message = objGetFirstKeyValue(resData, 'msg', 'message', 'livecenter')
          const traceId = objGetFirstKeyValue(resData, 'trace_id', 'traceId')
          return new MyResponse(response, { code, message, data, traceId })
        }
      }
      return response
    }],
    // 请求出错后
    beforeError: [
      error => new MyAjaxError(error.response, error.request, error.options),
      (_error) => { // 显示错误提示
        const error = _error as MyAjaxError
        const option = error.options as MyOptions
        if (option.showToast !== false) {
          toastError(
            error.response?.status === 499 ? `${error.code} ${error.message}` : `Error ${error.code}`,
            typeof option.showToast === 'number' ? option.showToast : 2500,
          )
        }

        return error
      },
    ],
  },
})

/** 携带错误信息的请求 */
class MyResponse extends Response {
  constructor(response: Response, cause: MyResponseCause) {
    super(null, { ...response, status: myErrStatus })
    this.cause = cause
  }

  public cause
}

/** 自定义错误 */
class MyAjaxError extends HTTPError {
  constructor(response: Response, request: Request, options: Options) {
    super(response, request, options as any)
    if (response instanceof MyResponse) {
      this.code = response.cause.code || -1
      this.message = response.cause.message || `Unknown Error ${this.code}`
      this.name = 'AjaxServerError'
    }
    else {
      this.code = response.status != null ? response.status : -1
      this.message = response.statusText || `Unknown Error ${this.code}`
      this.name = 'AjaxHttpError'
    }
  }

  public code: string | number = -2
  public message: string = ''
}

/** 取出 对象中第一个 != undefined 的值 */
function objGetFirstKeyValue(obj: { [key: string]: any }, ...keys: string[]) {
  for (const key of keys) {
    if (obj[key] !== undefined)
      return obj[key]
  }
}

interface MyResponseCause {
  /** 错误码 */
  code: string | number
  /** 错误信息 */
  message: string
  /** 数据 */
  data: any
  /** 请求id,用于排查错误 */
  traceId?: string
}

interface MyOptions extends Options {
  /** 是否在请求错误时显示toast,传入数字则为显示的时长 @default true */
  showToast?: boolean | number
}

/**
 * 发起POST请求
 *
 * Object=>`application/json` ; FormData=>`multipart/form-data`; URLSearchParams=>`application/x-www-form-urlencoded`
 */
export function POST<T = any>(path: Input, data: ReqJson | FormData | URLSearchParams = {}, options?: MyOptions) {
  if (data instanceof FormData || data instanceof URLSearchParams)
    return myKyInstance.post<T>(path, { body: data, ...options })

  return myKyInstance.post<T>(path, { json: data, ...options })
}
/** 发起GET请求 */
export function GET<T = any>(path: Input, data: ReqJson | URLSearchParams, options?: MyOptions) {
  return myKyInstance.get<T>(path, { searchParams: new URLSearchParams(data), ...options })
}

interface ReqJson { [key: string | number]: any }
