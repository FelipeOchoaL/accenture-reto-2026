import { BRAND } from "@/App/utils/brand"
import { cn } from "@/lib/utils"

interface LogoProps {
  subtitle?: string
  className?: string
  size?: "sm" | "md"
}

// Isotipo: cuadrado violeta con un rombo blanco, como en las referencias.
export function LogoMark({ size = "md", className }: Pick<LogoProps, "size" | "className">) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-primary-container",
        size === "md" ? "size-8" : "size-7",
        className
      )}
    >
      <span className="size-3.5 rotate-45 rounded-[2px] bg-surface-container-lowest" />
    </span>
  )
}

export function Logo({ subtitle, className, size = "md" }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <span className="flex flex-col">
        <span className="font-heading text-headline-md leading-tight text-on-surface">
          {BRAND.name}
        </span>
        {subtitle ? (
          <span className="text-label-telemetry text-on-surface-variant uppercase">
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  )
}
