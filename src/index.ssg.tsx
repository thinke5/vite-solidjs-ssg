/* eslint-disable no-console */
/* eslint-disable ts/ban-ts-comment */

// @ts-expect-error
import fs from 'node:fs/promises'
// @ts-expect-error
import path from 'node:path'
// @ts-ignore
import process from 'node:process'
// @ts-expect-error
import { fileURLToPath } from 'node:url'
import { renderFullHTML } from './index.server'
import { getAllPath } from './utils/getAllPath'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const clientDirName = 'client'

const otherPaths = ['/404']

/** 渲染并保存到磁盘 */
async function SSG() {
  // 已经渲染过的页面
  const randeredPage = new Map<string, string>()
  const saveDirPath = path.join(dirname, `../${clientDirName}/`)
  // 清理文件
  // fs.rmSync(saveDirPath, { recursive: true, force: true, })
  const paths = getAllPath().concat(otherPaths)

  for (const pagePath of paths) {
    // 跳过动态的页面，比如 `/user/:id` 。。。 搞这个不如直接SSR
    if (pagePath.includes('*') || pagePath.includes(':')) {
      continue
    }
    console.log(`rendering ${pagePath}`)
    await new Promise(resolve => setTimeout(resolve, 100)) // 等待100ms,否则有可能会报错，原因未知
    const html = await renderFullHTML(pagePath)

    // 保存到磁盘
    const onlyPath = new URL(pagePath, 'http://a.com').pathname
    const fileName = onlyPath.endsWith('/') ? `${onlyPath}index` : `${onlyPath}/index`
    const pageDir = path.join(saveDirPath, `${fileName}.html`)
    await fs.mkdir(path.dirname(pageDir), { recursive: true })
    await fs.writeFile(pageDir, html)

    // 记录映射
    randeredPage.set(pagePath, pageDir)
  }
  console.table(randeredPage)
  console.log('✅ SSG done')

  process.exit(0)
}

// 开始执行
SSG()
