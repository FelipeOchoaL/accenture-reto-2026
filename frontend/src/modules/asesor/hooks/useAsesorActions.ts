import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getErrorMessage } from "@/App/types/api.types"
import type { Ticket } from "@/App/types/queue.types"
import { queryKeys } from "@/lib/query-keys"
import { turnosService } from "@/service/turnos.service"
import { useAsesorStore } from "@/stores/asesor.store"

interface CloseAndCallVars {
  current: Ticket | null
  next: Ticket | undefined
  note?: string
}

// Operaciones del asesor sobre la fila. Cada acción cierra el turno actual (si hay) y,
// salvo que la fila esté en pausa, llama al siguiente en espera.
// Las mutaciones esperan a que la fila se refresque antes de terminar: así el botón no se
// rehabilita con un "siguiente" desactualizado (que el backend rechazaría por ya estar llamado).
export function useAsesorActions() {
  const queryClient = useQueryClient()
  const paused = useAsesorStore((state) => state.paused)

  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.turnosHoy })
  const onError = (error: unknown) => {
    toast.error(getErrorMessage(error))
    void refresh()
  }

  const callNext = async (next: Ticket | undefined) => {
    if (paused || !next) {
      return null
    }
    return turnosService.updateTicket(next.number, { estado: "en_atencion" })
  }

  const finishAndCallNext = useMutation({
    mutationFn: async ({ current, next, note }: CloseAndCallVars) => {
      if (current) {
        await turnosService.updateTicket(current.number, {
          estado: "atendido",
          ...(note?.trim() ? { nota: note.trim() } : {}),
        })
      }
      return callNext(next)
    },
    onSuccess: (called) => {
      if (called) {
        toast.success(`Llamando al turno ${called.code}`)
      }
      return refresh()
    },
    onError,
  })

  const markAbsent = useMutation({
    mutationFn: async ({ current, next }: CloseAndCallVars) => {
      if (current) {
        await turnosService.updateTicket(current.number, { estado: "ausente" })
      }
      return callNext(next)
    },
    onSuccess: (called) => {
      toast.warning(
        called ? `Turno marcado como ausente. Llamando a ${called.code}` : "Turno marcado como ausente."
      )
      return refresh()
    },
    onError,
  })

  const transfer = useMutation({
    mutationFn: async ({ current, next, module }: CloseAndCallVars & { module: string }) => {
      if (current) {
        await turnosService.updateTicket(current.number, { estado: "transferido", modulo: module })
      }
      return { called: await callNext(next), module }
    },
    onSuccess: ({ module }) => {
      toast.success(`Turno transferido al módulo ${module}.`)
      return refresh()
    },
    onError,
  })

  const prioritize = useMutation({
    mutationFn: (ticket: Ticket) => turnosService.updateTicket(ticket.number, { prioridad: true }),
    onSuccess: (ticket) => {
      toast.success(`${ticket.code} pasa al frente de la cola.`)
      return refresh()
    },
    onError,
  })

  const saveNote = useMutation({
    mutationFn: ({ ticket, note }: { ticket: Ticket; note: string }) =>
      turnosService.updateTicket(ticket.number, { nota: note.trim() || null }),
    onSuccess: () => {
      toast.success("Nota guardada en el expediente.")
      return refresh()
    },
    onError,
  })

  return { finishAndCallNext, markAbsent, transfer, prioritize, saveNote }
}
