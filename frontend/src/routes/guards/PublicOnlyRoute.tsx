import { Navigate, Outlet } from "react-router"

import { PATHS } from "@/routes/paths"
import { useAuthStore } from "@/stores/auth.store"

// El login no tiene sentido con sesión activa: el asesor va directo a su panel.
export function PublicOnlyRoute() {
  const session = useAuthStore((state) => state.session)

  if (session) {
    return <Navigate to={PATHS.asesor.dashboard} replace />
  }

  return <Outlet />
}
