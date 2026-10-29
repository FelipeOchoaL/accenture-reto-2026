const REGEX_HORA = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

/** "08:02:00" | "8:02" -> 29520. Devuelve null si no es una hora válida. */
export function horaASegundos(valor: unknown): number | null {
  if (typeof valor !== 'string') return null;
  const m = REGEX_HORA.exec(valor.trim());
  if (!m) return null;
  const horas = Number(m[1]);
  const minutos = Number(m[2]);
  const segundos = m[3] === undefined ? 0 : Number(m[3]);
  if (horas > 23 || minutos > 59 || segundos > 59) return null;
  return horas * 3600 + minutos * 60 + segundos;
}

/** 29520 -> "08:02:00" */
export function segundosAHora(total: number): string {
  const t = Math.max(0, Math.min(86399, Math.floor(total)));
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${dos(Math.floor(t / 3600))}:${dos(Math.floor((t % 3600) / 60))}:${dos(t % 60)}`;
}

/** Normaliza cualquier hora válida a "HH:MM:SS". null si es inválida. */
export function normalizarHora(valor: unknown): string | null {
  const segundos = horaASegundos(valor);
  return segundos === null ? null : segundosAHora(segundos);
}

/** Hora actual del servidor como "HH:MM:SS". Se puede inyectar una fecha en pruebas. */
export function horaActual(fecha: Date = new Date()): string {
  return segundosAHora(fecha.getHours() * 3600 + fecha.getMinutes() * 60 + fecha.getSeconds());
}
