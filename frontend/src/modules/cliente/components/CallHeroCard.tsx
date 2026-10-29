import type { Ticket } from "@/App/types/queue.types"
import { formatMmSs } from "@/App/utils/format"
import { BroadcastIcon, CallIcon, OfficeIcon, SpeakerIcon } from "@/App/utils/icons"

interface CallHeroCardProps {
  ticket: Ticket
  elapsedSeconds: number
  floor: string
}

// Tarjeta violeta de llamado activo: número, módulo y asesor que atiende.
export function CallHeroCard({ ticket, elapsedSeconds, floor }: CallHeroCardProps) {
  return (
    <section
      aria-live="assertive"
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary-container to-primary p-5 text-on-primary shadow-xl shadow-primary/25"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-primary-fixed-dim/20 blur-3xl"
      />

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 py-1 text-label-telemetry font-bold tracking-wider text-primary uppercase">
          <span className="size-2 animate-pulse rounded-full bg-primary" aria-hidden />
          Llamado en curso
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-on-primary/15 px-3 py-1 text-data-mono tabular-nums">
          <BroadcastIcon className="size-4" aria-hidden />
          <span aria-label="Tiempo desde el llamado">{formatMmSs(elapsedSeconds)}</span>
        </span>
      </div>

      <div className="relative mt-5 flex flex-col items-center text-center">
        <span className="mb-3 flex size-14 items-center justify-center rounded-xl bg-on-primary/15">
          <CallIcon className="size-7 animate-pulse" aria-hidden />
        </span>
        <h1 className="text-headline-lg text-on-primary">¡Es tu turno!</h1>
        <p className="mt-1 text-body-lg text-on-primary-container">
          Acércate con tu documentación al asesor
        </p>
      </div>

      <div className="relative mt-5 rounded-lg bg-surface-container-lowest p-5 text-center text-on-surface shadow-md">
        <span className="text-label-telemetry text-on-surface-variant uppercase">
          Código de turno asignado
        </span>
        <p className="my-2 font-heading text-display-ticket-mobile text-on-surface tabular-nums">
          {ticket.code}
        </p>
        <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3 text-left">
          <span className="flex size-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <OfficeIcon className="size-6" aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="flex items-center gap-2">
              <span className="font-heading text-headline-md font-bold text-primary">
                Módulo {ticket.module ?? "—"}
              </span>
              <span className="rounded-sm bg-surface-container-high px-1.5 py-0.5 text-label-telemetry text-on-surface-variant uppercase">
                {floor}
              </span>
            </span>
            <span className="text-body-sm text-on-surface-variant">
              Asesor:{" "}
              <span className="font-medium text-on-surface">{ticket.advisorName ?? "—"}</span>
            </span>
          </div>
        </div>
      </div>

      <p className="relative mt-4 flex items-center gap-3 rounded-lg bg-on-primary/10 px-4 py-3 text-body-sm">
        <SpeakerIcon className="size-5 shrink-0" aria-hidden />
        Tu llamada está activa en el altavoz y la pantalla principal de la sala.
      </p>
    </section>
  )
}
