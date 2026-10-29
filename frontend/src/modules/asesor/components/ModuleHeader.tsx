import type { Asesor } from "@/App/types/auth.types"
import type { QueueStats } from "@/App/types/queue.types"
import { formatPercent } from "@/App/utils/format"
import { ClockIcon, UserIcon } from "@/App/utils/icons"
import { StatusChip } from "@/components/custom/StatusChip"

interface ModuleHeaderProps {
  user: Asesor
  stats: QueueStats | undefined
  paused: boolean
}

// Cabecera del módulo: identidad del asesor y KPIs de la sesión.
export function ModuleHeader({ user, stats, paused }: ModuleHeaderProps) {
  const pace = stats ? (3600 / stats.serviceIntervalSeconds).toFixed(1) : "—"

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-panel md:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary font-heading text-headline-md font-bold text-on-primary">
          {user.module.code}
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-headline-md text-on-surface">
              Módulo {user.module.code} - {user.module.name}
            </h1>
            {paused ? (
              <StatusChip tone="standby" dot>
                En pausa
              </StatusChip>
            ) : (
              <StatusChip tone="serving" dot pulse>
                En línea
              </StatusChip>
            )}
          </div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <UserIcon className="size-4" aria-hidden />
              Asesor: <span className="text-on-surface">{user.name}</span>
            </span>
            <span aria-hidden>•</span>
            <span>
              ID Operador: <span className="text-data-mono text-on-surface">{user.id}</span>
            </span>
            <span aria-hidden>•</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-4" aria-hidden />
              Jornada: {user.shift}
            </span>
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-outline-variant rounded-lg bg-surface-container-low py-2">
        <div className="px-4">
          <dt className="text-label-telemetry text-on-surface-variant uppercase">Eficiencia sesión</dt>
          <dd className="text-data-mono font-bold text-on-surface tabular-nums">
            {stats ? formatPercent(stats.efficiency) : "—"}
          </dd>
        </div>
        <div className="px-4">
          <dt className="text-label-telemetry text-on-surface-variant uppercase">Ritmo actual</dt>
          <dd className="text-data-mono font-bold text-primary tabular-nums">{pace} / h</dd>
        </div>
        <div className="px-4">
          <dt className="text-label-telemetry text-on-surface-variant uppercase">Estado asignador</dt>
          <dd className="mt-0.5">
            {paused ? (
              <StatusChip tone="standby">Pausado</StatusChip>
            ) : (
              <StatusChip tone="serving">Auto-disp</StatusChip>
            )}
          </dd>
        </div>
      </dl>
    </section>
  )
}
