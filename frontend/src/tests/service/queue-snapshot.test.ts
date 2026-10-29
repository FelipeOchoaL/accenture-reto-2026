import { describe, expect, it } from "vitest"

import { buildQueueSnapshot, buildTicketTracking } from "@/modules/shared/utils/queue-snapshot"
import { toTicket } from "@/service/mappers/turno.mapper"
import { createSeedDb, TURNOS_HOY_SEED } from "@/service/mocks/mock-db"

// Datos de referencias/turnos_hoy.xlsx tal como los enviará el backend.
const tickets = TURNOS_HOY_SEED.map(toTicket)

describe("buildQueueSnapshot con turnos_hoy", () => {
  const snapshot = buildQueueSnapshot(tickets)

  it("cuenta atendidos y pendientes", () => {
    expect(snapshot.stats.attendedToday).toBe(5)
    expect(snapshot.stats.waitingCount).toBe(5)
    expect(snapshot.current).toBeNull()
  })

  it("ordena la cola por hora de solicitud", () => {
    expect(snapshot.waiting.map((ticket) => ticket.number)).toEqual([6, 7, 8, 9, 10])
  })

  it("calcula la espera promedio entre solicitud y atención", () => {
    // Esperas: 3, 9, 14, 16 y 19 minutos -> 12.2 min
    expect(snapshot.stats.averageWaitSeconds).toBeCloseTo(12.2 * 60)
  })

  it("estima la cadencia de atención a partir de llamados consecutivos", () => {
    // Llamados 08:05, 08:15, 08:24, 08:31, 08:40 -> intervalos 10, 9, 7, 9 -> 8.75 min
    expect(snapshot.stats.serviceIntervalSeconds).toBeCloseTo(8.75 * 60)
  })

  it("lista el historial del más reciente al más antiguo", () => {
    expect(snapshot.history.map((ticket) => ticket.number)).toEqual([5, 4, 3, 2, 1])
  })
})

describe("buildTicketTracking", () => {
  const snapshot = buildQueueSnapshot(tickets)

  it("indica los turnos que están delante y estima la espera", () => {
    const tracking = buildTicketTracking(snapshot, tickets, "9")
    expect(tracking?.ahead.map((ticket) => ticket.code)).toEqual(["A-006", "A-007", "A-008"])
    // 3 turnos delante x 8.75 min ≈ 26 min
    expect(tracking?.estimatedMinutes).toBe(26)
  })

  it("devuelve null si el turno no existe", () => {
    expect(buildTicketTracking(snapshot, tickets, "999")).toBeNull()
  })

  it("prioriza un turno por delante del orden de llegada", () => {
    const prioritized = tickets.map((ticket) =>
      ticket.number === 10 ? { ...ticket, priority: true } : ticket
    )
    expect(buildQueueSnapshot(prioritized).waiting[0].number).toBe(10)
  })
})

describe("createSeedDb", () => {
  it("traslada la jornada del Excel a la hora actual conservando los intervalos", () => {
    const db = createSeedDb(new Date(2026, 9, 29, 16, 0, 0))
    const turnos = db.turnos

    // La última solicitud (08:45 en el Excel) queda 2 minutos antes de "ahora".
    expect(turnos.at(-1)?.hora_solicitud).toBe("15:58:00")
    // 08:02 -> 08:05 en el Excel: se mantiene la espera de 3 minutos.
    expect(turnos[0]).toMatchObject({ hora_solicitud: "15:15:00", hora_atencion: "15:18:00" })
    expect(turnos.filter((turno) => turno.estado === "pendiente")).toHaveLength(5)
  })

  it("conserva las horas originales si no hay margen para trasladarlas", () => {
    const db = createSeedDb(new Date(2026, 9, 29, 0, 10, 0))
    expect(db.turnos[0].hora_solicitud).toBe("08:02:00")
  })
})
