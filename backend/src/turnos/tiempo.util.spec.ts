import { horaASegundos, normalizarHora, segundosAHora, horaActual } from './tiempo.util';

describe('tiempo.util', () => {
  it('convierte HH:MM:SS a segundos y de vuelta', () => {
    expect(horaASegundos('08:02:00')).toBe(28920);
    expect(segundosAHora(28920)).toBe('08:02:00');
  });

  it('acepta HH:MM y una sola cifra en la hora', () => {
    expect(normalizarHora('8:05')).toBe('08:05:00');
  });

  it('rechaza horas inválidas', () => {
    for (const malo of ['25:00:00', '08:60:00', '08:00:61', 'abc', '', null, undefined, 830, '08-02-00']) {
      expect(horaASegundos(malo)).toBeNull();
    }
  });

  it('horaActual devuelve formato HH:MM:SS', () => {
    expect(horaActual(new Date(2026, 9, 29, 15, 4, 9))).toBe('15:04:09');
  });
});
