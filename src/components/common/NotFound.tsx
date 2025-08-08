import { Link } from '@tanstack/solid-router'

/** 404显示 */
export default function NotFound() {
  return (
    <div class="min-h-100vh f-c/c flex-col text-center">
      <h1 class="m-0 text-16">404</h1>
      <Link class="text-sm text-blue" to="/">HOME</Link>
    </div>
  )
};
