import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

import { useAsesorStore } from "@/stores/asesor.store"
import { useAuthStore } from "@/stores/auth.store"
import { useClienteStore } from "@/stores/cliente.store"

// jsdom no implementa matchMedia (lo usan el ThemeProvider y sonner).
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

afterEach(() => {
  cleanup()
  // La fila simulada y las sesiones son globales: se reinician para que no pasen de un test a otro.
  localStorage.clear()
  useAuthStore.setState(useAuthStore.getInitialState(), true)
  useClienteStore.setState(useClienteStore.getInitialState(), true)
  useAsesorStore.setState(useAsesorStore.getInitialState(), true)
})
