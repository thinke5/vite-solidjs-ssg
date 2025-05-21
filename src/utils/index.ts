/**
 * 休眠一定时间
 * @param ms 休眠时间，单位ms @default 0
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** 直接加载js到html */
export function loadJS(jspath: string, loadCallback?: () => void | Promise<void>) {
  return new Promise<void>((resolve) => {
    const jsEle = document.createElement('script')
    jsEle.src = jspath
    jsEle.crossOrigin = 'anonymous'
    jsEle.onload = () => {
      loadCallback?.()
      resolve()
    }

    document.querySelector('head')?.appendChild(jsEle)
  })
}
