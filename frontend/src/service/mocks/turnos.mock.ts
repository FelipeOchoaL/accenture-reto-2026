import { ApiError } from "@/App/types/api.types"
import type {
  ActualizarTurnoDto,
  SolicitarTurnoDto,
  TurnoDto,
} from "@/App/types/queue.types"
import { useAuthStore } from "@/stores/auth.store"
import { isoToTimeOfDay } from "../mappers/turno.mapper"
import { readDb, writeDb } from "./mock-db"
import { mockResponse } from "./mock-response"

const nowTime = () => isoToTimeOfDay(new Date().toISOString())

function findTurno(turnos: TurnoDto[], numero: number): TurnoDto {
  const turno = turnos.find((item) => item.numero === numero)
  if (!turno) {
    throw new ApiError("No encontramos el turno solicitado.", 404)
  }
  return turno
}

// Simula el comportamiento esperado del backend sobre la colección de turnos del día.
export const turnosMock = {
  // GET /turnos/hoy
  listarHoy: () => mockResponse(() => readDb().turnos),

  // POST /turnos
  solicitar: (payload: SolicitarTurnoDto) =>
    mockResponse(() => {
      const db = readDb()
      const numero = Math.max(0, ...db.turnos.map((turno) => turno.numero)) + 1
      const turno: TurnoDto = {
        numero,
        hora_solicitud: nowTime(),
        hora_atencion: null,
        estado: "pendiente",
        nombre: payload.nombre,
        motivo: payload.motivo,
      }
      db.turnos.push(turno)
      writeDb(db)
      return turno
    }),

  // PATCH /turnos/:numero
  actualizar: (numero: number, cambios: ActualizarTurnoDto) =>
    mockResponse(() => {
      const db = readDb()
      const turno = findTurno(db.turnos, numero)

      if (cambios.estado === "en_atencion") {
        if (turno.estado !== "pendiente") {
          throw new ApiError("Solo se puede llamar un turno pendiente.", 409)
        }
        // El backend tomaría el asesor y su módulo del token de la sesión.
        const asesor = useAuthStore.getState().session?.user
        turno.hora_atencion = nowTime()
        turno.asesor = asesor?.name ?? null
        turno.modulo = asesor?.module.code ?? null
      }

      if (cambios.estado === "cancelado" && turno.estado !== "pendiente") {
        throw new ApiError("Solo puedes cancelar un turno que está en espera.", 409)
      }

      if (cambios.prorroga && turno.prorroga) {
        throw new ApiError("Ya solicitaste tiempo adicional para este turno.", 409)
      }

      Object.assign(turno, cambios)
      writeDb(db)
      return turno
    }),
}
