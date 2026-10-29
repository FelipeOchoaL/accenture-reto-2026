import type {
  QueueSnapshot,
  QueueStats,
  Ticket,
  TicketTracking,
} from "@/App/types/queue.types"

const DEFAULT_INTERVAL_SECONDS = 240
// Huecos mayores (p. ej. pausas o cambio de jornada) no representan la cadencia real.
const MAX_INTERVAL_SECONDS = 30 * 60

const toTime = (iso: string) => new Date(iso).getTime()

function average(values: number[]): number {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0
}

export function sortWaiting(tickets: Ticket[]): Ticket[] {
  return tickets
    .filter((ticket) => ticket.status === "pendiente")
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority ? -1 : 1
      }
      return a.requestedAt.localeCompare(b.requestedAt)
    })
}

export function computeStats(tickets: Ticket[]): QueueStats {
  const count = (status: Ticket["status"]) =>
    tickets.filter((ticket) => ticket.status === status).length
  const called = tickets.filter((ticket) => ticket.calledAt)

  const waits = called.map(
    (ticket) => (toTime(ticket.calledAt!) - toTime(ticket.requestedAt)) / 1000
  )

  const calledTimes = called.map((ticket) => toTime(ticket.calledAt!)).sort((a, b) => a - b)
  const intervals = calledTimes
    .slice(1)
    .map((time, index) => (time - calledTimes[index]) / 1000)
    .filter((seconds) => seconds > 0 && seconds <= MAX_INTERVAL_SECONDS)

  const attended = count("atendido")
  const absent = count("ausente")
  const cancelled = count("cancelado")
  const closed = attended + absent + cancelled

  return {
    attendedToday: attended,
    absentToday: absent,
    cancelledToday: cancelled,
    waitingCount: count("pendiente"),
    averageWaitSeconds: average(waits),
    serviceIntervalSeconds: intervals.length ? average(intervals) : DEFAULT_INTERVAL_SECONDS,
    absenceRate: attended + absent ? absent / (attended + absent) : 0,
    efficiency: closed ? attended / closed : 1,
  }
}

// Deriva el estado de la fila a partir de la lista de turnos del día que envía el backend.
export function buildQueueSnapshot(tickets: Ticket[]): QueueSnapshot {
  const current =
    tickets
      .filter((ticket) => ticket.status === "en_atencion")
      .sort((a, b) => (b.calledAt ?? "").localeCompare(a.calledAt ?? ""))[0] ?? null

  const history = tickets
    .filter((ticket) => ticket.status !== "pendiente" && ticket.status !== "en_atencion")
    .sort((a, b) =>
      (b.calledAt ?? b.requestedAt).localeCompare(a.calledAt ?? a.requestedAt)
    )

  return {
    current,
    waiting: sortWaiting(tickets),
    history,
    stats: computeStats(tickets),
  }
}

export function estimateWaitMinutes(turnsBefore: number, stats: QueueStats): number {
  return Math.max(1, Math.round((turnsBefore * stats.serviceIntervalSeconds) / 60))
}

export function buildTicketTracking(
  snapshot: QueueSnapshot,
  tickets: Ticket[],
  ticketId: string
): TicketTracking | null {
  const ticket = tickets.find((item) => item.id === ticketId)
  if (!ticket) {
    return null
  }

  const index = snapshot.waiting.findIndex((item) => item.id === ticketId)
  const ahead = index > 0 ? snapshot.waiting.slice(0, index) : []
  const turnsBefore = ahead.length + (snapshot.current ? 1 : 0)

  return {
    ticket,
    ahead,
    current: snapshot.current,
    stats: snapshot.stats,
    estimatedMinutes: estimateWaitMinutes(turnsBefore, snapshot.stats),
  }
}
