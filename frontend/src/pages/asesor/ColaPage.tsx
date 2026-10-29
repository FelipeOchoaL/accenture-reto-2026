import { toast } from "sonner"

import { QueueDataState } from "@/modules/asesor/components/QueueDataState"
import { QueuePanel } from "@/modules/asesor/components/QueuePanel"
import { useAsesorActions } from "@/modules/asesor/hooks/useAsesorActions"
import { useQueueSnapshot } from "@/modules/shared/hooks/useQueueSnapshot"
import { useAsesorStore } from "@/stores/asesor.store"
import { useAuthStore } from "@/stores/auth.store"

// Vista dedicada a la cola de espera del módulo.
const ColaPage = () => {
  const moduleCode = useAuthStore((state) => state.session?.user.module.code ?? "")
  const paused = useAsesorStore((state) => state.paused)
  const togglePause = useAsesorStore((state) => state.togglePause)
  const { data: snapshot, error, refetch } = useQueueSnapshot()
  const { prioritize } = useAsesorActions()

  if (!snapshot) {
    return <QueueDataState error={error} onRetry={() => void refetch()} />
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 pt-2">
      <header>
        <h1 className="text-headline-lg text-on-surface">Cola de espera</h1>
        <p className="text-body-md text-secondary">
          Turnos pendientes en orden de llamado. Los priorizados pasan al frente.
        </p>
      </header>
      <QueuePanel
        waiting={snapshot.waiting}
        moduleCode={moduleCode}
        paused={paused}
        prioritizing={prioritize.isPending}
        onTogglePause={() => {
          togglePause()
          toast.info(paused ? "Fila reanudada." : "Fila en pausa: no se llamarán nuevos turnos.")
        }}
        onPrioritize={(ticket) => prioritize.mutate(ticket)}
      />
    </div>
  )
}

export default ColaPage
