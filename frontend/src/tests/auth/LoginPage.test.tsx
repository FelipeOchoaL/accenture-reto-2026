import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { PATHS } from "@/routes/paths"
import { MOCK_ASESOR_CREDENTIALS } from "@/service/mocks/auth.mock"
import { useAuthStore } from "@/stores/auth.store"
import { renderRoute } from "@/tests/utils/renderRoute"

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup()
  await user.type(await screen.findByLabelText("Correo corporativo"), email)
  await user.type(screen.getByLabelText("Contraseña"), password)
  await user.click(screen.getByRole("button", { name: /ingresar al centro operativo/i }))
}

describe("LoginPage", () => {
  it("valida los campos antes de enviar", async () => {
    renderRoute(PATHS.asesor.login)
    const user = userEvent.setup()

    await user.click(await screen.findByRole("button", { name: /ingresar al centro operativo/i }))

    expect(await screen.findByText("Ingresa tu correo corporativo.")).toBeInTheDocument()
    expect(screen.getByText("Ingresa tu contraseña.")).toBeInTheDocument()
  })

  it("muestra un error con credenciales incorrectas", async () => {
    renderRoute(PATHS.asesor.login)

    await fillAndSubmit(MOCK_ASESOR_CREDENTIALS.email, "clave-equivocada")

    expect(await screen.findByText("Correo o contraseña incorrectos.")).toBeInTheDocument()
    expect(useAuthStore.getState().session).toBeNull()
  })

  it("inicia sesión y abre el panel del asesor", async () => {
    const { router } = renderRoute(PATHS.asesor.login)

    await fillAndSubmit(MOCK_ASESOR_CREDENTIALS.email, MOCK_ASESOR_CREDENTIALS.password)

    expect(
      await screen.findByRole("heading", { name: "Módulo 03 - Atención al Cliente" })
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(PATHS.asesor.dashboard)
    expect(useAuthStore.getState().session?.user.name).toBe("Carlos Méndez")
  })
})
