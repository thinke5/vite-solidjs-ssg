import type { EChartsType, ECOption } from '~/lib/echarts'
import { createEffect, createMemo, createSignal, mergeProps, onCleanup, onMount, Show } from 'solid-js'

/**
 * 图表
 * @docs https://echarts.apache.org/zh/option.html
 */
export default function Echart(_props: {
  option: ECOption | ((ecahrts: any) => ECOption)
  hasData?: boolean | number
  renderToSVGString?: boolean
}) {
  const props = mergeProps({ hasData: true, renderToSVGString: false }, _props)
  let $div: HTMLDivElement
  const [myChart, setMyChart] = createSignal<EChartsType | null>(null)
  let echarts: any
  const [loading, setLoading] = createSignal(true)
  const option = createMemo(() => {
    if (loading() || !props.hasData) {
      return
    }
    if (typeof props.option === 'function') {
      return props.option(echarts)
    }
    return props.option
  })
  const [svgStr, setSvgStr] = createSignal('')
  const notOption = () => !loading() && (!props.hasData || !option())

  onMount(async () => {
    echarts = await import('~/lib/echarts')
    if (props.renderToSVGString) {
      const { width, height } = $div!.getBoundingClientRect()
      setMyChart(echarts.init(null, null, { renderer: 'svg', ssr: true, width, height }) as any)
    }
    else {
      setMyChart(echarts.init($div!, null, { renderer: 'svg' }) as any)
    }

    setLoading(false)
  })
  createEffect(() => {
    const mycahrt = myChart()
    if (mycahrt) {
      mycahrt.clear()
      const theOption = option()
      // console.log(1)
      if (theOption) {
        mycahrt.setOption(theOption)
        if (props.renderToSVGString) {
          setSvgStr(mycahrt.renderToSVGString())
        }
      }
    }
    else {
      if (props.renderToSVGString)
        setSvgStr('')
    }
  })
  onCleanup(() => {
    myChart()?.dispose()

    setMyChart(null)
  })
  return (
    <div
      ref={$div!}
      class="e s-full"
      classList={{
        'before:(content-empty animate-spin i-mdi-loading) text-blue-5 text-2xl f-c/c': loading(),
        'before:(content-["无数据"]) text-gray text-xs f-c/c bg-gray/5 rd-2': notOption(),
      }}
    >
      <Show when={svgStr()}>
        <img class="s-full" data-l={svgStr().length} src={`data:image/svg+xml;utf8,${encodeURIComponent(svgStr())}`} draggable="false" />
      </Show>
    </div>
  )
};
