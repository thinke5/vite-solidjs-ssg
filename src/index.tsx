import fsRouteList from '@fsr/client'
import { hydrate, render } from 'solid-js/web'
import App from './App'
import { initI18next } from './lib/i18n';

(async () => {
  const [routers] = await Promise.all([
    fsRouteList(), //
    initI18next(), // 多语言的初始化
  ])

  try {
    hydrate(() => <App routers={routers} />, document.getElementById('root')!)
  }
  catch (error) {
    console.error(error)
    console.log('Hydration failed, falling back to client-side rendering.')
    render(() => <App routers={routers} />, document.getElementById('root')!)
  }
})()
