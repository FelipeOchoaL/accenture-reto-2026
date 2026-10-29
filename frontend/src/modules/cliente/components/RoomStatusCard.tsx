import type { QueueSnapshot } from "@/App/types/queue.types"
import { ClockIcon, PeopleIcon } from "@/App/utils/icons"
import { PingDot } from "@/components/custom/LiveBadge"
import { estimateWaitMinutes } from "@/modules/shared/utils/queue-snapshot"

interface RoomStatusCardProps {
  snapshot: QueueSnapshot | undefined
}

// Resumen de la sala antes de pedir turno: personas en espera, espera aproximada y turno llamado.
export function RoomStatusCard({ snapshot }: RoomStatusCardProps) {
  const waiting = snapshot?.stats.waitingCount
  const estimate = snapshot
    ? estimateWaitMinutes(
        snapshot.stats.waitingCount + (snapshot.current ? 1 : 0),
        snapshot.stats
      )
    : null

  return (
    <section
      aria-label="Estado en sala"
      className="mb-6 rounded-xl bg-surface-container p-4 shadow-sm"
    >
      <div className="flex items-center justify-between pb-2">
        <span className="text-label-telemetry text-on-surface-variant uppercase">
          Estado en sala
        </span>
        <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-data-mono font-semibold text-on-primary-fixed">
          Módulo central
        </span>
      </div>

      <div className="mt-1 grid grid-cols-2 gap-2">
        <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-3">
          <span className="mb-1 flex items-center gap-1.5 text-on-surface-variant">
            <PeopleIcon className="size-[18px] text-primary" aria-hidden />
            <span className="text-label-telemetry uppercase">En espera</span>
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-heading text-headline-lg-mobile text-on-surface tabular-nums">
              {waiting ?? "—"}
            </span>
            <span className="text-body-sm text-on-surface-variant">personas</span>
          </span>
        </div>
        <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-3">
          <span className="mb-1 flex items-center gap-1.5 text-on-surface-variant">
            <ClockIcon className="size-[18px] text-primary" aria-hidden />
            <span className="text-label-telemetry uppercase">Espera aprox.</span>
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-heading text-headline-lg-mobile text-primary tabular-nums">
              {estimate === null ? "—" : `~${estimate}`}
            </span>
            <span className="text-body-sm text-on-surface-variant">min</span>
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between rounded-lg bg-surface-container-lowest p-3">
        <span className="flex items-center gap-2">
          <PingDot />
          <span className="text-body-sm text-on-surface-variant">Turno actual en módulo:</span>
        </span>
        <span className="font-heading text-headline-md font-bold tracking-wider text-on-surface tabular-nums">
          {snapshot?.current?.code ?? "—"}
        </span>
      </div>
    </section>
  )
}
