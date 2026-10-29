import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router"

import { routes } from "@/routes/AppRouter"

// Renderiza la app real (rutas, guards y layouts) en una ruta dada, con una caché de datos limpia.
export function renderRoute(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchInterval: false } },
  })
  const router = createMemoryRouter(routes, { initialEntries: [path] })

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  return { ...utils, router, queryClient }
}
