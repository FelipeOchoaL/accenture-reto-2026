import type { Ticket } from "@/App/types/queue.types"
import { minutesAgo } from "@/App/utils/format"
import { ClockIcon, PhoneIcon } from "@/App/utils/icons"
import { useNow } from "@/hooks/useNow"

interface QueueInfoCardsProps {
  current: Ticket | null
  estimatedMinutes: number
}

// Turno que se atiende ahora y tiempo aproximado de espera.
export function QueueInfoCards({ current, estimatedMinutes }: QueueInfoCardsProps) {
  const now = useNow(15_000)
  const low = Math.max(1, estimatedMinutes - 2)
  const high = estimatedMinutes + 3

  return (
    <div className="grid grid-cols-2 gap-3">
      <section className="flex flex-col justify-between gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-panel">
        <div className="flex items-start justify-between gap-2">
          <span className="text-label-telemetry text-on-surface-variant uppercase">
            Turno en atención
          </span>
          {current?.module ? (
            <span className="rounded-md bg-secondary-container px-2 py-0.5 text-label-telemetry font-semibold text-on-surface">
              Módulo {current.module}
            </span>
          ) : null}
        </div>
        <span className="font-heading text-headline-lg-mobile font-bold text-on-surface tabular-nums">
          {current?.code ?? "—"}
        </span>
        <span className="flex items-center gap-1.5 text-label-telemetry text-on-surface-variant">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          {current ? `Llamado: ${minutesAgo(current.calledAt, now).toLowerCase()}` : "Sin llamado"}
        </span>
      </section>

      <section className="flex flex-col justify-between gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-panel">
        <div className="flex items-start justify-between gap-2">
          <span className="text-label-telemetry text-on-surface-variant uppercase">
            Tiempo aprox.
          </span>
          <ClockIcon className="size-5 text-primary" aria-hidden />
        </div>
        <span className="flex items-baseline gap-1">
          <span className="font-heading text-headline-lg-mobile font-bold text-on-surface tabular-nums">
            ~{low}-{high}
          </span>
          <span className="text-body-sm text-on-surface-variant">min</span>
        </span>
        <span className="flex items-center gap-1.5 text-label-telemetry text-on-surface-variant">
          <PhoneIcon className="size-4" aria-hidden />
          Ten tu celular cerca
        </span>
      </section>
    </div>
  )
}
