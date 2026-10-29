import { VerifiedIcon } from "@/App/utils/icons"

// Banner informativo. Reemplaza la foto de referencia por un degradado de marca (sin imágenes externas).
export function PriorityBanner() {
  return (
    <section className="relative flex h-44 w-full items-center overflow-hidden rounded-xl bg-inverse-surface shadow-sm">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgb(121_40_202/0.55),transparent_45%),radial-gradient(circle_at_60%_110%,rgb(0_112_243/0.35),transparent_40%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:28px_28px]"
      />
      <div className="relative max-w-md px-6 text-surface-container-lowest md:px-10">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-sm bg-primary/80 px-2 py-0.5 backdrop-blur-md">
          <VerifiedIcon className="size-3.5" aria-hidden />
          <span className="text-label-telemetry font-bold tracking-wider uppercase">
            Atención prioritaria
          </span>
        </span>
        <h3 className="mb-1 text-headline-md text-surface-container-lowest">
          Atención ágil sin aglomeraciones
        </h3>
        <p className="text-body-sm leading-snug text-surface-container-high">
          Puedes aguardar cómodamente en la sala o pasear por los alrededores hasta
          recibir la notificación en tu móvil.
        </p>
      </div>
    </section>
  )
}
