import type { QueueStats, Ticket } from "@/App/types/queue.types"
import { formatMinutesDecimal, formatPercent } from "@/App/utils/format"
import { AbsentIcon, CheckIcon, ClockIcon, OnTheWayIcon, WarningIcon } from "@/App/utils/icons"
import { cn } from "@/lib/utils"

interface KpiRowProps {
  stats: QueueStats
  history: Ticket[]
}

const DAILY_GOAL = 30
const WAIT_TARGET_MINUTES = 10
const ABSENCE_THRESHOLD = 0.07

function Indicator({ ok, children }: { ok: boolean; children: string }) {
  const Icon = ok ? CheckIcon : WarningIcon
  return (
    <p
      className={cn(
        "mt-2 flex items-start gap-1.5 text-label-telemetry",
        ok ? "text-on-success-container" : "text-on-warning-container"
      )}
    >
      <Icon className="mt-px size-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  )
}

// Indicadores de la jornada calculados a partir de los turnos del día.
export function KpiRow({ stats, history }: KpiRowProps) {
  const attended = history.filter((ticket) => ticket.status === "atendido")
  const range = attended.length
    ? `${attended.at(-1)!.code} / ${attended[0].code}`
    : "Sin atenciones"
  const waitMinutes = stats.averageWaitSeconds / 60

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <section className="rounded-xl bg-surface-container-lowest p-4 shadow-panel">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-label-telemetry uppercase">Total atendidos hoy</span>
          <OnTheWayIcon className="size-[18px] text-primary" aria-hidden />
        </div>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-headline-lg font-bold text-on-surface tabular-nums">
            {stats.attendedToday}
          </span>
          <span className="text-body-sm text-on-surface-variant">turnos ({range})</span>
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(100, (stats.attendedToday / DAILY_GOAL) * 100)}%` }}
          />
        </div>
        <p className="mt-1 text-label-telemetry text-on-surface-variant">
          Meta diaria: {DAILY_GOAL} turnos
        </p>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-4 shadow-panel">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-label-telemetry uppercase">Espera promedio</span>
          <ClockIcon className="size-[18px] text-signal" aria-hidden />
        </div>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-headline-lg font-bold text-on-surface tabular-nums">
            {formatMinutesDecimal(stats.averageWaitSeconds)}
          </span>
          <span className="text-body-sm text-on-surface-variant">min / cliente</span>
        </p>
        <Indicator ok={waitMinutes <= WAIT_TARGET_MINUTES}>
          {waitMinutes <= WAIT_TARGET_MINUTES
            ? `Dentro del objetivo (≤ ${WAIT_TARGET_MINUTES} min)`
            : `Sobre el objetivo de ${WAIT_TARGET_MINUTES} min entre solicitud y atención`}
        </Indicator>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-4 shadow-panel">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-label-telemetry uppercase">Tasa de ausencias</span>
          <AbsentIcon className="size-[18px] text-danger" aria-hidden />
        </div>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-headline-lg font-bold text-on-surface tabular-nums">
            {formatPercent(stats.absenceRate)}
          </span>
          <span className="text-body-sm text-on-surface-variant">
            ({stats.absentToday} no {stats.absentToday === 1 ? "presentado" : "presentados"} ·{" "}
            {stats.cancelledToday} {stats.cancelledToday === 1 ? "cancelado" : "cancelados"})
          </span>
        </p>
        <Indicator ok={stats.absenceRate < ABSENCE_THRESHOLD}>
          {stats.absenceRate < ABSENCE_THRESHOLD
            ? "Dentro del umbral óptimo (< 7%)"
            : "Por encima del umbral óptimo (7%)"}
        </Indicator>
      </section>
    </div>
  )
}
