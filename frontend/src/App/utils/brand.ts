// Identidad de la marca. Para cambiar el nombre o la oficina, edita este objeto.
export const BRAND = {
  name: "RowCenture",
  product: "Fila Virtual",
  tagline: "Fila virtual de turnos",
  office: "Oficina Central",
  version: "v1.0 Live",
} as const

// Módulo de atención que opera este puesto (lo usa la portada; el del asesor llega en su sesión).
export const OFFICE = {
  moduleCode: "03",
  moduleName: "Atención al Cliente",
} as const
