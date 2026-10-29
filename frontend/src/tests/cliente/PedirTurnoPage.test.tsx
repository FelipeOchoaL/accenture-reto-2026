import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { PATHS } from "@/routes/paths"
import { useClienteStore } from "@/stores/cliente.store"
import { renderRoute } from "@/tests/utils/renderRoute"

describe("PedirTurnoPage", () => {
  it("exige el nombre del cliente", async () => {
    renderRoute(PATHS.cliente.pedirTurno)
    const user = userEvent.setup()

    await user.click(await screen.findByRole("button", { name: /pedir turno/i }))

    expect(await screen.findByText("Escribe tu nombre para poder llamarte.")).toBeInTheDocument()
  })

  it("asigna un turno y lleva al seguimiento", async () => {
    const { router } = renderRoute(PATHS.cliente.pedirTurno)
    const user = userEvent.setup()

    // Espera a que cargue el estado de la sala (5 personas en espera según turnos_hoy).
    await screen.findByText("5")
    await user.type(screen.getByLabelText("Tu nombre"), "Camila Fernández")
    await user.click(screen.getByRole("button", { name: "Trámites y pagos" }))
    await user.click(screen.getByRole("button", { name: /pedir turno/i }))

    const dialog = await screen.findByRole("dialog", { name: "Turno asignado" })
    expect(within(dialog).getByText("A-011")).toBeInTheDocument()
    expect(within(dialog).getByText("¡Listo, Camila!")).toBeInTheDocument()
    expect(within(dialog).getByText("#6")).toBeInTheDocument()
    expect(useClienteStore.getState().ticketId).toBe("11")

    await user.click(within(dialog).getByRole("button", { name: "Ver mi seguimiento en vivo" }))

    expect(
      await screen.findByRole("heading", { name: "Tu turno está confirmado" })
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(PATHS.cliente.miTurno)
  })
})
