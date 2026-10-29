// ---------- Contrato del backend ----------
// Formato acordado con backend (basado en referencias/turnos_hoy.xlsx):
// { "numero": 1, "hora_solicitud": "08:02:00", "hora_atencion": "08:05:00", "estado": "atendido" }
// Los campos marcados como "propuesta" aún deben confirmarse con el equipo de backend.

export type EstadoTurno =
  | "pendiente"
  | "atendido"
  | "cancelado"
  | "en_atencion" // propuesta: turno llamado por un asesor
  | "ausente" // propuesta: el cliente no se presentó
  | "transferido" // propuesta: enviado a otro módulo

export interface TurnoDto {
  numero: number
  hora_solicitud: string
  hora_atencion: string | null
  estado: EstadoTurno
  // Campos opcionales (propuesta) para nombre del cliente y operación del módulo.
  nombre?: string | null
  motivo?: string | null
  modulo?: string | null
  asesor?: string | null
  prioridad?: boolean
  nota?: string | null
  en_camino?: boolean
  prorroga?: boolean
}

export interface SolicitarTurnoDto {
  nombre: string
  motivo: string | null
}

export type ActualizarTurnoDto = Partial<
  Pick<TurnoDto, "estado" | "modulo" | "nota" | "prioridad" | "en_camino" | "prorroga">
>

// ---------- Modelo interno de la UI ----------

export type TicketStatus = EstadoTurno

export interface Ticket {
  id: string
  number: number
  code: string
  customerName: string | null
  reason: string | null
  status: TicketStatus
  requestedAt: string
  calledAt: string | null
  module: string | null
  advisorName: string | null
  priority: boolean
  note: string | null
  onTheWay: boolean
  extensionRequested: boolean
}

export interface QueueStats {
  attendedToday: number
  absentToday: number
  cancelledToday: number
  waitingCount: number
  // Espera promedio (hora_atencion - hora_solicitud) de los turnos ya llamados.
  averageWaitSeconds: number
  // Cadencia entre atenciones consecutivas: base para estimar la espera de quien está en cola.
  serviceIntervalSeconds: number
  absenceRate: number
  efficiency: number
}

export interface QueueSnapshot {
  current: Ticket | null
  waiting: Ticket[]
  history: Ticket[]
  stats: QueueStats
}

export interface TicketTracking {
  ticket: Ticket
  ahead: Ticket[]
  current: Ticket | null
  estimatedMinutes: number
  stats: QueueStats
}

export interface RequestTicketPayload {
  customerName: string
  reason: string | null
}

export const CLOSED_TICKET_STATUSES: TicketStatus[] = [
  "atendido",
  "ausente",
  "transferido",
  "cancelado",
]
