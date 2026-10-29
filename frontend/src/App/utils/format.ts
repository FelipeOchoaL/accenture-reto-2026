const pad = (value: number) => String(value).padStart(2, "0")

export function secondsBetween(fromIso: string | null, now: number): number {
  if (!fromIso) {
    return 0
  }

  return Math.max(0, Math.floor((now - new Date(fromIso).getTime()) / 1000))
}

// 261 -> "04:21" · 3725 -> "1:02:05"
export function formatMmSs(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
}

// 540 -> "9 min" · 4500 -> "1 h 15 min"
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.max(0, Math.round(totalSeconds / 60))
  if (minutes < 60) {
    return `${minutes} min`
  }
  return `${Math.floor(minutes / 60)} h ${pad(minutes % 60)} min`
}

// 10:42:15 AM
export function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

// 10:37 AM
export function formatHour(iso: string | null): string {
  if (!iso) {
    return "—"
  }

  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatMinutesDecimal(seconds: number): string {
  return (seconds / 60).toFixed(1)
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 1000) / 10}%`
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

export function minutesAgo(iso: string | null, now: number): string {
  const minutes = Math.floor(secondsBetween(iso, now) / 60)
  if (minutes < 1) {
    return "Ahora"
  }

  return `Hace ${minutes} min`
}

// 30 -> "A-030"
export function formatTicketCode(sequence: number): string {
  return `A-${pad(sequence).padStart(3, "0")}`
}
