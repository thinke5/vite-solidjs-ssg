import type { QueryClient } from '@tanstack/solid-query'
import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/solid-router'
import ErrorComponent from '~/components/ErrorComponent'
import NotFound from '~/components/NotFound'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  head: () => ({
    meta: [
      { title: 'Page Title' },
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
  pendingComponent: () => <div class="">loading page</div>,
})

/** 根元素 */
function RootComponent() {
  return ([
    <HeadContent />,
    <Outlet />,
  ])
}
