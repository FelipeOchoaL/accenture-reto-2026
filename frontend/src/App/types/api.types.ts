// Error normalizado que devuelven los servicios, venga de Axios o de los datos simulados.
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "Ocurrió un error inesperado. Intenta de nuevo."
}
