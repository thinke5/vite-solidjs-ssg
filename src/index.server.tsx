import type { ViteDevServer } from 'vite'
import { createRequestHandler, renderRouterToString, RouterServer } from '@tanstack/solid-router/ssr/server'
import { RouteBasePah } from './config'
import { APP, AppInitFn, router } from './router'

export async function render({ request }: { request: Request }) {
  await AppInitFn()
  const handler = createRequestHandler({ request, createRouter: () => router })

  return await handler(({ responseHeaders, router }) =>
    renderRouterToString({ responseHeaders, router, children: () => (
      <APP>
        <RouterServer router={router} />
      </APP>
    ) }),
  )
}

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

/** 渲染完整的html字符串 */
export async function renderFullHTML(path: string) {
  const fullPath = path.startsWith(RouteBasePah) ? path : `${RouteBasePah}${path}`

  // console.log({ fullPath })

  const htmlRes = await render({ request: new Request(`http://a.com${fullPath}`, { method: 'GET' }) })
  const htmlStr = await htmlRes.text()
  const headStr = htmlStr.split('<head>')[1].split('</head>')[0]
  const bodyStr = htmlStr.split('<body>')[1].split('</body>')[0]
  // console.log({ fullPath, bodyStr })
  const html = await importHtml()
  return html.replace('<!--app-content-->', () => bodyStr) // 必须要用函数，否则 `$符`会丢失
    .replace('<!--app-head-->', () => headStr)
}
