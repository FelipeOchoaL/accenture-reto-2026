import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface LiveBadgeProps {
  children: ReactNode
  pulse?: boolean
  tone?: "soft" | "strong" | "secondary"
  className?: string
}

const toneClasses = {
  soft: "bg-surface-container-low text-on-surface",
  strong: "bg-surface-container-high text-primary shadow-sm",
  secondary: "bg-secondary-container text-on-secondary-container",
}

// Indicador "en vivo": punto violeta + etiqueta de telemetría.
export function LiveBadge({
  children,
  pulse = false,
  tone = "soft",
  className,
}: LiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-telemetry font-semibold tracking-wider uppercase",
        toneClasses[tone],
        className
      )}
    >
      <span
        aria-hidden
        className={cn("size-2 rounded-full bg-primary", pulse && "animate-pulse")}
      />
      {children}
    </span>
  )
}

// Punto con onda expansiva para el turno "llamado ahora".
export function PingDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative flex size-2.5", className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
    </span>
  )
}
