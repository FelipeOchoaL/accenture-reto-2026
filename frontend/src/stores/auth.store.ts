import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { AuthSession } from "@/App/types/auth.types"

interface AuthState {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  logout: () => void
}

// Sesión del asesor. El cliente no inicia sesión, por eso aquí solo vive el asesor.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    {
      name: "rowcenture:auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
