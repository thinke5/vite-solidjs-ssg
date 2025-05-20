import type { Connect, ViteDevServer } from 'vite'
import { getAllPaths } from '@fsr/server'
import { generateHydrationScript } from 'solid-js/web'
import { RouteBasePah } from './config'
import { render } from './index.server'

const handler: Connect.NextHandleFunction = async (req, res) => {
  const path = req.url || '/'
  const ssrHtml = await render((RouteBasePah !== '/' ? RouteBasePah : '') + path)
  let html = await importHtml()
  html = html.replace('<!--app-content-->', () => ssrHtml)
    .replace('<!--app-head-->', () => generateHydrationScript())
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
