import { useCallback } from "react"

import type { Ticket } from "@/App/types/queue.types"
import { useTurnosHoy } from "@/modules/shared/hooks/useQueueSnapshot"
import {
  buildQueueSnapshot,
  buildTicketTracking,
} from "@/modules/shared/utils/queue-snapshot"
import { useClienteStore } from "@/stores/cliente.store"

// Turno del cliente en este dispositivo + su seguimiento en vivo (posición, turnos delante, espera).
export function useClienteTicket() {
  const ticketId = useClienteStore((state) => state.ticketId)
  const initialAhead = useClienteStore((state) => state.initialAhead)
  const clear = useClienteStore((state) => state.clear)

  const select = useCallback(
    (tickets: Ticket[]) =>
      ticketId ? buildTicketTracking(buildQueueSnapshot(tickets), tickets, ticketId) : null,
    [ticketId]
  )

  const tracking = useTurnosHoy(select)

  return { ticketId, initialAhead, clear, tracking }
}
