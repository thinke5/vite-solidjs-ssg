import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { Show, Suspense } from 'solid-js'
import * as z from 'zod/v4'
import { bingBgByGet } from '~/request/test'

export const Route = createFileRoute('/demo/api')({
  component: RouteComponent,
  validateSearch: z.object({
    idx: z.number().catch(0),
  }),
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(bingBgByGet(0))
  },
})

function RouteComponent() {
  const sp = Route.useSearch()
  const query = useQuery(() => bingBgByGet(sp().idx))

  return (
    <div class="f-c/s flex-col gap-2 py-3">
      <button onClick={() => query.refetch()}>refetch</button>
      <Show when={query.isRefetching}>
        <p class="">刷新中</p>
      </Show>

      <Suspense fallback={<p class="text-blue">加载中</p>}>
        <div class="">
          <img class="w-80" src={`https://bing.com${query.data?.images[0]?.url}`} />

          <pre class="h-100 w-80 overflow-auto bg-dark-3 p-2 text-2 text-light leading-none">{JSON.stringify(query.data, null, 1)}</pre>
        </div>
      </Suspense>

    </div>
  )
}
