/* eslint-disable no-console */
/* eslint-disable ts/ban-ts-comment */
/* eslint-disable node/prefer-global/process */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getAllPaths } from '@fsr/server'
import { generateHydrationScript } from 'solid-js/web'
import { RouteBasePah } from '~/config'
import { render } from './index.server'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const clientDirName = 'client'

/** 渲染并保存到磁盘 */
async function SSG() {
  // 已经渲染过的页面
  const randeredPage = new Map<string, string>()
  const tmplentHTML: string = fs.readFileSync(path.join(dirname, `../${clientDirName}/index.html`)).toString()
  const saveDirPath = path.join(dirname, `../${clientDirName}/`)
  // 清理文件
  // fs.rmSync(saveDirPath, { recursive: true, force: true, })

  for (const pagePath of getAllPaths()) {
    // 跳过动态的页面，比如 `/user/:id` 。。。 搞这个不如直接SSR
    if (pagePath.includes('*') || pagePath.includes(':')) {
      continue
    }
    const fullPath = RouteBasePah + pagePath
    const pageHtml = await render(fullPath)

    const html = tmplentHTML
      .replace('<!--app-content-->', () => pageHtml) // 必须要用函数，否则 `$符`会丢失
      .replace('<!--app-head-->', () => generateHydrationScript())

    // 保存到磁盘
    const fileName = pagePath.endsWith('/') ? `${pagePath}index` : `${pagePath}/index`
    const pageDir = path.join(saveDirPath, `${fileName}.html`)
    fs.mkdirSync(path.dirname(pageDir), { recursive: true })
    fs.writeFileSync(pageDir, html)

    // 记录映射
    randeredPage.set(pagePath, pageDir)
  }
  console.log('SSG done')
  console.table(randeredPage)
  // @ts-ignore
  process.exit(0)
}

// 开始执行
SSG()
