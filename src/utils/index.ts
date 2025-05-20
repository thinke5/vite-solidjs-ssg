/**
 * 休眠一定时间
 * @param time 休眠时间，单位ms @default 0
 */
export function nextTick(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time))
}

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
