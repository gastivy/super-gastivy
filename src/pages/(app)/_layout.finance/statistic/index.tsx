import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_layout/finance/statistic/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/_layout/finance/statistic/"!</div>
}
