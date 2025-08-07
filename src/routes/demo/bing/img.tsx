import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/demo/bing/img')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/demo/bing/img"!</div>
}
