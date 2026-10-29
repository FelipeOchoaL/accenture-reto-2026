import type { AuthSession, LoginCredentials } from "@/App/types/auth.types"
import { env } from "@/lib/env"
import apiClient from "./api-client"
import { ENDPOINTS } from "./endpoints"
import { mockLogin } from "./mocks/auth.mock"

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    if (env.useMocks) return mockLogin(credentials)
    const { data } = await apiClient.post<AuthSession>(ENDPOINTS.auth.login, credentials)
    return data
  },
}
