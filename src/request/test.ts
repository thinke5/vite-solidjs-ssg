import { queryOptions } from '@tanstack/solid-query'
import { GET } from '../utils/ajax'

/** bing 每日壁纸 */
export function bingBgByGet(idx = 0) {
  return queryOptions({
    queryKey: ['bingBg', idx],
    queryFn: () => GET('HPImageArchive.aspx', { format: 'js', idx, n: 1, mkt: 'zh-CN' }).json<BingRsq>(),
  })
}

export interface BingRsq {
  images: Image[]
  tooltips: Tooltips
}

export interface Image {
  startdate: string
  fullstartdate: string
  enddate: string
  url: string
  urlbase: string
  copyright: string
  copyrightlink: string
  title: string
  quiz: string
  wp: boolean
  hsh: string
  drk: number
  top: number
  bot: number
  hs: any[]
}

export interface Tooltips {
  loading: string
  previous: string
  next: string
  walle: string
  walls: string
}
