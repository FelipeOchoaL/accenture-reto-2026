import type { QueueSnapshot } from "@/App/types/queue.types"
import { formatMinutesDecimal } from "@/App/utils/format"
import {
  ClockIcon,
  CompletedIcon,
  PeopleIcon,
  SpeakerIcon,
  SyncIcon,
} from "@/App/utils/icons"
import { MetricTile } from "@/components/custom/MetricTile"
import { useNow } from "@/hooks/useNow"

// Capacidad de referencia de la sala para la barra de ocupación.
const ROOM_CAPACITY = 20

interface OfficeStatusPanelProps {
  snapshot: QueueSnapshot | undefined
  updatedAt: number
}

export function OfficeStatusPanel({ snapshot, updatedAt }: OfficeStatusPanelProps) {
  const now = useNow()
  const secondsAgo = updatedAt ? Math.max(0, Math.round((now - updatedAt) / 1000)) : null
  const waiting = snapshot?.stats.waitingCount ?? 0
  const occupancy = Math.min(1, waiting / ROOM_CAPACITY)

  return (
    <section
      id="estado-oficina"
      aria-labelledby="estado-oficina-titulo"
      className="scroll-mt-24 rounded-xl bg-surface-container-lowest p-6 shadow-sm"
    >
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h2
          id="estado-oficina-titulo"
          className="flex items-center gap-2 font-sans text-label-telemetry font-semibold tracking-wider text-secondary uppercase"
        >
          <span className="size-2.5 rounded-full bg-primary" aria-hidden />
          Estado de la oficina en tiempo real
        </h2>
        <span className="flex items-center gap-1 text-data-mono text-on-surface-variant">
          <SyncIcon className="size-4" aria-hidden />
          {secondsAgo === null ? "Sincronizando…" : `Actualizado hace ${secondsAgo}s`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricTile
          label="Completados"
          icon={CompletedIcon}
          value={snapshot?.stats.attendedToday ?? "—"}
          caption="Turnos hoy"
        />
        <MetricTile
          label="En atención"
          icon={SpeakerIcon}
          highlight
          value={snapshot?.current?.code ?? "—"}
          caption={
            snapshot?.current ? `Módulo ${snapshot.current.module}` : "Sin llamado activo"
          }
        />
        <MetricTile
          label="En espera"
          icon={PeopleIcon}
          value={waiting}
          caption="Personas en fila"
        />
        <MetricTile
          label="Espera prom."
          icon={ClockIcon}
          value={
            snapshot ? `${formatMinutesDecimal(snapshot.stats.averageWaitSeconds)} min` : "—"
          }
          caption="Solicitud → atención"
        />
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-2 pt-2 md:flex-row">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high"
          role="progressbar"
          aria-label="Ocupación de la sala"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(occupancy * 100)}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
            style={{ width: `${Math.max(4, occupancy * 100)}%` }}
          />
        </div>
        <span className="shrink-0 text-data-mono text-on-surface-variant">
          Ocupación de sala: {Math.round(occupancy * 100)}%{" "}
          {occupancy < 0.75 ? "normal" : "alta"}
        </span>
      </div>
    </section>
  )
}
