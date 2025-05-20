import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type { GridComponentOption } from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  // DatasetComponent,
  GridComponent,
  // TooltipComponent,
  // TransformComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  // TitleComponent,
  // TooltipComponent,
  GridComponent,
  // DatasetComponent,
  // TransformComponent,
  //
  BarChart,
  LineChart,
  // LabelLayout,
  // UniversalTransition,
  SVGRenderer,
])

export const init = echarts.init
export const graphic = echarts.graphic
export type { EChartsType } from 'echarts'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = ComposeOption<
  BarSeriesOption
  | LineSeriesOption
  | GridComponentOption
>
