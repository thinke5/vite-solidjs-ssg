import { isServer } from 'solid-js/web'
import { isDEV, isRDM } from '~/config'

/** 处理错误信息 */
export default function ErrorComponent(props: { error: Error }) {
  const showError = isDEV || isRDM
  if (props.error.message.startsWith('Hydration Mismatch.')) { // 水合失败，抛出错误，直接在客户端重新进行渲染
    throw props.error
  }
  showError && console.error(props.error)
  if (isServer) {
    throw props.error
  }

  return (
    <div class="min-h-68 w-full f-c/c flex-col text-red">
      <span class="text-2xl">页面崩溃</span>
      <button class="mt-4 rd b-none bg-cyan px-3 py-1" onClick={() => window.location.reload()}>重新加载</button>
      {showError
        ? (
            <div class="mx-3 mt-2 rd bg-cyan/10 p-3">
              <span class="my-2 text-xs text-cyan">错误信息，仅会在测试环境展示</span>
              <div class="">{props.error.message}</div>
            </div>
          )
        : null}
    </div>
  )
};
