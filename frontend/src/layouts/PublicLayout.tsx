import { Outlet } from "react-router"

import { BRAND } from "@/App/utils/brand"
import { PublicNavbar } from "@/components/custom/navbar/PublicNavbar"

const PublicLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <PublicNavbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <footer className="w-full bg-surface-container-lowest py-6 shadow-header">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 md:flex-row">
          <p className="flex items-center gap-1 text-on-surface-variant">
            <span className="text-label-telemetry tracking-wider uppercase">
              Sistema de telemetría de turnos
            </span>
            <span className="text-outline">•</span>
            <span className="text-data-mono font-semibold text-primary">
              {BRAND.version}
            </span>
          </p>
          <p className="text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} {BRAND.name}. Oficina de atención al
            cliente.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
