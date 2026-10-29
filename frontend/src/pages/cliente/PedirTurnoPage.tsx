import { useState } from "react"
import { Navigate, useNavigate } from "react-router"

import type { Ticket } from "@/App/types/queue.types"
import { ClienteStatusRow } from "@/modules/cliente/components/ClienteHeaders"
import { PedirTurnoForm } from "@/modules/cliente/components/PedirTurnoForm"
import { RoomStatusCard } from "@/modules/cliente/components/RoomStatusCard"
import { TicketAssignedModal } from "@/modules/cliente/components/TicketAssignedModal"
import { useClienteMutations } from "@/modules/cliente/hooks/useClienteMutations"
import type { PedirTurnoValues } from "@/modules/cliente/schemas/pedir-turno.schema"
import { useQueueSnapshot } from "@/modules/shared/hooks/useQueueSnapshot"
import { estimateWaitMinutes } from "@/modules/shared/utils/queue-snapshot"
import { PATHS } from "@/routes/paths"
import { useClienteStore } from "@/stores/cliente.store"

interface Assigned {
  ticket: Ticket
  ahead: number
  estimatedMinutes: number
}

// Pantalla cliente 1: pedir turno. No requiere inicio de sesión.
const PedirTurnoPage = () => {
  const navigate = useNavigate()
  const ticketId = useClienteStore((state) => state.ticketId)
  const setTicket = useClienteStore((state) => state.setTicket)
  const { data: snapshot } = useQueueSnapshot()
  const { requestTicket } = useClienteMutations()
  const [assigned, setAssigned] = useState<Assigned | null>(null)

  // Si este dispositivo ya tiene un turno activo, se muestra su seguimiento.
  if (ticketId && !assigned) {
    return <Navigate to={PATHS.cliente.miTurno} replace />
  }

  const handleSubmit = (values: PedirTurnoValues) => {
    const ahead = snapshot?.stats.waitingCount ?? 0
    requestTicket.mutate(
      { customerName: values.customerName, reason: values.reason },
      {
        onSuccess: (ticket) => {
          const turnsBefore = ahead + (snapshot?.current ? 1 : 0)
          setAssigned({
            ticket,
            ahead,
            estimatedMinutes: snapshot ? estimateWaitMinutes(turnsBefore, snapshot.stats) : 1,
          })
          setTicket(ticket.id, ahead)
        },
      }
    )
  }

  return (
    <div className="flex flex-col px-4 pb-10">
      <ClienteStatusRow />

      <header className="mt-2 mb-6">
        <h1 className="text-headline-lg-mobile tracking-tight text-on-surface">Pide tu turno</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Ingresa tus datos para unirte a la fila virtual sin tener que esperar de pie en la
          sala.
        </p>
      </header>

      <RoomStatusCard snapshot={snapshot} />

      <PedirTurnoForm onSubmit={handleSubmit} submitting={requestTicket.isPending} />

      <TicketAssignedModal
        ticket={assigned?.ticket ?? null}
        position={(assigned?.ahead ?? 0) + 1}
        estimatedMinutes={assigned?.estimatedMinutes ?? 1}
        onContinue={() => navigate(PATHS.cliente.miTurno, { replace: true })}
      />
    </div>
  )
}

export default PedirTurnoPage
