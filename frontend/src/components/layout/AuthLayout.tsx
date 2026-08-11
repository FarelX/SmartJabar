import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-mesh relative">
      <div className="relative z-10 min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
