import type { Ticket, TicketStatus } from "@/App/types/queue.types"
import { formatDuration, formatHour, secondsBetween } from "@/App/utils/format"
import { HistoryIcon } from "@/App/utils/icons"
import { StatusChip } from "@/components/custom/StatusChip"

const STATUS_CHIP: Partial<
  Record<TicketStatus, { label: string; tone: "serving" | "danger" | "neutral" | "info" }>
> = {
  atendido: { label: "Atendido", tone: "serving" },
  ausente: { label: "Ausente", tone: "danger" },
  cancelado: { label: "Cancelado", tone: "neutral" },
  transferido: { label: "Transferido", tone: "info" },
}

interface HistoryTableProps {
  history: Ticket[]
  limit?: number
  title?: string
}

// Historial de turnos cerrados en la jornada (hora de solicitud, atención y espera).
export function HistoryTable({ history, limit, title = "Historial reciente de la jornada" }: HistoryTableProps) {
  const rows = limit ? history.slice(0, limit) : history

  return (
    <section className="rounded-xl bg-surface-container-lowest p-4 shadow-panel md:p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-headline-md text-on-surface">
          <HistoryIcon className="size-5 text-primary" aria-hidden />
          {title}
        </h2>
        <span className="text-data-mono text-on-surface-variant">
          {history.length} registros procesados
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low text-label-telemetry text-on-surface-variant uppercase">
              <th scope="col" className="rounded-l-lg px-3 py-3 font-medium">Turno</th>
              <th scope="col" className="px-3 py-3 font-medium">Cliente</th>
              <th scope="col" className="px-3 py-3 font-medium">Motivo</th>
              <th scope="col" className="px-3 py-3 font-medium">Hora solicitud</th>
              <th scope="col" className="px-3 py-3 font-medium">Hora atención</th>
              <th scope="col" className="px-3 py-3 font-medium">Espera</th>
              <th scope="col" className="rounded-r-lg px-3 py-3 text-right font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-body-sm text-on-surface-variant">
                  Aún no hay turnos cerrados en la jornada.
                </td>
              </tr>
            ) : null}
            {rows.map((ticket) => {
              const chip = STATUS_CHIP[ticket.status]
              const waited = ticket.calledAt
                ? formatDuration(secondsBetween(ticket.requestedAt, new Date(ticket.calledAt).getTime()))
                : "—"
              return (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 text-body-sm transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-3 py-3 text-data-mono font-bold text-on-surface tabular-nums">
                    {ticket.code}
                  </td>
                  <td className="px-3 py-3 text-on-surface">
                    {ticket.customerName ?? <span className="text-outline">Sin registrar</span>}
                  </td>
                  <td className="px-3 py-3 text-on-surface-variant">{ticket.reason ?? "—"}</td>
                  <td className="px-3 py-3 text-data-mono tabular-nums">{formatHour(ticket.requestedAt)}</td>
                  <td className="px-3 py-3 text-data-mono tabular-nums">{formatHour(ticket.calledAt)}</td>
                  <td className="px-3 py-3 text-data-mono tabular-nums">{waited}</td>
                  <td className="px-3 py-3 text-right">
                    {chip ? <StatusChip tone={chip.tone}>{chip.label}</StatusChip> : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
