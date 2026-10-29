export const PATHS = {
  inicio: "/",
  cliente: {
    pedirTurno: "/cliente/turno",
    miTurno: "/cliente/mi-turno",
    llamado: "/cliente/llamado",
  },
  asesor: {
    login: "/asesor/login",
    dashboard: "/asesor",
    cola: "/asesor/cola",
    historial: "/asesor/historial",
  },
} as const
