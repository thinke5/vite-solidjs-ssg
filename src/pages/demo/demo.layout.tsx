import type { JSXElement } from 'solid-js'
import { useNavigatePro } from '@fsr/router'

/**  */
export default function DemoLayout(props: { children: JSXElement }) {
  const navp = useNavigatePro()
  return (
    <>
      <div class="f-c/sa b-0 b-b-1 b-white/68 b-solid [&>div]:(px-4 py-3)">
        <div class=""onClick={() => navp('/')}>返回首页</div>
        <div class=""onClick={() => navp('/demo/')}>Demo</div>
        <div class=""onClick={() => navp('/demo/api')}>请求</div>
      </div>
      {props.children}
    </>
  )
};
