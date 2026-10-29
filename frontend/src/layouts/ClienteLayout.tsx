import { Outlet } from "react-router"

// Las pantallas del cliente son móviles: en escritorio se centran en una columna tipo teléfono.
const ClienteLayout = () => {
  return (
    <div className="min-h-dvh bg-surface-container-low/60">
      <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface md:shadow-panel">
        <Outlet />
      </main>
    </div>
  )
}

export default ClienteLayout
