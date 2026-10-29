import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"

import "@/App/utils/fonts"
import "./index.css"
import RowCentureApp from "./RowCentureApp"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { queryClient } from "@/lib/query-client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <RowCentureApp />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
