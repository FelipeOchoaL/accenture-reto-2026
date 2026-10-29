import { Turno } from './turno.types';
import { horaASegundos } from './tiempo.util';

export function compararPorLlegada(a: Turno, b: Turno): number {
  const sa = horaASegundos(a.hora_solicitud) ?? Number.MAX_SAFE_INTEGER;
  const sb = horaASegundos(b.hora_solicitud) ?? Number.MAX_SAFE_INTEGER;
  if (sa !== sb) return sa - sb;
  return a.numero - b.numero;
}
