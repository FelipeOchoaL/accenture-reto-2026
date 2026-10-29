import type {
  RequestTicketPayload,
  SolicitarTurnoDto,
  Ticket,
  TurnoDto,
} from "@/App/types/queue.types"
import { formatTicketCode } from "@/App/utils/format"

// "08:02:00" (hora del día) -> ISO de hoy. El backend envía solo la hora porque los turnos son del día.
export function timeOfDayToIso(time: string, base = new Date()): string {
  const [hours = 0, minutes = 0, seconds = 0] = time.split(":").map(Number)
  const date = new Date(base)
  date.setHours(hours, minutes, seconds, 0)
  return date.toISOString()
}

// ISO -> "08:02:00"
export function isoToTimeOfDay(iso: string): string {
  const date = new Date(iso)
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, "0"))
    .join(":")
}

export function toTicket(dto: TurnoDto): Ticket {
  return {
    id: String(dto.numero),
    number: dto.numero,
    code: formatTicketCode(dto.numero),
    customerName: dto.nombre?.trim() || null,
    reason: dto.motivo ?? null,
    status: dto.estado,
    requestedAt: timeOfDayToIso(dto.hora_solicitud),
    calledAt: dto.hora_atencion ? timeOfDayToIso(dto.hora_atencion) : null,
    module: dto.modulo ?? null,
    advisorName: dto.asesor ?? null,
    priority: dto.prioridad ?? false,
    note: dto.nota ?? null,
    onTheWay: dto.en_camino ?? false,
    extensionRequested: dto.prorroga ?? false,
  }
}

export function toSolicitarTurnoDto(payload: RequestTicketPayload): SolicitarTurnoDto {
  return { nombre: payload.customerName.trim(), motivo: payload.reason }
}
