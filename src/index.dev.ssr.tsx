import type { Connect, ViteDevServer } from 'vite'
import { generateHydrationScript } from 'solid-js/web'
import { RouteBasePah } from './config'
import { render } from './index.server'

const handler: Connect.NextHandleFunction = async (req, res) => {
  const html = await renderFullHTML(req.url || '/')

  res.setHeader('content-type', 'text/html').end(html)
}

export default handler

declare let __globalServer: ViteDevServer

async function importHtml() {
  if (import.meta.env.DEV) {
    const mod = await import('/index.html?raw')
    return __globalServer.transformIndexHtml('/', mod.default)
  }
  else {
    const mod = await import('/dist/client/index.html?raw')
    return mod.default
  }
}

export async function renderFullHTML(path: string) {
  const ssrHtml = await render((RouteBasePah !== '/' ? RouteBasePah : '') + path)
  const html = await importHtml()
  return html.replace('<!--app-content-->', () => ssrHtml) // 必须要用函数，否则 `$符`会丢失
    .replace('<!--app-head-->', () => generateHydrationScript())
}
