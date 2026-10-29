import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Chips de telemetría: compactos, en mayúsculas y con radio de 4px (no son "pills" redondas).
const chipVariants = cva(
  "inline-flex h-6 items-center gap-1.5 rounded-sm px-2 text-label-telemetry font-semibold whitespace-nowrap uppercase",
  {
    variants: {
      tone: {
        serving: "bg-success-container text-on-success-container",
        queue:
          "border border-primary-container/20 bg-primary-fixed text-on-primary-fixed",
        standby: "bg-warning-container text-on-warning-container",
        danger: "bg-danger-container text-on-danger-container",
        neutral: "bg-surface-container-high text-on-surface-variant",
        primary: "bg-primary text-on-primary",
        info: "bg-tertiary-fixed text-tertiary",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
)

const dotColor: Record<string, string> = {
  serving: "bg-success",
  queue: "bg-primary",
  standby: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-outline",
  primary: "bg-on-primary",
  info: "bg-signal",
}

interface StatusChipProps extends VariantProps<typeof chipVariants> {
  children: ReactNode
  dot?: boolean
  pulse?: boolean
  className?: string
}

export function StatusChip({
  tone = "neutral",
  dot = false,
  pulse = false,
  className,
  children,
}: StatusChipProps) {
  return (
    <span className={cn(chipVariants({ tone }), className)}>
      {dot ? (
        <span
          aria-hidden
          className={cn(
            "size-1.5 rounded-full",
            dotColor[tone ?? "neutral"],
            pulse && "animate-pulse"
          )}
        />
      ) : null}
      {children}
    </span>
  )
}
