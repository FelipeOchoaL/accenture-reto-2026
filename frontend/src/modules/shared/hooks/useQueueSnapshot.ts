import { useQuery } from "@tanstack/react-query"

import type { Ticket } from "@/App/types/queue.types"
import { queryKeys } from "@/lib/query-keys"
import { buildQueueSnapshot } from "@/modules/shared/utils/queue-snapshot"
import { turnosService } from "@/service/turnos.service"

// Turnos del día en vivo: se consultan cada pocos segundos (polling) para reflejar cambios de otros puestos.
export function useTurnosHoy<T = Ticket[]>(select?: (tickets: Ticket[]) => T) {
  return useQuery({
    queryKey: queryKeys.turnosHoy,
    queryFn: turnosService.getTurnosHoy,
    refetchInterval: 2500,
    select,
  })
}

// Estado de la fila (en atención, en espera, historial y métricas) derivado de los turnos del día.
export function useQueueSnapshot() {
  return useTurnosHoy(buildQueueSnapshot)
}
