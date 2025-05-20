import fsRouteList from '@fsr/client'
import { hydrate, render } from 'solid-js/web'
import App from './App';

(async () => {
  const routers = await fsRouteList()

  try {
    hydrate(() => <App routers={routers} />, document.getElementById('root')!)
  }
  catch (error) {
    console.error(error)
    console.log('Hydration failed, falling back to client-side rendering.')
    render(() => <App routers={routers} />, document.getElementById('root')!)
  }
})()
