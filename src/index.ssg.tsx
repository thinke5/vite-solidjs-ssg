/* eslint-disable no-console */
/* eslint-disable ts/ban-ts-comment */
/* eslint-disable node/prefer-global/process */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getAllPaths } from '@fsr/server'
import { renderFullHTML } from './index.dev.ssr'

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

  for (const pagePath of getAllPaths().concat(otherPaths)) {
    // 跳过动态的页面，比如 `/user/:id` 。。。 搞这个不如直接SSR
    if (pagePath.includes('*') || pagePath.includes(':')) {
      continue
    }

    const html = await renderFullHTML(pagePath)

    // 保存到磁盘
    const fileName = pagePath.endsWith('/') ? `${pagePath}index` : `${pagePath}/index`
    const pageDir = path.join(saveDirPath, `${fileName}.html`)
    fs.mkdirSync(path.dirname(pageDir), { recursive: true })
    fs.writeFileSync(pageDir, html)

    // 记录映射
    randeredPage.set(pagePath, pageDir)
  }
  console.table(randeredPage)
  console.log('✅ SSG done')
  // @ts-ignore
  process.exit(0)
}

// 开始执行
SSG()
