import { useSearchParams } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'
import { Show, Suspense } from 'solid-js'
import { bingBgByGet } from '~/request/test'

/** 页面参数 */
export type PageSearchParams = {
  idx: string
}

/** 请求示例 */
export default function Api() {
  const [sp] = useSearchParams<PageSearchParams>()

  const query = createQuery(() => ({
    queryKey: ['bingBgByGet', sp.idx],
    queryFn: () => bingBgByGet(Number(sp.idx) || 0),
  }))

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
};
