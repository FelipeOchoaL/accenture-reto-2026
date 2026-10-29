import { Link, NavLink } from "react-router"

import { BRAND } from "@/App/utils/brand"
import { UserIcon } from "@/App/utils/icons"
import { LiveBadge } from "@/components/custom/LiveBadge"
import { Logo } from "@/components/custom/Logo"
import { cn } from "@/lib/utils"
import { PATHS } from "@/routes/paths"

const links = [
  { label: "Monitor Público", to: `${PATHS.inicio}#estado-oficina` },
  { label: "Solicitar Turno", to: PATHS.cliente.pedirTurno },
  { label: "Acceso Asesor", to: PATHS.asesor.login },
]

export function PublicNavbar() {
  return (
    <header className="fixed top-0 z-40 w-full bg-surface-container-lowest/90 shadow-header backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to={PATHS.inicio} aria-label={`${BRAND.name}, inicio`}>
            <Logo />
          </Link>
          <LiveBadge className="hidden sm:inline-flex">
            En vivo • {BRAND.office}
          </LiveBadge>
        </div>

        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-body-sm transition-colors",
                  isActive && !link.to.includes("#")
                    ? "font-semibold text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to={PATHS.asesor.login}
          aria-label="Acceso asesor"
          className="flex size-9 items-center justify-center rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary-container"
        >
          <UserIcon className="size-[18px]" aria-hidden />
        </Link>
      </div>
    </header>
  )
}
