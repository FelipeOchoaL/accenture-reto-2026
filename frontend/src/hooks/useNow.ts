import { useEffect, useState } from "react"

// Hora actual que se actualiza cada `intervalMs`. Útil para relojes y cronómetros en vivo.
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return now
}
