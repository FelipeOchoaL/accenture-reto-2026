import type { TurnoDto } from "@/App/types/queue.types"

// "Base de datos" simulada con el mismo formato que enviará el backend (TurnoDto).
// Vive en localStorage para que cliente y asesor la compartan entre pestañas mientras no exista la API.
export interface MockDb {
  turnos: TurnoDto[]
}

const STORAGE_KEY = "rowcenture:mock-db"

// Datos de referencias/turnos_hoy.xlsx, ya organizados como los enviará el backend:
// ordenados por hora de solicitud y sin números duplicados. El número 7 aparecía dos veces
// (cancelado 08:30 y pendiente 08:34); se conserva el registro más reciente.
export const TURNOS_HOY_SEED: TurnoDto[] = [
  { numero: 1, hora_solicitud: "08:02:00", hora_atencion: "08:05:00", estado: "atendido" },
  { numero: 2, hora_solicitud: "08:06:00", hora_atencion: "08:15:00", estado: "atendido" },
  { numero: 3, hora_solicitud: "08:10:00", hora_atencion: "08:24:00", estado: "atendido" },
  { numero: 4, hora_solicitud: "08:15:00", hora_atencion: "08:31:00", estado: "atendido" },
  { numero: 5, hora_solicitud: "08:21:00", hora_atencion: "08:40:00", estado: "atendido" },
  { numero: 6, hora_solicitud: "08:25:00", hora_atencion: null, estado: "pendiente" },
  { numero: 7, hora_solicitud: "08:34:00", hora_atencion: null, estado: "pendiente" },
  { numero: 8, hora_solicitud: "08:38:00", hora_atencion: null, estado: "pendiente" },
  { numero: 9, hora_solicitud: "08:41:00", hora_atencion: null, estado: "pendiente" },
  { numero: 10, hora_solicitud: "08:45:00", hora_atencion: null, estado: "pendiente" },
]

const toSeconds = (time: string) => {
  const [hours = 0, minutes = 0, seconds = 0] = time.split(":").map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

const toTime = (totalSeconds: number) =>
  [Math.floor(totalSeconds / 3600), Math.floor((totalSeconds % 3600) / 60), totalSeconds % 60]
    .map((value) => String(value).padStart(2, "0"))
    .join(":")

// La demo ocurre "ahora": se desplaza la jornada del Excel para que su última solicitud haya
// sido hace 2 minutos, conservando exactamente los intervalos entre eventos. Así las esperas y
// cronómetros no mezclan las 08:00 del Excel con la hora real en que se usa la app.
export function createSeedDb(now = new Date()): MockDb {
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  const first = toSeconds(TURNOS_HOY_SEED[0].hora_solicitud)
  const last = Math.max(...TURNOS_HOY_SEED.map((turno) => toSeconds(turno.hora_solicitud)))
  const offset = nowSeconds - 120 - last
  const canShift = first + offset >= 0
  const shift = (time: string) => (canShift ? toTime(toSeconds(time) + offset) : time)

  return {
    turnos: TURNOS_HOY_SEED.map((turno) => ({
      ...turno,
      hora_solicitud: shift(turno.hora_solicitud),
      hora_atencion: turno.hora_atencion ? shift(turno.hora_atencion) : null,
    })),
  }
}

export function readDb(): MockDb {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as MockDb
    } catch {
      // Datos corruptos: se vuelve a sembrar.
    }
  }

  const seed = createSeedDb()
  writeDb(seed)
  return seed
}

export function writeDb(db: MockDb): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function resetMockDb(): void {
  localStorage.removeItem(STORAGE_KEY)
}
