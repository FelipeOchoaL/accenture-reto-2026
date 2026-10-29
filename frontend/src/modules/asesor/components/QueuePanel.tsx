import { useState } from "react"

import type { Ticket } from "@/App/types/queue.types"
import { formatDuration, formatHour, minutesAgo, secondsBetween } from "@/App/utils/format"
import {
  AlertIcon,
  ListIcon,
  PauseIcon,
  PlayIcon,
  PrioritizeIcon,
  QueueIcon,
} from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { StatusChip } from "@/components/custom/StatusChip"
import { useNow } from "@/hooks/useNow"
import { cn } from "@/lib/utils"

const NEW_TICKET_WINDOW_SECONDS = 5 * 60

interface QueuePanelProps {
  waiting: Ticket[]
  moduleCode: string
  paused: boolean
  prioritizing: boolean
  onTogglePause: () => void
  onPrioritize: (ticket: Ticket) => void
}

const describe = (ticket: Ticket) => ticket.customerName ?? `Turno #${ticket.number}`

// Cola de espera del módulo: próximo turno, lista seleccionable y controles de la fila.
export function QueuePanel({
  waiting,
  moduleCode,
  paused,
  prioritizing,
  onTogglePause,
  onPrioritize,
}: QueuePanelProps) {
  const now = useNow(15_000)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [next, ...rest] = waiting
  const selected = waiting.find((ticket) => ticket.id === selectedId) ?? null
  const newest = [...waiting]
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
    .find((ticket) => secondsBetween(ticket.requestedAt, now) <= NEW_TICKET_WINDOW_SECONDS)

  const waitLabel = (ticket: Ticket) => formatDuration(secondsBetween(ticket.requestedAt, now))

  const toggleSelected = (ticket: Ticket) =>
    setSelectedId((current) => (current === ticket.id ? null : ticket.id))

  return (
    <section
      aria-label="Cola de espera"
      className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-panel"
    >
      <header className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <ListIcon className="mt-1 size-5 text-primary" aria-hidden />
          <div>
            <h2 className="text-headline-md text-on-surface">Cola de espera</h2>
            <p className="text-label-telemetry text-on-surface-variant uppercase">
              Módulo {moduleCode} y general
            </p>
          </div>
        </div>
        <span className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-label-telemetry font-semibold text-on-primary-fixed">
          {waiting.length} en fila
        </span>
      </header>

      {paused ? (
        <p className="rounded-lg bg-warning-container px-3 py-2 text-body-sm text-on-warning-container">
          La fila está en pausa: al finalizar no se llamará al siguiente turno.
        </p>
      ) : null}

      {next ? (
        <ol className="flex flex-col gap-2">
          <li>
            <button
              type="button"
              aria-pressed={selectedId === next.id}
              onClick={() => toggleSelected(next)}
              className={cn(
                "w-full rounded-lg border-l-4 border-primary bg-surface-container-low p-4 text-left transition-colors duration-150 hover:bg-surface-container",
                selectedId === next.id && "ring-2 ring-primary-container"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <StatusChip tone="primary">Próximo en fila</StatusChip>
                <span className="flex items-center gap-1 text-label-telemetry font-semibold text-primary">
                  <QueueIcon className="size-3.5" aria-hidden />
                  Espera: {waitLabel(next)}
                </span>
              </div>
              <p className="mt-2 font-heading text-headline-md text-on-surface tabular-nums">
                {next.code}
              </p>
              <p className="text-body-md text-on-surface">{describe(next)}</p>
              <p className="mt-1 text-label-telemetry text-on-surface-variant">
                {next.reason ? `Trámite: ${next.reason}` : `Solicitado a las ${formatHour(next.requestedAt)}`}
              </p>
            </button>
          </li>

          {rest.map((ticket, index) => (
            <li key={ticket.id}>
              <button
                type="button"
                aria-pressed={selectedId === ticket.id}
                onClick={() => toggleSelected(ticket)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg bg-surface-container-low px-3 py-2.5 text-left transition-colors duration-150 hover:bg-surface-container",
                  selectedId === ticket.id && "ring-2 ring-primary-container"
                )}
              >
                <span className="w-5 text-center text-data-mono text-on-surface-variant">
                  {index + 2}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-2">
                    <span className="text-data-mono font-bold text-on-surface tabular-nums">
                      {ticket.code}
                    </span>
                    <span className="truncate text-body-sm text-on-surface">{describe(ticket)}</span>
                    {ticket.priority ? <StatusChip tone="standby">Prioridad</StatusChip> : null}
                  </span>
                  <span className="truncate text-label-telemetry text-on-surface-variant">
                    {ticket.reason ? `Trámite: ${ticket.reason}` : `Solicitado ${formatHour(ticket.requestedAt)}`}
                  </span>
                </span>
                <span className="shrink-0 text-right text-label-telemetry text-on-surface-variant">
                  <span className="block font-semibold text-on-surface">{waitLabel(ticket)}</span>
                  espera
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-lg bg-surface-container-low px-4 py-8 text-center text-body-sm text-on-surface-variant">
          No hay turnos en espera.
        </p>
      )}

      {newest ? (
        <div className="rounded-lg border border-signal/30 bg-tertiary-fixed/40 p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-label-telemetry font-semibold text-tertiary uppercase">
              <AlertIcon className="size-3.5" aria-hidden />
              Nuevo turno en cola
            </span>
            <span className="text-label-telemetry text-signal">
              {minutesAgo(newest.requestedAt, now)}
            </span>
          </div>
          <p className="mt-1 flex items-center justify-between text-body-sm">
            <span className="text-data-mono font-bold text-on-surface">{newest.code}</span>
            <span className="text-on-surface">{describe(newest)}</span>
          </p>
          <p className="text-label-telemetry text-tertiary">Fila virtual • Recién registrado</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="tonal" size="sm" onClick={onTogglePause}>
          {paused ? (
            <PlayIcon className="size-4" aria-hidden />
          ) : (
            <PauseIcon className="size-4" aria-hidden />
          )}
          {paused ? "Reanudar fila" : "Pausar fila"}
        </Button>
        <Button
          variant="tonal"
          size="sm"
          disabled={!selected || selected.priority || selected.id === next?.id}
          loading={prioritizing}
          onClick={() => selected && onPrioritize(selected)}
          title={selected ? `Priorizar ${selected.code}` : "Selecciona un turno de la cola"}
        >
          {!prioritizing ? <PrioritizeIcon className="size-4" aria-hidden /> : null}
          Priorizar
        </Button>
      </div>
      <p className="-mt-2 text-center text-label-telemetry text-on-surface-variant">
        {selected ? `Seleccionado: ${selected.code}` : "Selecciona un turno para priorizarlo"}
      </p>
    </section>
  )
}
