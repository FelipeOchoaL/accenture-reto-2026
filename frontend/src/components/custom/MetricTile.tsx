import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface MetricTileProps {
  label: string
  value: ReactNode
  unit?: ReactNode
  caption?: ReactNode
  icon?: LucideIcon
  highlight?: boolean
  surface?: "low" | "lowest"
  className?: string
  children?: ReactNode
}

// Tarjeta de métrica de telemetría: etiqueta en mayúsculas, valor grande con cifras tabulares.
export function MetricTile({
  label,
  value,
  unit,
  caption,
  icon: Icon,
  highlight = false,
  surface = "low",
  className,
  children,
}: MetricTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-2 rounded-lg p-4",
        surface === "low"
          ? "bg-surface-container-low"
          : "bg-surface-container-lowest shadow-panel",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2",
          highlight ? "text-primary" : "text-secondary"
        )}
      >
        <span
          className={cn(
            "text-label-telemetry uppercase",
            highlight && "font-semibold"
          )}
        >
          {label}
        </span>
        {Icon ? <Icon className="size-[18px] shrink-0" aria-hidden /> : null}
      </div>
      <div className="flex flex-col">
        <span className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-heading text-headline-lg font-bold tabular-nums",
              highlight ? "text-primary" : "text-on-surface"
            )}
          >
            {value}
          </span>
          {unit ? (
            <span className="text-body-sm text-on-surface-variant">{unit}</span>
          ) : null}
        </span>
        {caption ? (
          <span className="text-body-sm text-secondary">{caption}</span>
        ) : null}
      </div>
      {children}
    </div>
  )
}
