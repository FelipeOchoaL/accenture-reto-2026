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

  it('carga los 11 registros sin rechazar ninguno', () => {
    expect(carga.turnos).toHaveLength(11);
    expect(carga.rechazados).toHaveLength(0);
  });

  it('resuelve el número 7 repetido: ya no hay números duplicados', () => {
    expect(new Set(carga.turnos.map((t) => t.numero)).size).toBe(11);
    expect(carga.turnos.filter((t) => t.numero_original === 7)).toHaveLength(1);
  });

  it('la fila queda en orden de llegada: 6, 7, 8, 9, 10', () => {
    expect(new ColaTurnos(carga.turnos).obtenerPendientes().map((t) => t.numero)).toEqual([6, 7, 8, 9, 10]);
  });

  it('espera promedio de la mañana = 12.2 min y 5 en espera', () => {
    const e = new ColaTurnos(carga.turnos).estadisticas();
    expect(e.esperaPromedioMinutos).toBe(12.2);
    expect(e.enEspera).toBe(5);
    expect(e.atendidos).toBe(5);
    expect(e.cancelados).toBe(1);
  });

  it('el siguiente número libre es el 12 (el 11 lo tomó el cancelado reasignado)', () => {
    expect(new ColaTurnos(carga.turnos).solicitarTurno('15:00:00').numero).toBe(12);
  });
});
