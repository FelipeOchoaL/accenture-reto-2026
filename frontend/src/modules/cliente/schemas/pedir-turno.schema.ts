import { z } from "zod"

export const pedirTurnoSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(3, "Escribe tu nombre para poder llamarte.")
    .max(60, "El nombre no puede superar 60 caracteres.")
    .regex(/^[\p{L}\s.'-]+$/u, "Usa solo letras y espacios."),
  reason: z.string().nullable(),
})

export type PedirTurnoValues = z.infer<typeof pedirTurnoSchema>
