import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface AsesorState {
  // Con la fila en pausa, "Finalizar" cierra el turno actual sin llamar al siguiente.
  paused: boolean
  togglePause: () => void
}

export const useAsesorStore = create<AsesorState>()(
  persist(
    (set) => ({
      paused: false,
      togglePause: () => set((state) => ({ paused: !state.paused })),
    }),
    {
      name: "rowcenture:asesor",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
