import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getErrorMessage } from "@/App/types/api.types"
import type { Ticket } from "@/App/types/queue.types"
import { queryKeys } from "@/lib/query-keys"
import { turnosService } from "@/service/turnos.service"

// Acciones del cliente sobre su turno. Tras cada una se refrescan los turnos del día.
export function useClienteMutations() {
  const queryClient = useQueryClient()

  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.turnosHoy })
  const onError = (error: unknown) => toast.error(getErrorMessage(error))

  const requestTicket = useMutation({
    mutationFn: turnosService.requestTicket,
    onSuccess: refresh,
    onError,
  })

  const abandon = useMutation({
    mutationFn: (ticket: Ticket) =>
      turnosService.updateTicket(ticket.number, { estado: "cancelado" }),
    onSuccess: refresh,
    onError,
  })

  const confirmOnTheWay = useMutation({
    mutationFn: (ticket: Ticket) =>
      turnosService.updateTicket(ticket.number, { en_camino: true }),
    onSuccess: () => {
      toast.success("Avisamos al asesor que vas en camino.")
      return refresh()
    },
    onError,
  })

  const requestExtension = useMutation({
    mutationFn: (ticket: Ticket) =>
      turnosService.updateTicket(ticket.number, { prorroga: true }),
    onSuccess: () => {
      toast.success("Tienes 2 minutos adicionales para presentarte.")
      return refresh()
    },
    onError,
  })

  return { requestTicket, abandon, confirmOnTheWay, requestExtension }
}
