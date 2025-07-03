import { MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { ErrorBoundary, Suspense, useTransition } from 'solid-js'
import { isServer } from 'solid-js/web'
// import { KeepAliveProvider } from '~/lib/keepAlive' // TODO 按需启用
import { BUILD_TIME, BUILD_V, isDEV, isRDM, RouteBasePah } from './config'
import SolidQuery from './lib/solid-query'

import { init } from './lib/TAM'
// import '@unocss/reset/tailwind.css' // TODO 按需启用
import 'uno.css'
import './App.less'
// import './App.css' // TODO 按需启用

if (!isServer) {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  globalThis.tmga_build_v = BUILD_V

  //  eslint-disable-next-line no-console
  console.log(`%c ${BUILD_V} bulid in ${BUILD_TIME} `, 'background:#4a0;color:#fff;padding:6px;') // 打印版本

  init()
}
const showError = isDEV || isRDM
/** mian */
export default function App(props: { url?: string, routers: any[] }) {
  const Loading = () => (
    <div class="min-h-68 w-full f-c/c">
      <div class="mr-1 s-3 animate-spin rd bg-cyan"></div>
      loading...
    </div>
  )
  return (
    <ErrorBoundary fallback={(err: Error) => {
      if (err.message.startsWith('Hydration Mismatch.')) { // 水合失败，抛出错误，直接在客户端重新进行渲染
        throw err
      }
      showError && console.error(err)
      if (isServer) {
        throw err
      }

      return (
        <div class="min-h-68 w-full f-c/c flex-col text-red">
          <span class="text-2xl">页面崩溃</span>
          <button class="mt-4 rd b-none bg-cyan px-3 py-1" onClick={() => window.location.reload()}>重新加载</button>
          {showError
            ? (
                <div class="mx-3 mt-2 rd bg-cyan/10 p-3">
                  <span class="my-2 text-xs text-cyan">错误信息，仅会在测试环境展示</span>
                  <div class="">{err.message}</div>
                </div>
              )
            : null}
        </div>
      )
    }}
    >

      <Suspense fallback={(<Loading />)}>

        <SolidQuery>
          {/* <KeepAliveProvider> */}
          <MetaProvider>
            <Title>VITE + Solid + SSG</Title>
            <Router
              base={RouteBasePah}
              url={props.url}
              root={props => (
                <div class="root-content">
                  <Suspense fallback={(<Loading />)}>
                    {props.children}
                  </Suspense>
                </div>
              )}
            >
              {props.routers}
            </Router>
          </MetaProvider>
          {/* </KeepAliveProvider> */}
        </SolidQuery>

      </Suspense>
    </ErrorBoundary>
  )
};
