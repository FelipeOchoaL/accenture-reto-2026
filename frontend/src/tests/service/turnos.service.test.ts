import { describe, expect, it } from "vitest"

import { isoToTimeOfDay, toTicket } from "@/service/mappers/turno.mapper"
import { MOCK_ASESOR } from "@/service/mocks/auth.mock"
import { turnosService } from "@/service/turnos.service"
import { useAuthStore } from "@/stores/auth.store"

describe("toTicket", () => {
  it("convierte el formato del backend al modelo de la UI", () => {
    const ticket = toTicket({
      numero: 2,
      hora_solicitud: "08:06:00",
      hora_atencion: "08:15:00",
      estado: "atendido",
    })

    expect(ticket).toMatchObject({ id: "2", number: 2, code: "A-002", status: "atendido" })
    expect(isoToTimeOfDay(ticket.requestedAt)).toBe("08:06:00")
    expect(isoToTimeOfDay(ticket.calledAt!)).toBe("08:15:00")
  })

  it("deja calledAt en null para turnos pendientes", () => {
    const ticket = toTicket({
      numero: 6,
      hora_solicitud: "08:25:00",
      hora_atencion: null,
      estado: "pendiente",
    })
    expect(ticket.calledAt).toBeNull()
  })
})

describe("turnosService (modo simulado)", () => {
  it("lee los turnos del día del Excel de referencia", async () => {
    const tickets = await turnosService.getTurnosHoy()
    expect(tickets).toHaveLength(10)
  })

  it("asigna el siguiente número al solicitar un turno", async () => {
    const ticket = await turnosService.requestTicket({
      customerName: "Camila Fernández",
      reason: "Trámites y pagos",
    })

    expect(ticket).toMatchObject({
      number: 11,
      code: "A-011",
      status: "pendiente",
      customerName: "Camila Fernández",
    })
  })

  it("al llamar un turno registra hora de atención, asesor y módulo", async () => {
    useAuthStore.getState().setSession({ token: "t", user: MOCK_ASESOR })

    const ticket = await turnosService.updateTicket(6, { estado: "en_atencion" })

    expect(ticket.status).toBe("en_atencion")
    expect(ticket.calledAt).not.toBeNull()
    expect(ticket.advisorName).toBe(MOCK_ASESOR.name)
    expect(ticket.module).toBe(MOCK_ASESOR.module.code)
  })

  it("no permite cancelar un turno ya atendido", async () => {
    await expect(turnosService.updateTicket(1, { estado: "cancelado" })).rejects.toThrow(
      "Solo puedes cancelar un turno que está en espera."
    )
  })
})
