/**
 * Tipos del dominio "turnos".
 *
 * Los nombres de los campos (hora_solicitud, hora_atencion) son IGUALES a los del
 * JSON que extrae el compañero de back, así no hay que mapear nada entre capas.
 */

export const ESTADOS = ['pendiente', 'atendido', 'cancelado'] as const;
export type EstadoTurno = (typeof ESTADOS)[number];

export interface Turno {
  numero: number;
  hora_solicitud: string;
  hora_atencion: string | null;
  estado: EstadoTurno;
  numero_original?: number;
}
