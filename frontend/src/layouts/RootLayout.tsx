import { useEffect } from "react"
import { Outlet, useMatches } from "react-router"
import { Toaster } from "sonner"

import type { RouteHandle } from "@/App/types/navigation.types"
import { BRAND } from "@/App/utils/brand"

// Raíz de la app: título del documento por ruta y notificaciones (toasts).
const RootLayout = () => {
  const matches = useMatches()
  const title = [...matches]
    .reverse()
    .map((match) => (match.handle as RouteHandle | undefined)?.title)
    .find(Boolean)

  useEffect(() => {
    document.title = title ? `${title} · ${BRAND.name}` : BRAND.name
  }, [title])

  return (
    <>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </>
  )
}

export default RootLayout
