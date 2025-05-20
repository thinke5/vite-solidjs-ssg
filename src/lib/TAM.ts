// import { getAuthParamWithCache } from '@tencent/tmga-h5-sdk'
import { isServer } from 'solid-js/web'

// 监控上报
let aegis: any = (globalThis as any).$$tam_aegis

/** 等待`aegis`加载完成 */
function waitAegis() {
  if (isServer) {
    return false
  }
  if (aegis) {
    return true
  }
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      aegis = (window as any).$$tam_aegis
      if (aegis) {
        resolve(true)
      }
    }, 64)
    setTimeout(() => {
      resolve(false)
      clearInterval(timer)
      // console.error('TAM aegis加载超时')
    }, 2000)
  })
}

/** https://cloud.tencent.com/document/product/248/87197 */
export async function setConfig(config: Record<string, any>) {
  if (await waitAegis()) {
    aegis.setConfig(config)
  }
}

/** 设置uin，即openid */
export async function setUin(uin: string) {
  if (await waitAegis()) {
    aegis.setConfig({ uin })
  }
}

/** 上报自定义事件 https://cloud.tencent.com/document/product/248/87190#reportevent */
export async function reportEvent(name: string, ext1?: string | Record<string, any>, ext2?: string | Record<string, any>, ext3?: string | Record<string, any>) {
  if (await waitAegis()) {
    aegis.reportEvent({ name, ext1, ext2, ext3 })
  }
}
/** 初始化 */
export async function init() {
  // aegis = new window.Aegis({
  //   id: 'pGUVFTCZyewhxxxxxx',
  //   reportApiSpeed: true,
  //   reportAssetSpeed: true,
  //   hostUrl: 'https://rumt-zh.com',
  //   spa: true,
  // })

  // const { bodyParam } = await getAuthParamWithCache()
  // await setUin(bodyParam.openid)

  aegis?.ready()
}

export async function errorLog(err: any) {
  if (await waitAegis()) {
    aegis.error(err)
  }
}
