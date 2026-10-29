import { Navigate, Outlet, useLocation } from "react-router"

import { PATHS } from "@/routes/paths"
import { useAuthStore } from "@/stores/auth.store"

// Solo deja pasar al asesor con sesión. Recuerda la ruta pedida para volver tras el login.
export function ProtectedRoute() {
  const session = useAuthStore((state) => state.session)
  const location = useLocation()

  if (!session) {
    return <Navigate to={PATHS.asesor.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
