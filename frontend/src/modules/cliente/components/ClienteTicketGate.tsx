import type { ReactNode } from "react"
import { Navigate, useNavigate } from "react-router"

import { CLOSED_TICKET_STATUSES, type TicketTracking } from "@/App/types/queue.types"
import { SpinnerIcon, WarningIcon } from "@/App/utils/icons"
import {
  ClienteMessageState,
  TicketClosedState,
} from "@/modules/cliente/components/ClienteMessageState"
import { useClienteTicket } from "@/modules/cliente/hooks/useClienteTicket"
import { PATHS } from "@/routes/paths"

interface ClienteTicketGateProps {
  // Estado del turno que corresponde a la pantalla; con otro estado se redirige.
  expects: "pendiente" | "en_atencion"
  children: (tracking: TicketTracking) => ReactNode
}

// Resuelve el turno del cliente y lo envía a la pantalla correcta según su estado en vivo.
export function ClienteTicketGate({ expects, children }: ClienteTicketGateProps) {
  const navigate = useNavigate()
  const { ticketId, clear, tracking } = useClienteTicket()

  const startOver = () => {
    clear()
    navigate(PATHS.cliente.pedirTurno, { replace: true })
  }

  if (!ticketId) {
    return <Navigate to={PATHS.cliente.pedirTurno} replace />
  }

  if (tracking.isPending) {
    return (
      <div className="flex flex-1 items-center justify-center py-24" role="status">
        <SpinnerIcon className="size-8 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Cargando tu turno…</span>
      </div>
    )
  }

  if (tracking.isError || !tracking.data) {
    return (
      <ClienteMessageState
        icon={WarningIcon}
        tone="danger"
        title="No encontramos tu turno"
        description={
          tracking.isError
            ? "No pudimos consultar la fila. Revisa tu conexión e intenta de nuevo."
            : "Es posible que la fila se haya reiniciado. Pide un turno nuevo para continuar."
        }
        actionLabel="Pedir nuevo turno"
        onAction={startOver}
      />
    )
  }

  const { ticket } = tracking.data

  if (CLOSED_TICKET_STATUSES.includes(ticket.status)) {
    return <TicketClosedState ticket={ticket} onNewTicket={startOver} />
  }

  if (ticket.status !== expects) {
    const target = ticket.status === "en_atencion" ? PATHS.cliente.llamado : PATHS.cliente.miTurno
    return <Navigate to={target} replace />
  }

  return <>{children(tracking.data)}</>
}
