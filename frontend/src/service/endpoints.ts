// Rutas del Api Gateway. GET /turnos/hoy devuelve el formato acordado (TurnoDto[]);
// las demás son la propuesta del frontend y deben confirmarse con el equipo de backend.
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
  },
  turnos: {
    hoy: "/turnos/hoy",
    solicitar: "/turnos",
    actualizar: (numero: number) => `/turnos/${numero}`,
  },
} as const
