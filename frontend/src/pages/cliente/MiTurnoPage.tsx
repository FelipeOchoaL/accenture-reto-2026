import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import type { TicketTracking } from "@/App/types/queue.types"
import { firstName } from "@/App/utils/format"
import { AlertIcon, InfoIcon } from "@/App/utils/icons"
import { AbandonQueueSection } from "@/modules/cliente/components/AbandonQueueSection"
import { ClienteBottomNav } from "@/modules/cliente/components/ClienteBottomNav"
import { ClienteTopBar } from "@/modules/cliente/components/ClienteHeaders"
import { ClienteTicketGate } from "@/modules/cliente/components/ClienteTicketGate"
import { PeopleAheadCard } from "@/modules/cliente/components/PeopleAheadCard"
import { QueueInfoCards } from "@/modules/cliente/components/QueueInfoCards"
import { TicketHeroCard } from "@/modules/cliente/components/TicketHeroCard"
import { useClienteMutations } from "@/modules/cliente/hooks/useClienteMutations"
import { PATHS } from "@/routes/paths"
import { useClienteStore } from "@/stores/cliente.store"

const ALERT_THRESHOLD = 2

// Progreso visual: arranca en 10% al ingresar y llega a 95% cuando no queda nadie delante.
function computeProgress(initialAhead: number, ahead: number): number {
  if (initialAhead <= 0) {
    return 95
  }
  const advanced = (initialAhead - ahead) / initialAhead
  return Math.min(95, Math.max(10, Math.round(10 + advanced * 85)))
}

function MiTurnoContent({ tracking }: { tracking: TicketTracking }) {
  const navigate = useNavigate()
  const initialAhead = useClienteStore((state) => state.initialAhead)
  const clear = useClienteStore((state) => state.clear)
  const { abandon } = useClienteMutations()
  const { ticket, ahead, current, estimatedMinutes } = tracking
  const alerted = useRef(false)

  // Alerta cuando quedan 2 personas o menos delante (vibración en móviles compatibles).
  useEffect(() => {
    if (ahead.length <= ALERT_THRESHOLD && !alerted.current) {
      alerted.current = true
      navigator.vibrate?.([200, 100, 200])
      toast.info(
        ahead.length === 0
          ? "¡Eres el siguiente! Acércate a la zona de módulos."
          : `¡Prepárate! Quedan ${ahead.length} ${ahead.length === 1 ? "persona" : "personas"} delante de ti.`
      )
    }
  }, [ahead.length])

  const handleAbandon = () => {
    abandon.mutate(ticket, {
      onSuccess: () => {
        toast.success(`Saliste de la fila. El turno ${ticket.code} fue cancelado.`)
        navigate(PATHS.inicio, { replace: true })
        clear()
      },
    })
  }

  return (
    <>
      <ClienteTopBar subtitle="Mi turno" initial={ticket.customerName ?? undefined} />

      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-body-md text-on-surface-variant">
              {ticket.customerName ? `Hola, ${firstName(ticket.customerName)}` : "Hola"}
              <span className="size-2 rounded-full bg-primary" aria-hidden />
            </p>
            <h1 className="text-headline-lg-mobile text-on-surface">Tu turno está confirmado</h1>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-fixed px-3 py-1.5 text-label-telemetry font-semibold text-on-primary-fixed uppercase">
            <AlertIcon className="size-4" aria-hidden />
            Alerta activa
          </span>
        </div>

        <TicketHeroCard ticket={ticket} progress={computeProgress(initialAhead, ahead.length)} />
        <QueueInfoCards current={current} estimatedMinutes={estimatedMinutes} />
        <PeopleAheadCard ahead={ahead} ownCode={ticket.code} />

        <section className="flex gap-3 rounded-xl bg-surface-container-low p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <InfoIcon className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-sans text-body-lg font-semibold text-on-surface">
              ¿Tienes trámites pendientes cerca?
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Puedes alejarte hasta 200 metros. Te avisaremos en esta pantalla cuando queden
              solo {ALERT_THRESHOLD} personas por delante.
            </p>
          </div>
        </section>

        <AbandonQueueSection
          ticketCode={ticket.code}
          onConfirm={handleAbandon}
          loading={abandon.isPending}
        />
      </div>

      <ClienteBottomNav />
    </>
  )
}

// Pantalla cliente 2: seguimiento del turno en espera.
const MiTurnoPage = () => (
  <ClienteTicketGate expects="pendiente">
    {(tracking) => <MiTurnoContent tracking={tracking} />}
  </ClienteTicketGate>
)

export default MiTurnoPage
