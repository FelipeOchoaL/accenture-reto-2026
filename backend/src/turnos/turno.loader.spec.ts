import { extraerRegistros, cargarTurnosDesdeArchivo } from './turno.loader';
import { ColaTurnos } from './cola-turnos';

describe('extraerRegistros', () => {
  const registro = { numero: 1, hora_solicitud: '08:00:00', hora_atencion: null, estado: 'pendiente' };

  it('acepta un arreglo directo, { records } y la forma del extractor', () => {
    expect(extraerRegistros([registro])).toHaveLength(1);
    expect(extraerRegistros({ records: [registro] })).toHaveLength(1);
    expect(extraerRegistros({ workbooks: [{ sheets: { in: { records: [registro, registro] } } }] })).toHaveLength(2);
  });

  it('falla con mensaje claro si no hay registros', () => {
    expect(() => extraerRegistros({ otra: 1 })).toThrow();
    expect(() => extraerRegistros('hola')).toThrow();
  });
});

describe('carga real de data/documentation.json', () => {
  const carga = cargarTurnosDesdeArchivo();

  it('carga 10 turnos: el 7 pendiente se queda y el cancelado repetido no se carga', () => {
    expect(carga.turnos).toHaveLength(10);
    expect(carga.rechazados).toHaveLength(0);
    expect(carga.turnos.find((t) => t.numero === 7)).toMatchObject({
      estado: 'pendiente',
      hora_solicitud: '08:34:00',
    });
    expect(carga.turnos.some((t) => t.estado === 'cancelado' || t.numero_original != null)).toBe(false);
    expect(carga.advertencias.some((a) => a.includes('Número 7 repetido'))).toBe(true);
  });

  it('resuelve el número 7 repetido sin inventar un número nuevo', () => {
    const numeros = carga.turnos.map((t) => t.numero);
    expect(new Set(numeros).size).toBe(numeros.length);
    expect(numeros).not.toContain(11);
  });

  it('la fila queda en orden de llegada: 6, 7, 8, 9, 10', () => {
    expect(new ColaTurnos(carga.turnos).obtenerPendientes().map((t) => t.numero)).toEqual([6, 7, 8, 9, 10]);
  });

  it('espera promedio de la mañana = 12.2 min y 5 en espera', () => {
    const e = new ColaTurnos(carga.turnos).estadisticas();
    expect(e.esperaPromedioMinutos).toBe(12.2);
    expect(e.enEspera).toBe(5);
    expect(e.atendidos).toBe(5);
    expect(e.cancelados).toBe(0);
  });

  it('el siguiente número libre es el 11, porque el máximo que quedó es el 10', () => {
    expect(new ColaTurnos(carga.turnos).solicitarTurno('15:00:00').numero).toBe(11);
  });
});
