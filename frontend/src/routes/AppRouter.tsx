import type { ComponentType } from "react"
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router"

import AsesorLayout from "@/layouts/AsesorLayout"
import ClienteLayout from "@/layouts/ClienteLayout"
import PublicLayout from "@/layouts/PublicLayout"
import RootLayout from "@/layouts/RootLayout"
import InicioPage from "@/pages/InicioPage"
import NotFoundPage from "@/pages/NotFoundPage"
import { ProtectedRoute } from "@/routes/guards/ProtectedRoute"
import { PublicOnlyRoute } from "@/routes/guards/PublicOnlyRoute"
import { PATHS } from "@/routes/paths"

// Carga diferida por página: el cliente no descarga el panel del asesor y viceversa.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

// `handle.title` alimenta el título del documento (ver RootLayout).
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: PATHS.inicio, element: <InicioPage />, handle: { title: "Inicio" } },
        ],
      },
      // Cliente: sin inicio de sesión.
      {
        element: <ClienteLayout />,
        children: [
          {
            path: PATHS.cliente.pedirTurno,
            lazy: page(() => import("@/pages/cliente/PedirTurnoPage")),
            handle: { title: "Pide tu turno" },
          },
          {
            path: PATHS.cliente.miTurno,
            lazy: page(() => import("@/pages/cliente/MiTurnoPage")),
            handle: { title: "Mi turno" },
          },
          {
            path: PATHS.cliente.llamado,
            lazy: page(() => import("@/pages/cliente/EsTuTurnoPage")),
            handle: { title: "¡Es tu turno!" },
          },
        ],
      },
      // Asesor: login público y panel protegido.
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: PATHS.asesor.login,
            lazy: page(() => import("@/pages/asesor/LoginPage")),
            handle: { title: "Acceso asesor" },
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AsesorLayout />,
            children: [
              {
                path: PATHS.asesor.dashboard,
                lazy: page(() => import("@/pages/asesor/DashboardPage")),
                handle: { title: "Dashboard de atención" },
              },
              {
                path: PATHS.asesor.cola,
                lazy: page(() => import("@/pages/asesor/ColaPage")),
                handle: { title: "Cola de espera" },
              },
              {
                path: PATHS.asesor.historial,
                lazy: page(() => import("@/pages/asesor/HistorialPage")),
                handle: { title: "Historial del día" },
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage />, handle: { title: "Página no encontrada" } },
    ],
  },
]

const router = createBrowserRouter(routes)

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
