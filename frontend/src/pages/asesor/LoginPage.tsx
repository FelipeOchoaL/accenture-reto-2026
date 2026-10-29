import { useMutation } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "react-router"

import { loginAsesor } from "@/App/actions/auth/auth.actions"
import { getErrorMessage } from "@/App/types/api.types"
import { BackIcon, InfoIcon, ShieldIcon } from "@/App/utils/icons"
import { Logo } from "@/components/custom/Logo"
import { env } from "@/lib/env"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { LoginShowcase } from "@/modules/auth/components/LoginShowcase"
import { PATHS } from "@/routes/paths"
import { MOCK_ASESOR_CREDENTIALS } from "@/service/mocks/auth.mock"

// Inicio de sesión del asesor. El cliente no necesita cuenta.
const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? PATHS.asesor.dashboard

  const login = useMutation({
    mutationFn: loginAsesor,
    onSuccess: () => navigate(from, { replace: true }),
  })

  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-[1.1fr_1fr]">
      <LoginShowcase />

      <main className="relative flex flex-col px-6 py-6 md:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 -z-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative flex items-center justify-between">
          <Link
            to={PATHS.inicio}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <BackIcon className="size-4" aria-hidden />
            Volver a selección de rol
          </Link>
          <span className="lg:hidden">
            <Logo size="sm" />
          </span>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="rounded-xl border border-primary-container/35 bg-surface-container-lowest shadow-focus">
              <div className="h-[3px] rounded-t-xl bg-primary-container" aria-hidden />
              <div className="p-6 md:p-8">
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-sm bg-primary-fixed px-2 py-1 text-label-telemetry font-semibold text-on-primary-fixed uppercase">
                  <ShieldIcon className="size-3.5" aria-hidden />
                  Acceso restringido • Asesores
                </span>
                <h1 className="text-headline-lg text-on-surface">Inicia sesión</h1>
                <p className="mt-1 mb-6 text-body-md text-secondary">
                  Ingresa con tus credenciales para gestionar la fila de tu módulo.
                </p>

                <LoginForm
                  onSubmit={(values) => login.mutate(values)}
                  submitting={login.isPending}
                  serverError={login.isError ? getErrorMessage(login.error) : null}
                />
              </div>
            </div>

            {env.useMocks ? (
              <aside className="mt-4 flex gap-3 rounded-lg bg-surface-container-low p-4">
                <InfoIcon className="mt-0.5 size-[18px] shrink-0 text-primary" aria-hidden />
                <div className="text-body-sm text-on-surface-variant">
                  <p className="mb-1 font-semibold text-on-surface">Credenciales de demostración</p>
                  <p>
                    Correo:{" "}
                    <code className="text-data-mono text-primary">{MOCK_ASESOR_CREDENTIALS.email}</code>
                  </p>
                  <p>
                    Contraseña:{" "}
                    <code className="text-data-mono text-primary">{MOCK_ASESOR_CREDENTIALS.password}</code>
                  </p>
                </div>
              </aside>
            ) : null}

            <p className="mt-6 text-center text-body-sm text-on-surface-variant">
              ¿Eres cliente?{" "}
              <Link to={PATHS.cliente.pedirTurno} className="font-semibold text-primary hover:underline">
                Pide tu turno sin registrarte
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
