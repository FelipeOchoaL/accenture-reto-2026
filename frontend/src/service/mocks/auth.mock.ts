import { ApiError } from "@/App/types/api.types"
import type {
  Asesor,
  AuthSession,
  LoginCredentials,
} from "@/App/types/auth.types"
import { mockResponse } from "./mock-response"

// Credenciales de demostración mientras no exista el servicio de autenticación.
export const MOCK_ASESOR_CREDENTIALS: LoginCredentials = {
  email: "asesor@rowcenture.com",
  password: "Asesor2026*",
}

export const MOCK_ASESOR: Asesor = {
  id: "AS-8821",
  name: "Carlos Méndez",
  email: MOCK_ASESOR_CREDENTIALS.email,
  desk: "Asesor Desk 04",
  shift: "08:00 - 16:30",
  module: {
    code: "03",
    name: "Atención al Cliente",
    window: "Ventanilla 03",
    floor: "Piso 1",
  },
}

export function mockLogin(credentials: LoginCredentials): Promise<AuthSession> {
  return mockResponse(() => {
    const email = credentials.email.trim().toLowerCase()
    if (
      email !== MOCK_ASESOR_CREDENTIALS.email ||
      credentials.password !== MOCK_ASESOR_CREDENTIALS.password
    ) {
      throw new ApiError("Correo o contraseña incorrectos.", 401)
    }

    return { token: `mock-token-${MOCK_ASESOR.id}`, user: MOCK_ASESOR }
  })
}
