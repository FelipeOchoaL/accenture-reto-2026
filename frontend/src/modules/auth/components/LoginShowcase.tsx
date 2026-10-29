import { BRAND } from "@/App/utils/brand"
import { formatMinutesDecimal } from "@/App/utils/format"
import { PeopleIcon, SpeakerIcon, TimerIcon } from "@/App/utils/icons"
import { LogoMark } from "@/components/custom/Logo"
import { useQueueSnapshot } from "@/modules/shared/hooks/useQueueSnapshot"

// Panel lateral del login: identidad del centro operativo y telemetría en vivo de la sala.
export function LoginShowcase() {
  const { data: snapshot } = useQueueSnapshot()

  const metrics = [
    {
      label: "En espera",
      value: snapshot ? `${snapshot.stats.waitingCount}` : "—",
      unit: "turnos",
      icon: PeopleIcon,
    },
    {
      label: "En atención",
      value: snapshot?.current?.code ?? "—",
      unit: snapshot?.current ? `Módulo ${snapshot.current.module ?? "—"}` : "Sin llamado",
      icon: SpeakerIcon,
    },
    {
      label: "Espera media",
      value: snapshot ? formatMinutesDecimal(snapshot.stats.averageWaitSeconds) : "—",
      unit: "min",
      icon: TimerIcon,
    },
  ]

  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-container p-10 text-on-primary lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:32px_32px]"
      />
      <div
        aria-hidden
        className="absolute -right-24 -bottom-24 size-96 rounded-full bg-primary-fixed-dim/25 blur-3xl"
      />

      <div className="relative flex items-center gap-3">
        <LogoMark className="bg-on-primary/15" />
        <span className="flex flex-col">
          <span className="font-heading text-headline-md">{BRAND.name}</span>
          <span className="text-label-telemetry text-on-primary-container uppercase">
            Centro operativo
          </span>
        </span>
      </div>

      <div className="relative flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-on-primary/15 px-3 py-1 text-label-telemetry font-semibold tracking-wider uppercase">
          <span className="size-2 animate-pulse rounded-full bg-on-primary" aria-hidden />
          En vivo • {BRAND.office}
        </span>
        <h2 className="max-w-md text-headline-lg text-on-primary">
          Gestiona la fila de tu módulo con precisión en tiempo real.
        </h2>
        <p className="max-w-md text-body-md text-on-primary-container">
          Llama al siguiente turno, registra atenciones y ausencias, y consulta la telemetría
          de la jornada desde un solo panel.
        </p>

        <dl className="grid grid-cols-3 gap-3">
          {metrics.map(({ label, value, unit, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg border border-on-primary/15 bg-on-primary/10 p-3 backdrop-blur-sm"
            >
              <dt className="flex items-center justify-between text-label-telemetry text-on-primary-container uppercase">
                {label}
                <Icon className="size-4" aria-hidden />
              </dt>
              <dd className="mt-1 font-heading text-headline-md font-bold tabular-nums">
                {value}
              </dd>
              <dd className="text-label-telemetry text-on-primary-container">{unit}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="relative text-label-telemetry tracking-wider text-on-primary-container uppercase">
        Sistema de telemetría de turnos • {BRAND.version}
      </p>
    </aside>
  )
}
