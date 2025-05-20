/**
 * 修改自 https://github.com/JulianSoto/solid-keep-alive
 */

import type { Accessor, JSX, Owner, ParentProps } from 'solid-js'
import { createContext, createEffect, createMemo, createRoot, createSignal, getOwner, onCleanup, onMount, runWithOwner, useContext } from 'solid-js'
import { isServer } from 'solid-js/web'

export interface KeepAliveElement {
  id: string
  owner: Owner | null
  children: JSX.Element
  dispose: () => void
}

export type Store = [
  Accessor<KeepAliveElement[]>,
  {
    insertElement: (element: KeepAliveElement) => KeepAliveElement | undefined
    prioritizeElement: (id: string) => void
    removeElement: (id: string) => void
  },
]

const KeepAliveContext = createContext<Store>([
  () => [],
  {
    insertElement: () => undefined,
    prioritizeElement: () => undefined,
    removeElement: () => undefined,
  },
])

export function KeepAliveProvider(props: ParentProps<{ maxElements?: number }>) {
  const [keepAliveElements, setKeepAliveElements] = createSignal<KeepAliveElement[]>([])

  let priorityIndex: string[] = []

  createEffect<KeepAliveElement[]>((prev) => {
    const elements = keepAliveElements()
    const addedElement = elements.filter(el => !prev.includes(el))[0]
    const removedElement = prev.filter(el => !elements.includes(el))[0]

    if (addedElement)
      priorityIndex.push(addedElement.id)
    if (removedElement)
      priorityIndex = priorityIndex.filter(el => el !== removedElement.id)

    return elements
  }, keepAliveElements())

  const prioritizeElement = (id: string) => {
    const newPriorityIndex = priorityIndex.filter(elId => elId !== id)
    if (newPriorityIndex.length === priorityIndex.length - 1) {
      priorityIndex = [...newPriorityIndex, id]
    }
  }

  const removeElement = (id: string) => {
    const element = keepAliveElements().find(el => el.id === id)
    if (element) {
      element.dispose()
      setKeepAliveElements(prev => prev.filter(el => el.id !== element.id))
    }
  }
  const insertElement = (element: KeepAliveElement) => {
    setKeepAliveElements(prev => [...prev, element])
    if (keepAliveElements()?.length > (props.maxElements || 9)) {
      removeElement(keepAliveElements()[0].id)
    }

    return element
  }
  const store: Store = [
    keepAliveElements,
    { insertElement, prioritizeElement, removeElement },
  ]

  return (
    <KeepAliveContext.Provider value={store}>
      {props.children}
    </KeepAliveContext.Provider>
  )
}

export function useKeepAlive() {
  return useContext(KeepAliveContext)
}

interface KeepAliveProps {
  id: string
  onDispose?: () => void
}

const ReMountStore: { [id: string]: { num: number, fns: IReMountFn[] } } = {}
const KeepAliveElementContext = createContext({ id: '-' })

export function KeepAlive_(props: ParentProps<KeepAliveProps>) {
  if (isServer) {
    return props.children
  }
  const [keepAliveElements, { insertElement, prioritizeElement }] = useKeepAlive()

  const currentElement = createMemo(() => keepAliveElements().find(el => el.id === props.id))

  if (!currentElement()) {
    createRoot((dispose) => {
      insertElement({ id: props.id, owner: getOwner(), children: props.children, dispose })
      onCleanup(() => {
        ReMountStore[props.id] = null as any // 删除引用
        props.onDispose?.()
      })
    })
  }
  onMount(() => {
    const id = props.id
    if (ReMountStore[id]) {
      ReMountStore[id].num += 1
    }
    else {
      ReMountStore[id] = { num: 0, fns: [] }
    }
    // 再次挂载时，执行
    if (ReMountStore[id].num > 1) {
      ReMountStore[id].fns.forEach(fn => fn())
    }
  })

  return (() => {
    const element = currentElement()
    if (element) {
      prioritizeElement(element.id)
    }
    if (element?.owner) {
      return runWithOwner(element.owner, () => element?.children)
    }
    return null
  }) as any
}

export function KeepAlive(props: ParentProps<KeepAliveProps>) {
  return (
    <KeepAliveElementContext.Provider value={{ id: props.id }}>
      <KeepAlive_ {...props} />
    </KeepAliveElementContext.Provider>
  )
}
/** KeepAlive 的页面 在非首次加载时会执行传入的函数 */
export function onReMount(fn: IReMountFn) {
  const kaec = useContext(KeepAliveElementContext)
  if (ReMountStore[kaec.id]) {
    ReMountStore[kaec.id].fns.push(fn)
  }
  else {
    ReMountStore[kaec.id] = { num: 0, fns: [fn] }
  }
}

type IReMountFn = () => void | Promise<void>
