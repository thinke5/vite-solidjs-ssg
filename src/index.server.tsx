import fsRouteList from '@fsr/server'
import { HydrationScript, renderToString } from 'solid-js/web'
import App from './App'

export async function render(url: string) {
  const routers = await fsRouteList()

  const html = renderToString(() => <App url={url} routers={routers} />)

  if (html.includes('data-server-notrander')) {
    return ''
  }
  return html
}

export function renderHydrationScript() {
  return renderToString(HydrationScript)
}
