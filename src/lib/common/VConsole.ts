import { isDEV, isRDM } from '~/config'
import { loadJS } from '~/utils'

/** 加载VConsole */
export async function VConsole() {
  if (isRDM && !isDEV) {
    await loadJS('https://dldir1.qq.com/INO/vconsole_3_15_1.min.js', () => {
      const _vConsole = new (window as any).VConsole()
    })
  }
}
