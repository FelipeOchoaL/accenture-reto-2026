import type { Ticket } from "@/App/types/queue.types"
import { formatHour } from "@/App/utils/format"
import { CompletedIcon, DesktopIcon, QrIcon, QueueIcon, TicketIcon } from "@/App/utils/icons"
import { StatusChip } from "@/components/custom/StatusChip"
import { cn } from "@/lib/utils"

interface TicketHeroCardProps {
  ticket: Ticket
  progress: number
}

const STEPS = [
  { label: "Ingreso", icon: CompletedIcon, state: "done" },
  { label: "En cola", icon: QueueIcon, state: "active" },
  { label: "Ventanilla", icon: DesktopIcon, state: "pending" },
] as const

// Tarjeta principal del seguimiento: número asignado y progreso hacia la atención.
export function TicketHeroCard({ ticket, progress }: TicketHeroCardProps) {
  return (
    <section
      aria-label="Tu turno"
      className="relative overflow-hidden rounded-xl border border-primary-container/35 bg-surface-container-lowest p-6 shadow-focus"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-label-telemetry font-semibold text-on-surface-variant uppercase">
          <TicketIcon className="size-4" aria-hidden />
          Tu número asignado
        </span>
        <StatusChip tone="queue" dot pulse className="rounded-full">
          En espera
        </StatusChip>
      </div>

      <div className="relative my-4 flex flex-col items-center">
        <span className="font-heading text-display-ticket text-primary tabular-nums">
          {ticket.code}
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-data-mono text-on-surface-variant">
          <QrIcon className="size-4" aria-hidden />
          Solicitado a las {formatHour(ticket.requestedAt)}
        </span>
      </div>

      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-label-telemetry text-on-surface-variant uppercase">
            Progreso hacia tu atención
          </span>
          <span className="text-data-mono font-semibold text-primary tabular-nums">
            {progress}% completado
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Progreso hacia tu atención"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="mt-3 flex items-center justify-between">
          {STEPS.map(({ label, icon: Icon, state }) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-1 text-body-sm",
                state === "done" && "text-on-surface",
                state === "active" && "font-semibold text-primary",
                state === "pending" && "text-outline"
              )}
              aria-current={state === "active" ? "step" : undefined}
            >
              <Icon
                className={cn("size-4", state === "done" && "text-primary")}
                aria-hidden
              />
              {label}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
