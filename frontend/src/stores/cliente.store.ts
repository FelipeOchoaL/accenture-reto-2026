import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface ClienteState {
  ticketId: string | null
  // Personas delante al momento de pedir el turno; sirve para calcular el progreso.
  initialAhead: number
  setTicket: (ticketId: string, initialAhead: number) => void
  clear: () => void
}

// Turno del cliente en este dispositivo. No hay inicio de sesión: el turno se recuerda localmente.
export const useClienteStore = create<ClienteState>()(
  persist(
    (set) => ({
      ticketId: null,
      initialAhead: 0,
      setTicket: (ticketId, initialAhead) => set({ ticketId, initialAhead }),
      clear: () => set({ ticketId: null, initialAhead: 0 }),
    }),
    {
      name: "rowcenture:cliente",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
