import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_layout/activity/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/activity/categories/"!</div>
}
