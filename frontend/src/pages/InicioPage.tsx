import { formatTicketCode } from "@/App/utils/format"
import { OFFICE } from "@/App/utils/brand"
import {
  BadgeIcon,
  DesktopIcon,
  DevicesIcon,
  ForwardIcon,
  PhoneIcon,
  QrIcon,
  SupportIcon,
} from "@/App/utils/icons"
import { LiveBadge } from "@/components/custom/LiveBadge"
import { OfficeStatusPanel } from "@/modules/home/components/OfficeStatusPanel"
import { PriorityBanner } from "@/modules/home/components/PriorityBanner"
import { RoleCard } from "@/modules/home/components/RoleCard"
import { useQueueSnapshot } from "@/modules/shared/hooks/useQueueSnapshot"
import { PATHS } from "@/routes/paths"

// Pantalla 0: selección de rol (cliente o asesor).
const InicioPage = () => {
  const { data: snapshot, dataUpdatedAt } = useQueueSnapshot()
  const waiting = snapshot?.stats.waitingCount ?? 0
  const lastNumber = snapshot
    ? Math.max(0, ...[...snapshot.waiting, ...snapshot.history].map((ticket) => ticket.number))
    : null
  const nextNumber = lastNumber === null ? null : lastNumber + 1
  const moduleCode = OFFICE.moduleCode

  return (
    <div className="relative flex flex-col items-center overflow-hidden px-4 py-10 md:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mb-10 flex w-full max-w-3xl flex-col items-center text-center">
        <LiveBadge tone="strong" pulse className="mb-4 px-4 py-1.5">
          Centro de servicios • Terminal inteligente
        </LiveBadge>
        <h1 className="mb-2 text-headline-lg font-bold tracking-tight text-on-surface md:text-[2.75rem] md:leading-[3rem]">
          Fila virtual de turnos
        </h1>
        <p className="max-w-xl text-body-lg text-secondary">
          Bienvenido a la oficina de atención presencial. Selecciona cómo deseas
          ingresar al sistema.
        </p>
      </div>

      <div className="mb-10 grid w-full max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        <RoleCard
          icon={PhoneIcon}
          tag={
            <span className="flex items-center gap-1.5 rounded-md bg-surface-container-low px-2 py-1 text-secondary">
              <DevicesIcon className="size-4" aria-hidden />
              <span className="text-label-telemetry tracking-wider uppercase">
                Autoservicio móvil
              </span>
            </span>
          }
          title="Soy cliente"
          description="Pide un turno desde tu teléfono, revisa el estado en tiempo real y recibe alerta cuando te toque atención."
          preview={
            <>
              <span className="flex flex-col">
                <span className="text-label-telemetry text-secondary uppercase">
                  Turno estimado
                </span>
                <span className="font-heading text-headline-md font-bold text-on-surface tabular-nums">
                  {nextNumber ? formatTicketCode(nextNumber) : "—"}
                </span>
              </span>
              <span className="flex items-center gap-1 text-data-mono text-secondary">
                <QrIcon className="size-[18px] text-primary" aria-hidden />
                Sin registro
              </span>
            </>
          }
          actionLabel="Ingresar como Cliente"
          actionIcon={ForwardIcon}
          to={PATHS.cliente.pedirTurno}
        />

        <RoleCard
          emphasis
          icon={DesktopIcon}
          tag={
            <span className="flex items-center gap-1.5 rounded-md bg-surface-container-low px-2 py-1">
              <span className="size-2 rounded-full bg-primary" aria-hidden />
              <span className="text-label-telemetry font-bold tracking-wider text-primary uppercase">
                Módulo {moduleCode} activo
              </span>
            </span>
          }
          title="Soy asesor"
          description="Gestiona la fila activa, llama al siguiente turno, registra turnos atendidos o ausentes en tu módulo."
          preview={
            <>
              <span className="flex flex-col">
                <span className="text-label-telemetry text-secondary uppercase">
                  Cola asignada
                </span>
                <span className="text-data-mono font-semibold text-primary">
                  {waiting} {waiting === 1 ? "usuario" : "usuarios"} en espera
                </span>
              </span>
              <span className="flex items-center gap-1 rounded-sm bg-surface-container-high px-2 py-1 text-label-telemetry text-on-surface">
                <SupportIcon className="size-4" aria-hidden />
                Requiere login
              </span>
            </>
          }
          actionLabel={`Ingresar como Asesor (Módulo ${moduleCode})`}
          actionIcon={BadgeIcon}
          to={PATHS.asesor.dashboard}
        />
      </div>

      <div className="w-full max-w-5xl">
        <OfficeStatusPanel snapshot={snapshot} updatedAt={dataUpdatedAt} />
      </div>

      <div className="mt-10 w-full max-w-5xl">
        <PriorityBanner />
      </div>
    </div>
  )
}

export default InicioPage
