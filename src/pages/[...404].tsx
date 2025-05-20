import type { Component } from 'solid-js'
import { A, useParams } from '@solidjs/router'

export interface Page404Props {}
/**  404 组件 */
export const Page404: Component<Page404Props> = () => {
  const param = useParams()
  return (
    <div class="min-h-100vh s-100% f-c/c flex-col">
      <h1 class="m-0 text-32 leading-tight">404</h1>
      <span class="leading-relaxed">
        路径 `
        <b>{param['404'] ?? '?'}</b>
        ` 未找到
      </span>
      <A href="/">返回首页</A>
    </div>
  )
}
export default Page404
