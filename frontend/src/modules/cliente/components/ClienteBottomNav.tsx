import { Link } from "react-router"
import { toast } from "sonner"

import { ListIcon, SupportIcon, TicketIcon } from "@/App/utils/icons"
import { PATHS } from "@/routes/paths"

const itemClass =
  "flex flex-1 flex-col items-center gap-1 py-2 text-label-telemetry transition-colors"

// Navegación inferior del cliente en el seguimiento de su turno.
export function ClienteBottomNav() {
  return (
    <nav
      aria-label="Cliente"
      className="sticky bottom-0 z-30 flex border-t border-hairline bg-surface-container-lowest/95 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <span aria-current="page" className={`${itemClass} font-semibold text-primary`}>
        <TicketIcon className="size-6" aria-hidden />
        Mi turno
      </span>
      <Link
        to={`${PATHS.inicio}#estado-oficina`}
        className={`${itemClass} text-on-surface-variant hover:text-on-surface`}
      >
        <ListIcon className="size-6" aria-hidden />
        Monitor
      </Link>
      <button
        type="button"
        onClick={() =>
          toast.info("Un anfitrión de sala se acercará a ayudarte en unos minutos.")
        }
        className={`${itemClass} text-on-surface-variant hover:text-on-surface`}
      >
        <SupportIcon className="size-6" aria-hidden />
        Soporte
      </button>
    </nav>
  )
}
