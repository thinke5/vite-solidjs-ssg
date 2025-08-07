import { RouterClient } from '@tanstack/solid-router/ssr/client'
import { hydrate, render } from 'solid-js/web'
import { APP, AppInitFn, router } from './router'

(async () => {
  await AppInitFn()
  const Client = () => (<APP><RouterClient router={router} /></APP>)

  try {
    hydrate(Client, document.getElementById('root')!)
  }
  catch (e) {
    console.error('hydrate error', e)
    render(Client, document.getElementById('root')!)
  }
})()
