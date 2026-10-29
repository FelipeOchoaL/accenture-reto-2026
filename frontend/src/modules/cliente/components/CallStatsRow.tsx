import type { QueueStats } from "@/App/types/queue.types"
import { ClipboardIcon, PeopleIcon } from "@/App/utils/icons"

interface CallStatsRowProps {
  stats: QueueStats
}

function MiniBar({ ratio, tone }: { ratio: number; tone: "dark" | "primary" }) {
  return (
    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
      <div
        className={tone === "dark" ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-primary-container"}
        style={{ width: `${Math.max(6, Math.min(100, ratio * 100))}%` }}
      />
    </div>
  )
}

// Mini indicadores de la sala mostrados durante el llamado.
export function CallStatsRow({ stats }: CallStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <section className="rounded-xl bg-surface-container-lowest p-4 shadow-panel">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-label-telemetry uppercase">Atendidos hoy</span>
          <ClipboardIcon className="size-4" aria-hidden />
        </div>
        <p className="mt-1 flex items-baseline gap-1">
          <span className="font-heading text-headline-lg-mobile font-bold text-on-surface tabular-nums">
            {stats.attendedToday}
          </span>
          <span className="text-body-sm text-on-surface-variant">turnos</span>
        </p>
        <MiniBar ratio={stats.attendedToday / 30} tone="dark" />
      </section>
      <section className="rounded-xl bg-surface-container-lowest p-4 shadow-panel">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-label-telemetry uppercase">En espera sala</span>
          <PeopleIcon className="size-4" aria-hidden />
        </div>
        <p className="mt-1 flex items-baseline gap-1">
          <span className="font-heading text-headline-lg-mobile font-bold text-primary tabular-nums">
            {stats.waitingCount}
          </span>
          <span className="text-body-sm text-on-surface-variant">personas</span>
        </p>
        <MiniBar ratio={stats.waitingCount / 20} tone="primary" />
      </section>
    </div>
  )
}
