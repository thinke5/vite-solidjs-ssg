import { getAllPaths } from '@fsr/client'
import { A, useNavigatePro } from '@fsr/router'
import { createSignal, For, onMount, Show } from 'solid-js'

/** index页面 */
export default function () {
  const [ok, setOk] = createSignal(false)
  const navp = useNavigatePro()
  onMount(() => {
    setOk(true)
  })

  return (
    <div class="min-h-100vh f-c/s flex-col bg-dark p-24px text-light">
      <h1 class="m-0 text-2xl">VITE + Solid + SSG</h1>
      <Show
        when={ok()}
        fallback={<p class="text-sm text-orange">基础环境准备中...长时间未完成，则环境有问题</p>}
      >
        <p class="text-sm text-green">基础环境准备完毕，可点击下方链接前往查看示例</p>
        <div class="w-full flex flex-col gap-1">
          <For each={getAllPaths()}>{(item: any, i) => <A class="text-blue" href={item}>{item}</A>}</For>
        </div>
      </Show>

    </div>
  )
}
