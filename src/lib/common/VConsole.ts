import { isServer } from 'solid-js/web'
import { isDEV, isRDM } from '~/config'
import { loadJS } from '~/utils'

/** 加载VConsole */
export async function VConsole() {
  if (isServer) {
    return
  }
  if (isRDM && !isDEV) {
    await loadJS('https://dldir1.qq.com/INO/vconsole_3_15_1.min.js', () => {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      const _vConsole = new (window as any).VConsole()
    })
  }
}
