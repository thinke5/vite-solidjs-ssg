import fsRouteList from '@fsr/server'
import { HydrationScript, renderToString } from 'solid-js/web'
import App from './App'
import { initI18next } from './lib/i18n'

export async function render(url: string) {
  const [routers] = await Promise.all([
    fsRouteList(), //
    initI18next(),
  ])

  const html = renderToString(() => <App url={url} routers={routers} />)

  if (html.includes('data-server-notrander')) {
    return ''
  }
  return html
}

export function renderHydrationScript() {
  return renderToString(HydrationScript)
}
