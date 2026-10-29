import type {
  ActualizarTurnoDto,
  RequestTicketPayload,
  Ticket,
  TurnoDto,
} from "@/App/types/queue.types"
import { env } from "@/lib/env"
import apiClient from "./api-client"
import { ENDPOINTS } from "./endpoints"
import { toSolicitarTurnoDto, toTicket } from "./mappers/turno.mapper"
import { turnosMock } from "./mocks/turnos.mock"

// Servicio de turnos. Con VITE_USE_MOCKS=true responde la fila simulada; si no, consume el Api Gateway con Axios.
// Siempre devuelve el modelo interno (Ticket): el formato del backend (TurnoDto) no sale de esta capa.
export const turnosService = {
  getTurnosHoy: async (): Promise<Ticket[]> => {
    const turnos = env.useMocks
      ? await turnosMock.listarHoy()
      : (await apiClient.get<TurnoDto[]>(ENDPOINTS.turnos.hoy)).data
    return turnos.map(toTicket)
  },

  requestTicket: async (payload: RequestTicketPayload): Promise<Ticket> => {
    const body = toSolicitarTurnoDto(payload)
    const turno = env.useMocks
      ? await turnosMock.solicitar(body)
      : (await apiClient.post<TurnoDto>(ENDPOINTS.turnos.solicitar, body)).data
    return toTicket(turno)
  },

  updateTicket: async (number: number, changes: ActualizarTurnoDto): Promise<Ticket> => {
    const turno = env.useMocks
      ? await turnosMock.actualizar(number, changes)
      : (await apiClient.patch<TurnoDto>(ENDPOINTS.turnos.actualizar(number), changes)).data
    return toTicket(turno)
  },
}
