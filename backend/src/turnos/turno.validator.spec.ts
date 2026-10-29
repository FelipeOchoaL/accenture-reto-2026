import { validarRegistro } from './turno.validator';

const base = { numero: 1, hora_solicitud: '08:02:00', hora_atencion: '08:05:00', estado: 'atendido' };

describe('validarRegistro', () => {
  it('acepta un atendido válido', () => {
    const r = validarRegistro(base);
    expect(r.errores).toHaveLength(0);
    expect(r.turno).toEqual(base);
  });

  it('acepta hora_atencion nula en pendiente (null, undefined o vacía)', () => {
    for (const vacio of [null, undefined, '', '   ']) {
      const r = validarRegistro({ ...base, estado: 'pendiente', hora_atencion: vacio });
      expect(r.errores).toHaveLength(0);
      expect(r.turno?.hora_atencion).toBeNull();
    }
  });

  it('normaliza estado con mayúsculas/espacios y horas sin segundos', () => {
    const r = validarRegistro({ ...base, estado: ' Atendido ', hora_solicitud: '8:02', hora_atencion: '8:05' });
    expect(r.turno?.estado).toBe('atendido');
    expect(r.turno?.hora_solicitud).toBe('08:02:00');
  });

  it('rechaza un atendido sin hora_atencion', () => {
    const r = validarRegistro({ ...base, hora_atencion: null });
    expect(r.turno).toBeUndefined();
    expect(r.errores[0].campo).toBe('hora_atencion');
  });

  it('rechaza atención anterior a la solicitud', () => {
    const r = validarRegistro({ ...base, hora_atencion: '08:01:00' });
    expect(r.turno).toBeUndefined();
  });

  it('rechaza número inválido, estado desconocido y hora_solicitud ausente, todo junto', () => {
    const r = validarRegistro({ numero: -3, estado: 'volando', hora_atencion: null });
    expect(r.errores.map((e) => e.campo).sort()).toEqual(['estado', 'hora_solicitud', 'numero']);
  });

  it('acepta número como texto numérico y rechaza decimales', () => {
    expect(validarRegistro({ ...base, numero: '7' }).turno?.numero).toBe(7);
    expect(validarRegistro({ ...base, numero: 1.5 }).turno).toBeUndefined();
  });

  it('ignora (con advertencia) hora_atencion en un pendiente', () => {
    const r = validarRegistro({ ...base, estado: 'pendiente' });
    expect(r.turno?.hora_atencion).toBeNull();
    expect(r.advertencias).toHaveLength(1);
  });

  it('rechaza lo que no es un objeto', () => {
    for (const malo of [null, undefined, 5, 'x', [1, 2]]) {
      expect(validarRegistro(malo).turno).toBeUndefined();
    }
  });
});
