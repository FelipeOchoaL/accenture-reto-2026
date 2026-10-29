import type { Ticket } from "@/App/types/queue.types"
import { PeopleIcon } from "@/App/utils/icons"

interface PeopleAheadCardProps {
  ahead: Ticket[]
  ownCode: string
}

// Desglose de los turnos que están antes que el del cliente.
export function PeopleAheadCard({ ahead, ownCode }: PeopleAheadCardProps) {
  const count = ahead.length
  const title =
    count === 0
      ? "¡Eres el siguiente!"
      : `${count} ${count === 1 ? "persona" : "personas"} delante de ti`

  return (
    <section className="rounded-xl bg-surface-container-lowest p-4 shadow-panel">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
          <PeopleIcon className="size-5" aria-hidden />
        </span>
        <div className="flex flex-1 flex-col">
          <h2 className="text-headline-md text-on-surface">{title}</h2>
          <span className="text-label-telemetry text-on-surface-variant uppercase">
            Desglose de turnos intermedios
          </span>
        </div>
        <span className="rounded-lg bg-secondary-container px-2.5 py-1 text-body-sm text-on-surface">
          Cola activa
        </span>
      </div>

      <ol className="flex gap-2 overflow-x-auto pb-1">
        {ahead.map((ticket, index) => (
          <li
            key={ticket.id}
            className="flex min-w-[72px] flex-col items-center rounded-lg bg-surface-container-low px-3 py-2"
          >
            <span className="text-label-telemetry text-on-surface-variant">#{index + 1}</span>
            <span className="text-data-mono font-semibold text-on-surface tabular-nums">
              {ticket.code}
            </span>
          </li>
        ))}
        <li className="flex min-w-[72px] flex-col items-center rounded-lg bg-primary px-3 py-2 text-on-primary">
          <span className="text-label-telemetry">Tú</span>
          <span className="text-data-mono font-semibold tabular-nums">{ownCode}</span>
        </li>
      </ol>
    </section>
  )
}
