import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PATHS } from "@/routes/paths"
import { MOCK_ASESOR } from "@/service/mocks/auth.mock"
import { useAuthStore } from "@/stores/auth.store"
import { renderRoute } from "@/tests/utils/renderRoute"

describe("rutas del asesor", () => {
  it("envía al login cuando no hay sesión", async () => {
    const { router } = renderRoute(PATHS.asesor.dashboard)

    expect(await screen.findByRole("heading", { name: "Inicia sesión" })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(PATHS.asesor.login)
  })

  it("muestra el panel cuando el asesor tiene sesión", async () => {
    useAuthStore.getState().setSession({ token: "t", user: MOCK_ASESOR })
    renderRoute(PATHS.asesor.dashboard)

    expect(
      await screen.findByRole("heading", { name: "Módulo 03 - Atención al Cliente" })
    ).toBeInTheDocument()
  })

  it("redirige del login al panel si ya hay sesión", async () => {
    useAuthStore.getState().setSession({ token: "t", user: MOCK_ASESOR })
    const { router } = renderRoute(PATHS.asesor.login)

    await screen.findByRole("heading", { name: "Módulo 03 - Atención al Cliente" })
    expect(router.state.location.pathname).toBe(PATHS.asesor.dashboard)
  })
})

describe("rutas del cliente", () => {
  it("permite pedir turno sin iniciar sesión", async () => {
    renderRoute(PATHS.cliente.pedirTurno)
    expect(await screen.findByRole("heading", { name: "Pide tu turno" })).toBeInTheDocument()
  })

  it("redirige a pedir turno si no hay turno activo", async () => {
    const { router } = renderRoute(PATHS.cliente.miTurno)

    await screen.findByRole("heading", { name: "Pide tu turno" })
    expect(router.state.location.pathname).toBe(PATHS.cliente.pedirTurno)
  })
})
