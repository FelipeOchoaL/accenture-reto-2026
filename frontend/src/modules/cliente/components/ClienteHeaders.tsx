import { Link } from "react-router"

import { BRAND } from "@/App/utils/brand"
import { BackIcon, LiveIcon, UserIcon } from "@/App/utils/icons"
import { LiveBadge } from "@/components/custom/LiveBadge"
import { cn } from "@/lib/utils"

// Fila de estado superior de la pantalla "Pide tu turno".
export function ClienteStatusRow() {
  return (
    <div className="flex items-center justify-between py-2">
      <LiveBadge tone="secondary" pulse>
        Fila virtual activa
      </LiveBadge>
      <span className="flex items-center gap-1 text-data-mono text-on-surface-variant">
        <LiveIcon className="size-4" aria-hidden />
        En vivo
      </span>
    </div>
  )
}

interface ClienteTopBarProps {
  subtitle: string
  accent?: boolean
  backTo?: string
  initial?: string
}

// Encabezado de las pantallas de seguimiento ("Mi turno", "Confirmación de llamada").
export function ClienteTopBar({ subtitle, accent = false, backTo, initial }: ClienteTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-surface-container-lowest/95 px-4 py-3 shadow-header backdrop-blur-xl">
      <div className="flex items-center gap-2">
        {backTo ? (
          <Link
            to={backTo}
            aria-label="Volver"
            className="flex size-9 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <BackIcon className="size-5" aria-hidden />
          </Link>
        ) : null}
        <div className="flex flex-col">
          <span className="flex items-center gap-2">
            <span className="font-heading text-headline-md text-on-surface">
              {BRAND.product}
            </span>
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-label-telemetry text-on-primary-fixed uppercase">
              {BRAND.office}
            </span>
          </span>
          <span
            className={cn(
              "text-label-telemetry uppercase",
              accent ? "font-semibold text-primary" : "text-on-surface-variant"
            )}
          >
            {subtitle}
          </span>
        </div>
      </div>
      <span
        aria-hidden
        className="flex size-10 items-center justify-center rounded-lg bg-primary font-heading font-bold text-on-primary"
      >
        {initial ? initial.charAt(0).toUpperCase() : <UserIcon className="size-5" />}
      </span>
    </header>
  )
}
