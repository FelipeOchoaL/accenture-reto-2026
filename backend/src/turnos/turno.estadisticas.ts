import { Turno } from './turno.types';
import { horaASegundos } from './tiempo.util';

export interface Estadisticas {
  total: number;
  enEspera: number;
  atendidos: number;
  cancelados: number;
  esperaPromedioMinutos: number | null;
}

export function calcularEsperaPromedioMinutos(turnos: readonly Turno[]): number | null {
  const esperas: number[] = [];
  for (const t of turnos) {
    if (t.estado !== 'atendido' || t.hora_atencion === null) continue;
    const solicitud = horaASegundos(t.hora_solicitud);
    const atencion = horaASegundos(t.hora_atencion);
    if (solicitud === null || atencion === null || atencion < solicitud) continue;
    esperas.push((atencion - solicitud) / 60);
  }
  if (esperas.length === 0) return null;
  const promedio = esperas.reduce((suma, e) => suma + e, 0) / esperas.length;
  return Math.round(promedio * 100) / 100;
}

export function calcularEstadisticas(turnos: readonly Turno[]): Estadisticas {
  const contar = (estado: Turno['estado']) => turnos.filter((t) => t.estado === estado).length;
  return {
    total: turnos.length,
    enEspera: contar('pendiente'),
    atendidos: contar('atendido'),
    cancelados: contar('cancelado'),
    esperaPromedioMinutos: calcularEsperaPromedioMinutos(turnos),
  };
}
