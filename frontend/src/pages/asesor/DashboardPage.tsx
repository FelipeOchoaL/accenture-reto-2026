import { useState } from "react"
import { toast } from "sonner"

import { CurrentTicketPanel } from "@/modules/asesor/components/CurrentTicketPanel"
import { HistoryTable } from "@/modules/asesor/components/HistoryTable"
import { KpiRow } from "@/modules/asesor/components/KpiRow"
import { ModuleHeader } from "@/modules/asesor/components/ModuleHeader"
import { QueueDataState } from "@/modules/asesor/components/QueueDataState"
import { QueuePanel } from "@/modules/asesor/components/QueuePanel"
import { TransferDialog } from "@/modules/asesor/components/TransferDialog"
import { useAsesorActions } from "@/modules/asesor/hooks/useAsesorActions"
import { useQueueSnapshot } from "@/modules/shared/hooks/useQueueSnapshot"
import { useAsesorStore } from "@/stores/asesor.store"
import { useAuthStore } from "@/stores/auth.store"

// Panel de gestión y control de fila del asesor.
const DashboardPage = () => {
  const user = useAuthStore((state) => state.session?.user)
  const paused = useAsesorStore((state) => state.paused)
  const togglePause = useAsesorStore((state) => state.togglePause)
  const { data: snapshot, error, refetch } = useQueueSnapshot()
  const actions = useAsesorActions()
  const [transferOpen, setTransferOpen] = useState(false)

  if (!user) {
    return null
  }

  if (!snapshot) {
    return <QueueDataState error={error} onRetry={() => void refetch()} />
  }

  const { current, waiting } = snapshot
  const next = waiting[0]
  const busy =
    actions.finishAndCallNext.isPending || actions.markAbsent.isPending || actions.transfer.isPending

  return (
    <div className="flex flex-col gap-6 pt-2">
      <ModuleHeader user={user} stats={snapshot.stats} paused={paused} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <CurrentTicketPanel
            key={current?.id ?? "vacio"}
            user={user}
            current={current}
            next={next}
            paused={paused}
            busy={busy}
            savingNote={actions.saveNote.isPending}
            onFinish={(note) => actions.finishAndCallNext.mutate({ current, next, note })}
            onAbsent={() => actions.markAbsent.mutate({ current, next })}
            onRecall={() =>
              current && toast.info(`Volviendo a llamar al turno ${current.code} en la sala.`)
            }
            onTransfer={() => setTransferOpen(true)}
            onSaveNote={(note) => current && actions.saveNote.mutate({ ticket: current, note })}
          />
          <KpiRow stats={snapshot.stats} history={snapshot.history} />
          <HistoryTable history={snapshot.history} limit={5} />
        </div>

        <div className="xl:sticky xl:top-20">
          <QueuePanel
            waiting={waiting}
            moduleCode={user.module.code}
            paused={paused}
            prioritizing={actions.prioritize.isPending}
            onTogglePause={() => {
              togglePause()
              toast.info(paused ? "Fila reanudada." : "Fila en pausa: no se llamarán nuevos turnos.")
            }}
            onPrioritize={(ticket) => actions.prioritize.mutate(ticket)}
          />
        </div>
      </div>

      <TransferDialog
        open={transferOpen}
        ticketCode={current?.code}
        currentModule={user.module.code}
        loading={actions.transfer.isPending}
        onClose={() => setTransferOpen(false)}
        onConfirm={(module) =>
          actions.transfer.mutate(
            { current, next, module },
            { onSettled: () => setTransferOpen(false) }
          )
        }
      />
    </div>
  )
}

export default DashboardPage
