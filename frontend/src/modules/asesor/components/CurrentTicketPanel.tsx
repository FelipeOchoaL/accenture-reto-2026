import { useState } from "react"

import type { Asesor } from "@/App/types/auth.types"
import type { Ticket } from "@/App/types/queue.types"
import { formatHour, formatMmSs, secondsBetween } from "@/App/utils/format"
import {
  AbsentIcon,
  BroadcastIcon,
  CallIcon,
  CompletedIcon,
  ForwardIcon,
  OnTheWayIcon,
  SaveIcon,
  ShieldIcon,
  TimerIcon,
  TransferIcon,
} from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { StatusChip } from "@/components/custom/StatusChip"
import { useNow } from "@/hooks/useNow"
import { cn } from "@/lib/utils"

interface CurrentTicketPanelProps {
  user: Asesor
  current: Ticket | null
  next: Ticket | undefined
  paused: boolean
  busy: boolean
  savingNote: boolean
  onFinish: (note: string) => void
  onAbsent: () => void
  onRecall: () => void
  onTransfer: () => void
  onSaveNote: (note: string) => void
}

function Chronometer({ calledAt }: { calledAt: string | null }) {
  const now = useNow()
  return (
    <div className="flex items-start justify-between rounded-lg bg-surface-container-lowest p-4 shadow-panel">
      <div>
        <span className="text-label-telemetry text-on-surface-variant uppercase">
          Cronómetro de atención
        </span>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="font-heading text-headline-lg font-bold text-primary tabular-nums">
            {formatMmSs(secondsBetween(calledAt, now))}
          </span>
          <span className="text-body-sm text-on-surface-variant">transcurridos</span>
        </p>
      </div>
      <span className="flex size-11 items-center justify-center rounded-lg bg-primary-fixed text-primary">
        <TimerIcon className="size-6" aria-hidden />
      </span>
    </div>
  )
}

// Panel central: turno en atención, notas rápidas y acciones del operador.
export function CurrentTicketPanel({
  user,
  current,
  next,
  paused,
  busy,
  savingNote,
  onFinish,
  onAbsent,
  onRecall,
  onTransfer,
  onSaveNote,
}: CurrentTicketPanelProps) {
  const [note, setNote] = useState(current?.note ?? "")

  const callsNext = !paused && Boolean(next)

  return (
    <section
      aria-label="Turno en atención"
      className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-panel"
    >
      <div className="h-[3px] bg-primary-container" aria-hidden />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {current ? (
            <StatusChip tone="queue" dot pulse>
              Llamada en curso
            </StatusChip>
          ) : (
            <StatusChip tone="neutral" dot>
              Módulo disponible
            </StatusChip>
          )}
          <span className="text-label-telemetry text-on-surface-variant uppercase">
            {user.module.window} • Módulo directo
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-sm bg-surface-container-low px-2 py-1 text-body-sm text-on-surface-variant">
            <BroadcastIcon className="size-4 text-primary" aria-hidden />
            Telemetría: activa
          </span>
        </div>

        {current ? (
          <div className="grid gap-4 rounded-xl bg-surface-container-low p-4 md:grid-cols-[1.2fr_1fr] md:p-6">
            <div className="flex flex-col justify-center gap-3">
              <span className="text-label-telemetry text-on-surface-variant uppercase">
                Turno actual en atención
              </span>
              <span className="font-heading text-display-ticket-mobile text-on-surface tabular-nums md:text-display-ticket">
                {current.code}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip tone={current.priority ? "standby" : "neutral"}>
                  Prioridad {current.priority ? "alta" : "regular"}
                </StatusChip>
                <span className="text-data-mono text-on-surface-variant">
                  Solicitud {formatHour(current.requestedAt)} • Llamado {formatHour(current.calledAt)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Chronometer calledAt={current.calledAt} />
              <div className="rounded-lg bg-surface-container-lowest p-4 shadow-panel">
                <div className="flex items-center justify-between">
                  <span className="text-label-telemetry text-on-surface-variant uppercase">
                    Cliente citado
                  </span>
                  <ShieldIcon className="size-4 text-primary" aria-hidden />
                </div>
                <p className="mt-1 font-heading text-headline-md text-on-surface">
                  {current.customerName ?? `Turno #${current.number}`}
                </p>
                <p className="mt-1 text-body-sm text-primary">
                  {current.reason ?? "Sin motivo registrado"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {current.onTheWay ? (
                    <StatusChip tone="serving" dot>
                      <OnTheWayIcon className="size-3.5" aria-hidden />
                      En camino
                    </StatusChip>
                  ) : null}
                  {current.extensionRequested ? (
                    <StatusChip tone="standby">+2 min solicitados</StatusChip>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-6 py-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <CallIcon className="size-7" aria-hidden />
            </span>
            <h2 className="text-headline-md text-on-surface">Sin turno en atención</h2>
            <p className="max-w-sm text-body-sm text-on-surface-variant">
              {paused
                ? "La fila está en pausa. Reanúdala desde la cola de espera para llamar turnos."
                : next
                  ? `El siguiente en la fila es ${next.code}. Llámalo cuando estés listo.`
                  : "No hay turnos en espera por ahora."}
            </p>
          </div>
        )}

        {current ? (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="nota-atencion"
              className="text-label-telemetry text-on-surface-variant uppercase"
            >
              Notas de atención rápida para expediente
            </label>
            <div className="flex gap-2">
              <input
                id="nota-atencion"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ej: Solicitud de certificado de saldo y regularización de firma presencial…"
                className="h-11 min-w-0 flex-1 rounded-lg bg-surface-container-low px-3 text-body-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#7928ca] focus:outline-none"
              />
              <Button
                variant="tonal"
                size="md"
                loading={savingNote}
                disabled={!note.trim()}
                onClick={() => onSaveNote(note)}
              >
                {!savingNote ? <SaveIcon className="size-4" aria-hidden /> : null}
                Guardar
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <span className="text-label-telemetry text-on-surface-variant uppercase">
            Acciones del operador
          </span>
          <Button
            variant="accent"
            block
            loading={busy}
            disabled={!current && !callsNext}
            onClick={() => onFinish(note)}
            className="h-14 justify-between rounded-lg px-4"
          >
            <span className="flex items-center gap-3 font-heading text-headline-md">
              {!busy ? <CompletedIcon className="size-6" aria-hidden /> : null}
              {current
                ? callsNext
                  ? "Finalizar y llamar siguiente"
                  : "Finalizar atención"
                : "Llamar siguiente turno"}
            </span>
            {callsNext && next ? (
              <span className="hidden items-center gap-2 rounded-md bg-primary/60 px-3 py-1.5 sm:flex">
                <span className="text-label-telemetry uppercase">Siguiente:</span>
                <span className="font-heading text-headline-md tracking-widest tabular-nums">
                  {next.code}
                </span>
                <ForwardIcon className="size-5" aria-hidden />
              </span>
            ) : null}
          </Button>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button variant="tonal" size="md" disabled={!current || busy} onClick={onRecall}>
              <CallIcon className="size-4" aria-hidden />
              Llamar de nuevo
            </Button>
            <Button
              variant="danger"
              size="md"
              disabled={!current || busy}
              onClick={onAbsent}
              className={cn(!current && "border-transparent")}
            >
              <AbsentIcon className="size-4" aria-hidden />
              Marcar como ausente
            </Button>
            <Button variant="tonal" size="md" disabled={!current || busy} onClick={onTransfer}>
              <TransferIcon className="size-4" aria-hidden />
              Transferir a otro módulo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
