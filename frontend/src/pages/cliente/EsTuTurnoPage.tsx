import { useEffect } from "react"

import type { TicketTracking } from "@/App/types/queue.types"
import { formatMmSs, secondsBetween } from "@/App/utils/format"
import { ExtensionIcon, OnTheWayIcon } from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { useNow } from "@/hooks/useNow"
import { CallHeroCard } from "@/modules/cliente/components/CallHeroCard"
import { CallStatsRow } from "@/modules/cliente/components/CallStatsRow"
import { ClienteTopBar } from "@/modules/cliente/components/ClienteHeaders"
import { ClienteTicketGate } from "@/modules/cliente/components/ClienteTicketGate"
import { RouteGuideCard } from "@/modules/cliente/components/RouteGuideCard"
import { useClienteMutations } from "@/modules/cliente/hooks/useClienteMutations"
import { PATHS } from "@/routes/paths"

const GRACE_SECONDS = 120
const EXTENSION_SECONDS = 120
const MODULE_FLOOR = "Piso 1"

function EsTuTurnoContent({ tracking }: { tracking: TicketTracking }) {
  const now = useNow()
  const { confirmOnTheWay, requestExtension } = useClienteMutations()
  const { ticket, stats } = tracking

  const elapsed = secondsBetween(ticket.calledAt, now)
  const grace = GRACE_SECONDS + (ticket.extensionRequested ? EXTENSION_SECONDS : 0)
  const remaining = grace - elapsed

  // Aviso táctil al entrar a la pantalla del llamado.
  useEffect(() => {
    navigator.vibrate?.([300, 150, 300, 150, 300])
  }, [])

  return (
    <>
      <ClienteTopBar
        subtitle="Confirmación de llamada"
        accent
        backTo={PATHS.inicio}
        initial={ticket.customerName ?? undefined}
      />

      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-8">
        <CallHeroCard ticket={ticket} elapsedSeconds={elapsed} floor={MODULE_FLOOR} />
        <RouteGuideCard moduleCode={ticket.module} />
        <CallStatsRow stats={stats} />

        <div className="flex flex-col gap-3">
          <Button
            block
            disabled={ticket.onTheWay}
            loading={confirmOnTheWay.isPending}
            onClick={() => confirmOnTheWay.mutate(ticket)}
          >
            <OnTheWayIcon className="size-5" aria-hidden />
            {ticket.onTheWay ? "Asesor notificado" : "Ya voy en camino"}
          </Button>
          <Button
            variant="tonal"
            block
            disabled={ticket.extensionRequested}
            loading={requestExtension.isPending}
            onClick={() => requestExtension.mutate(ticket)}
          >
            <ExtensionIcon className="size-5" aria-hidden />
            {ticket.extensionRequested ? "Tiempo adicional concedido" : "Solicitar 2 minutos más"}
          </Button>
        </div>

        <p className="text-center text-label-telemetry text-on-surface-variant" aria-live="polite">
          {remaining > 0
            ? `Si no te presentas en ${formatMmSs(remaining)} min, el turno pasará a estado standby.`
            : "Se agotó el tiempo de presentación: acércate de inmediato al módulo o tu turno podría marcarse como ausente."}
        </p>
      </div>
    </>
  )
}

// Pantalla cliente 3: el asesor llamó el turno.
const EsTuTurnoPage = () => (
  <ClienteTicketGate expects="en_atencion">
    {(tracking) => <EsTuTurnoContent tracking={tracking} />}
  </ClienteTicketGate>
)

export default EsTuTurnoPage
