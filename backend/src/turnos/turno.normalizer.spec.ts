import { prepararTurnos } from './turno.normalizer';

const t = (numero: number, hora_solicitud: string, estado: string, hora_atencion: string | null = null) => ({
  numero,
  hora_solicitud,
  hora_atencion,
  estado,
});

describe('prepararTurnos', () => {
  it('ordena por hora de solicitud, no por el orden del archivo', () => {
    const { turnos } = prepararTurnos([t(9, '08:41:00', 'pendiente'), t(7, '08:30:00', 'pendiente')]);
    expect(turnos.map((x) => x.numero)).toEqual([7, 9]);
  });

  it('si hay un pendiente y un cancelado con el mismo número, el pendiente se queda y el cancelado no se reasigna', () => {
    const { turnos, advertencias } = prepararTurnos([
      t(7, '08:30:00', 'cancelado'),
      t(7, '08:34:00', 'pendiente'),
      t(10, '08:45:00', 'pendiente'),
    ]);
    expect(turnos.map((x) => x.numero).sort((a, b) => a - b)).toEqual([7, 10]);
    expect(turnos.find((x) => x.numero === 7)).toMatchObject({
      estado: 'pendiente',
      hora_solicitud: '08:34:00',
    });
    expect(turnos.some((x) => x.estado === 'cancelado' || x.numero === 11)).toBe(false);
    expect(advertencias.some((a) => a.includes('No se le asigna otro número'))).toBe(true);
  });

  it('el orden del archivo no cambia quién conserva el número', () => {
    const { turnos } = prepararTurnos([
      t(7, '08:34:00', 'pendiente'),
      t(7, '08:30:00', 'cancelado'),
    ]);
    expect(turnos).toEqual([
      expect.objectContaining({ numero: 7, estado: 'pendiente', hora_solicitud: '08:34:00' }),
    ]);
  });

  it('entre dos activos repetidos conserva el que llegó primero', () => {
    const { turnos } = prepararTurnos([t(3, '09:10:00', 'pendiente'), t(3, '09:00:00', 'pendiente')]);
    expect(turnos.find((x) => x.hora_solicitud === '09:00:00')?.numero).toBe(3);
    expect(turnos.find((x) => x.hora_solicitud === '09:10:00')?.numero).toBe(4);
  });

  it('nunca devuelve números repetidos, aunque haya triplicados', () => {
    const { turnos } = prepararTurnos([
      t(1, '08:00:00', 'pendiente'),
      t(1, '08:01:00', 'pendiente'),
      t(1, '08:02:00', 'cancelado'),
      t(2, '08:03:00', 'pendiente'),
    ]);
    expect(new Set(turnos.map((x) => x.numero)).size).toBe(turnos.length);
  });

  it('un registro malo se rechaza sin tumbar la carga', () => {
    const { turnos, rechazados } = prepararTurnos([t(1, '08:00:00', 'pendiente'), { numero: 'x' }, null]);
    expect(turnos).toHaveLength(1);
    expect(rechazados.map((r) => r.indice)).toEqual([1, 2]);
  });

  it('avisa si alguien fue atendido saltándose a un pendiente que llegó antes', () => {
    const { advertencias } = prepararTurnos([
      t(1, '08:00:00', 'pendiente'),
      t(2, '08:05:00', 'atendido', '08:10:00'),
    ]);
    expect(advertencias.some((a) => a.includes('salto de fila'))).toBe(true);
  });

  it('arreglo vacío no falla', () => {
    expect(prepararTurnos([]).turnos).toEqual([]);
  });
});
