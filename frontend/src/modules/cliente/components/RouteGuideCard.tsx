import { LocationIcon, WalkIcon } from "@/App/utils/icons"

interface RouteGuideCardProps {
  moduleCode: string | null
}

// Indicaciones para llegar al módulo que llamó el turno.
export function RouteGuideCard({ moduleCode }: RouteGuideCardProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-4 shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-label-telemetry text-on-surface-variant uppercase">
          Ruta inmediata
        </span>
        <span className="flex items-center gap-1 text-data-mono font-semibold text-primary">
          <WalkIcon className="size-4" aria-hidden />
          ~20 pasos
        </span>
      </div>
      <div className="flex items-start gap-3">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-inverse-surface to-primary text-on-primary">
          <LocationIcon className="size-7" aria-hidden />
        </span>
        <div>
          <p className="text-body-lg font-medium text-on-surface">
            Dirígete de inmediato al fondo a la derecha.
          </p>
          <p className="text-body-sm text-on-surface-variant">
            El módulo {moduleCode ?? ""} tiene la lámpara de estado encendida.
          </p>
        </div>
      </div>
    </section>
  )
}
