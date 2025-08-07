import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/demo/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/demo/"!</div>
}
