import axios from "axios"

import { ApiError } from "@/App/types/api.types"
import { env } from "@/lib/env"
import { useAuthStore } from "@/stores/auth.store"

const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  timeout: 10_000,
})

// Adjunta el token del asesor cuando hay sesión. Las rutas del cliente no lo requieren.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().session?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Normaliza los errores a ApiError y cierra la sesión si el token expiró.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(new ApiError("Ocurrió un error inesperado."))
    }

    const status = error.response?.status ?? 0
    if (status === 401) {
      useAuthStore.getState().logout()
    }

    const data = error.response?.data as { message?: string } | undefined
    const message =
      data?.message ??
      (status === 0
        ? "No hay conexión con el servidor. Revisa tu red."
        : "El servidor no pudo procesar la solicitud.")

    return Promise.reject(new ApiError(message, status))
  }
)

export default apiClient
