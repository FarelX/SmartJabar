import { Outlet } from 'react-router-dom'
import { GridBackground } from '@/components/shared/GridBackground'

export function AuthLayout() {
  return (
    <GridBackground>
      <Outlet />
    </GridBackground>
  )
}


