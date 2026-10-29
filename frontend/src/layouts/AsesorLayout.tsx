import { NavLink, Outlet, useNavigate } from "react-router"

import { logoutAsesor } from "@/App/actions/auth/auth.actions"
import type { NavItem } from "@/App/types/navigation.types"
import { BRAND } from "@/App/utils/brand"
import { formatClock, formatDuration } from "@/App/utils/format"
import {
  BadgeIcon,
  ClockIcon,
  DashboardIcon,
  HistoryIcon,
  ListIcon,
  LogoutIcon,
  SelectorIcon,
  UserIcon,
} from "@/App/utils/icons"
import { LiveBadge } from "@/components/custom/LiveBadge"
import { Logo } from "@/components/custom/Logo"
import { useNow } from "@/hooks/useNow"
import { cn } from "@/lib/utils"
import { useQueueSnapshot } from "@/modules/shared/hooks/useQueueSnapshot"
import { PATHS } from "@/routes/paths"
import { useAsesorStore } from "@/stores/asesor.store"
import { useAuthStore } from "@/stores/auth.store"

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard de atención", to: PATHS.asesor.dashboard, icon: DashboardIcon, end: true },
  { label: "Cola de espera", to: PATHS.asesor.cola, icon: ListIcon },
  { label: "Historial del día", to: PATHS.asesor.historial, icon: HistoryIcon },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm transition-colors",
    isActive
      ? "bg-primary-fixed font-semibold text-on-primary-fixed"
      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
  )

const AsesorLayout = () => {
  const user = useAuthStore((state) => state.session?.user)
  const navigate = useNavigate()
  const now = useNow()
  const { data: snapshot } = useQueueSnapshot()
  const paused = useAsesorStore((state) => state.paused)

  const handleLogout = () => {
    logoutAsesor()
    navigate(PATHS.asesor.login, { replace: true })
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Barra lateral */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col justify-between bg-surface-container-lowest px-4 py-5 shadow-header lg:flex">
        <div className="flex flex-col gap-6">
          <Logo subtitle="Centro operativo" />

          <div className="flex items-center gap-3 rounded-lg bg-surface-container-low px-3 py-2.5">
            <BadgeIcon className="size-5 text-primary" aria-hidden />
            <div className="flex flex-1 flex-col">
              <span className="text-label-telemetry text-on-surface-variant uppercase">
                Rol activo
              </span>
              <span className="text-body-sm font-semibold text-on-surface">
                {user.desk}
              </span>
            </div>
            <SelectorIcon className="size-4 text-outline" aria-hidden />
          </div>

          <nav aria-label="Asesor" className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ icon: Icon, ...item }) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                <Icon className="size-[18px]" aria-hidden />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2">
            <span className="flex items-center gap-2 text-label-telemetry text-on-surface-variant uppercase">
              <span
                className={cn(
                  "size-2 rounded-full",
                  paused ? "bg-warning" : "bg-primary"
                )}
              />
              Modo servicio
            </span>
            <span
              className={cn(
                "text-label-telemetry font-bold uppercase",
                paused ? "text-on-warning-container" : "text-primary"
              )}
            >
              {paused ? "Pausado" : "Activo"}
            </span>
          </div>
          <div className="flex items-center gap-3 px-1">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-on-primary">
              <UserIcon className="size-[18px]" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-body-sm font-semibold">{user.name}</span>
              <span className="truncate text-label-telemetry text-on-surface-variant">
                {user.module.window}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="flex size-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-danger-container hover:text-on-danger-container"
            >
              <LogoutIcon className="size-[18px]" aria-hidden />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
            <div className="flex items-center gap-4">
              <span className="lg:hidden">
                <Logo size="sm" />
              </span>
              <LiveBadge className="hidden md:inline-flex">
                En vivo • {BRAND.office}
              </LiveBadge>
              <span className="hidden items-center gap-1.5 text-data-mono text-on-surface tabular-nums sm:flex">
                <ClockIcon className="size-4" aria-hidden />
                {formatClock(new Date(now))}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <dl className="flex divide-x divide-outline-variant rounded-lg bg-surface-container-high px-1 py-1.5">
                <div className="px-3">
                  <dt className="text-label-telemetry text-on-surface-variant uppercase">
                    En espera
                  </dt>
                  <dd className="text-data-mono font-bold text-primary tabular-nums">
                    {snapshot ? `${snapshot.stats.waitingCount} turnos` : "—"}
                  </dd>
                </div>
                <div className="px-3">
                  <dt className="text-label-telemetry text-on-surface-variant uppercase">
                    Espera media
                  </dt>
                  <dd className="text-data-mono font-bold text-on-surface tabular-nums">
                    {snapshot
                      ? formatDuration(snapshot.stats.averageWaitSeconds)
                      : "—"}
                  </dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                className="flex size-9 items-center justify-center rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary-container lg:hidden"
              >
                <LogoutIcon className="size-[18px]" aria-hidden />
              </button>
            </div>
          </div>

          {/* Navegación compacta para pantallas pequeñas */}
          <nav
            aria-label="Asesor (móvil)"
            className="flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden"
          >
            {NAV_ITEMS.map(({ icon: Icon, ...item }) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={(state) => cn(navLinkClass(state), "shrink-0 py-2")}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 pb-10 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AsesorLayout
