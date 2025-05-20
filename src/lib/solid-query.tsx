import type { JSX } from 'solid-js'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { persistQueryClient } from '@tanstack/solid-query-persist-client'
import { isServer } from 'solid-js/web'
// import { appDevConfig } from './appDevConfig'

// const SolidQueryDevtools = lazy(() => import('@tanstack/solid-query-devtools').then(m => ({ default: m.SolidQueryDevtools })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 3600_000 * 24, // 24 hours
      retry: 0,
    },
  },
})
// // 目前来说 缓存到本地 问题较多
// if (!isServer) {
//   // 服务器上不需要持久缓存
//   const localStoragePersister = createSyncStoragePersister({
//     storage: window.localStorage, // 空间不够可以用 https://github.com/jakearchibald/idb-keyval  https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient#building-a-persister
//   })

//   persistQueryClient({
//     queryClient,
//     persister: localStoragePersister,
//   })
// }

/**
 * doc https://tanstack.com/query/latest/docs/framework/solid/overview
 */
export default function SolidQuery(props: { children: JSX.Element }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Show when={!isServer && appDevConfig?.solidQueryDevtools}>
        <Suspense><SolidQueryDevtools /></Suspense>
      </Show> */}
      {props.children}
    </QueryClientProvider>
  )
};
