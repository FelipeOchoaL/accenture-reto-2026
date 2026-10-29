import { describe, expect, it } from "vitest"

import { cn } from "@/lib/utils"

describe("cn con los tokens del design system", () => {
  it("no confunde la escala tipográfica con colores de texto", () => {
    expect(cn("bg-primary text-on-primary", "h-12 text-body-md")).toBe(
      "bg-primary text-on-primary h-12 text-body-md"
    )
  })

  it("resuelve conflictos dentro de la misma escala tipográfica", () => {
    expect(cn("text-body-sm", "text-label-telemetry")).toBe("text-label-telemetry")
  })

  it("trata las sombras propias como tamaño de sombra, no como color", () => {
    expect(cn("shadow-panel shadow-primary/20", "shadow-focus")).toBe(
      "shadow-primary/20 shadow-focus"
    )
  })
})
