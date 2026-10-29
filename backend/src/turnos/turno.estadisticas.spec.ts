import { calcularEsperaPromedioMinutos, calcularEstadisticas } from './turno.estadisticas';
import { Turno } from './turno.types';

const atendido = (n: number, s: string, a: string): Turno => ({ numero: n, hora_solicitud: s, hora_atencion: a, estado: 'atendido' });
const pendiente = (n: number, s: string): Turno => ({ numero: n, hora_solicitud: s, hora_atencion: null, estado: 'pendiente' });

describe('estadísticas', () => {
  it('promedia solo los atendidos', () => {
    const turnos = [atendido(1, '08:00:00', '08:10:00'), atendido(2, '08:05:00', '08:25:00'), pendiente(3, '08:06:00')];
    expect(calcularEsperaPromedioMinutos(turnos)).toBe(15); // (10 + 20) / 2
  });

  it('sin atendidos devuelve null, no 0 ni NaN', () => {
    expect(calcularEsperaPromedioMinutos([pendiente(1, '08:00:00')])).toBeNull();
    expect(calcularEsperaPromedioMinutos([])).toBeNull();
  });

  it('cuenta por estado', () => {
    const e = calcularEstadisticas([atendido(1, '08:00:00', '08:01:00'), pendiente(2, '08:02:00')]);
    expect(e).toEqual({ total: 2, enEspera: 1, atendidos: 1, cancelados: 0, esperaPromedioMinutos: 1 });
  });
});
