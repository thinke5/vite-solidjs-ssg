import { createFileRoute, Link } from '@tanstack/solid-router'
import { createSignal, For } from 'solid-js'
import * as z from 'zod/v4'
import { getAllPath } from '~/utils/getAllPath'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  head: () => ({
    meta: [{
      title: 'Home',
    }],
  }),
})

function RouteComponent() {
  const [num, setNum] = createSignal(0)

  return (
    <div>

      <button onClick={() => setNum(num () + 1)}>num = {num()}</button>
      <button onClick={() => {
        const a = z.object({
          id: z.number().catch(0),
        })
        console.log(a.parse({}))
      }}
      >Zod
      </button>
      <p class="m-0 text-sm">下面是所有页面的path</p>
      <div class="flex flex-col">
        <For each={getAllPath()}>{item => <Link to={item}>{item}</Link>}</For>
      </div>
    </div>
  )
}
