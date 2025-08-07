import { cloneDeep } from 'lodash'
import { routeTree } from '../routeTree.gen'

/** 获取所有页面的路径 */
export function getAllPath(): string[] {
  const allPath = getAllPathInner(routeTree)

  return allPath
}

function getAllPathInner(route: any) {
  if (route.children) {
    return route.children.map(getAllPathInner).flat()
  }
  // console.log(cloneDeep(route))
  let path = route.options.path
  // 如果有 search 参数，拼接上
  if (route.options.validateSearch) {
    const searchParamsObject = route.options.validateSearch.parse({})
    // console.log({ searchParamsObject })
    const searchParams = new URLSearchParams(searchParamsObject)
    path += `?${searchParams.toString()}`
  }

  return path
}
