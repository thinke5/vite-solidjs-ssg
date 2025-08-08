import type { JSX } from 'solid-js'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { createRouter } from '@tanstack/solid-router'
import { isServer } from 'solid-js/web'
import { BUILD_TIME, BUILD_V, RouteBasePah } from './config'
import { VConsole } from './lib/common/VConsole'
import { routeTree } from './routeTree.gen'

// import '@unocss/reset/tailwind.css' // TODO 按需启用
import 'uno.css'
import './index.less'
// import './index.css' // TODO 按需启用

export const queryClient = new QueryClient({ defaultOptions: {
  queries: {
    // gcTime: 3600_000 * 24, // 24 hours
    retry: 0,
  },
} })

// Set up a Router instance
export const router = createRouter({
  basepath: RouteBasePah,
  routeTree,
  context: {
    queryClient,
  },
  scrollRestoration: true,
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => <div class="">loading page root</div>,

})

// Register things for typesafety
declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router
  }
}

export function APP(props: { children: JSX.Element }) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}

/** app渲染之前需要执行的初始化函数 */
export async function AppInitFn() {
  if (!isServer) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore
    globalThis.tmga_build_v = BUILD_V
    //  eslint-disable-next-line no-console
    console.log(`%c ${BUILD_V} bulid in ${BUILD_TIME} `, 'background:#4a0;color:#fff;padding:6px;') // 打印版本
  }
  await Promise.all([
    // initI18next(),
    VConsole(),
  ])
}
