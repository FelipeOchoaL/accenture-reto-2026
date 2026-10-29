import { HistoryTable } from "@/modules/asesor/components/HistoryTable"
import { KpiRow } from "@/modules/asesor/components/KpiRow"
import { QueueDataState } from "@/modules/asesor/components/QueueDataState"
import { useQueueSnapshot } from "@/modules/shared/hooks/useQueueSnapshot"

// Historial completo de la jornada con sus indicadores.
const HistorialPage = () => {
  const { data: snapshot, error, refetch } = useQueueSnapshot()

  if (!snapshot) {
    return <QueueDataState error={error} onRetry={() => void refetch()} />
  }

  return (
    <div className="flex flex-col gap-6 pt-2">
      <header>
        <h1 className="text-headline-lg text-on-surface">Historial del día</h1>
        <p className="text-body-md text-secondary">
          Turnos cerrados de la jornada: atendidos, ausentes, cancelados y transferidos.
        </p>
      </header>
      <KpiRow stats={snapshot.stats} history={snapshot.history} />
      <HistoryTable history={snapshot.history} title="Registros de la jornada" />
    </div>
  )
}

export default HistorialPage
