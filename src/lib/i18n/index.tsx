import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { createRoot, createSignal, startTransition } from 'solid-js'

const allLangJson = import.meta.glob('../../locales/**/*.json', { import: 'default' }) // 自动导入，文档： https://cn.vite.dev/guide/features.html#glob-import

// 提取出所有语言的命名空间
const namespaces = Array.from(new Set(Object.keys(allLangJson).map(path => path.split('/')[4].split('.')[0])))

export const i18next = createInstance()
// 默认语言
const fallbackLng = 'zh'

const { lang, setLang } = createRoot(() => {
  const [lang, setLang] = createSignal<string | null>(fallbackLng)
  return { lang, setLang }
})

let isInit = false
/** 初始化i18next */
export async function initI18next(_newLang?: string) {
  const newLang = _newLang || fallbackLng
  if (!isInit) {
    isInit = true
    await i18next
      .use(resourcesToBackend(async (language: string, namespace: string) => {
        const path = `../../locales/${language}/${namespace}.json`
        // console.log('[ resourcesToBackend ]-->', path)
        return (await (allLangJson[path]()))
      }))
      .init({
        // debug: true,
        fallbackLng: newLang,
        ns: namespaces,
        defaultNS: 'base',
        load: 'currentOnly',
      })
  }

  await i18next.changeLanguage(newLang)

  return true
}

/** 切换语言 */
export async function changeLanguage(newLang: string) {
  await i18next.changeLanguage(newLang)
  await startTransition(() => {
    setLang(newLang)
  })
}

let timer: any
/** 获取翻译 */
export const t = ((...args) => {
  if (i18next.language !== lang() && !timer) { // 当语言不一致的时候，重新设置语言
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
      setLang(i18next.language)
    }, 0)
  }

  const result = i18next.t(...args)
  return result
}) as typeof i18next.t

export { lang }
