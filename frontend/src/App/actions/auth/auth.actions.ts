import type { AuthSession, LoginCredentials } from "@/App/types/auth.types"
import { queryClient } from "@/lib/query-client"
import { authService } from "@/service/auth.service"
import { useAuthStore } from "@/stores/auth.store"

// Casos de uso de autenticación del asesor: combinan el servicio con el estado global.
export async function loginAsesor(
  credentials: LoginCredentials
): Promise<AuthSession> {
  const session = await authService.login(credentials)
  useAuthStore.getState().setSession(session)
  return session
}

export function logoutAsesor(): void {
  useAuthStore.getState().logout()
  queryClient.removeQueries()
}
