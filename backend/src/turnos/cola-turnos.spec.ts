import { ColaTurnos } from './cola-turnos';
import { prepararTurnos } from './turno.normalizer';
import { ColaVaciaError, HoraInvalidaError, TransicionInvalidaError, TurnoNoEncontradoError } from './turno.errors';
import { horaASegundos } from './tiempo.util';
import { Turno } from './turno.types';

const pend = (numero: number, hora_solicitud: string): Turno => ({ numero, hora_solicitud, hora_atencion: null, estado: 'pendiente' });

describe('ColaTurnos - FIFO', () => {
  it('llama siempre al pendiente más antiguo', () => {
    const cola = new ColaTurnos([pend(3, '08:30:00'), pend(1, '08:10:00'), pend(2, '08:20:00')]);
    expect(cola.llamarSiguiente('09:00:00').numero).toBe(1);
    expect(cola.llamarSiguiente('09:01:00').numero).toBe(2);
    expect(cola.llamarSiguiente('09:02:00').numero).toBe(3);
  });

  it('un turno nuevo entra al final de la fila', () => {
    const cola = new ColaTurnos([pend(1, '08:00:00'), pend(2, '08:05:00')]);
    const nuevo = cola.solicitarTurno('09:00:00');
    expect(cola.obtenerPendientes().map((t) => t.numero)).toEqual([1, 2, nuevo.numero]);
  });

  it('el reloj desajustado no deja pasar a un turno nuevo por delante de los viejos', () => {
    const cola = new ColaTurnos([pend(1, '08:00:00'), pend(2, '08:30:00')]);
    const nuevo = cola.solicitarTurno('07:00:00'); // reloj atrasado
    expect(nuevo.hora_solicitud).toBe('08:30:00');
    expect(cola.obtenerPendientes().map((t) => t.numero)).toEqual([1, 2, 3]);
  });

  it('desempata por número cuando llegan en el mismo segundo', () => {
    const cola = new ColaTurnos([pend(5, '08:00:00'), pend(4, '08:00:00')]);
    expect(cola.llamarSiguiente('09:00:00').numero).toBe(4);
  });

  it('llamar al siguiente lo marca atendido con hora_atencion y lo saca de la fila', () => {
    const cola = new ColaTurnos([pend(1, '08:00:00')]);
    const llamado = cola.llamarSiguiente('08:12:00');
    expect(llamado).toMatchObject({ numero: 1, estado: 'atendido', hora_atencion: '08:12:00' });
    expect(cola.cantidadEnEspera()).toBe(0);
  });

  it('la hora de atención nunca es anterior a la de solicitud', () => {
    const cola = new ColaTurnos([pend(1, '08:45:00')]);
    expect(cola.llamarSiguiente('07:00:00').hora_atencion).toBe('08:45:00');
  });

  it('con la fila vacía no se puede llamar al siguiente', () => {
    expect(() => new ColaTurnos().llamarSiguiente()).toThrow(ColaVaciaError);
    const cola = new ColaTurnos([pend(1, '08:00:00')]);
    cola.llamarSiguiente('08:10:00');
    expect(() => cola.llamarSiguiente('08:11:00')).toThrow(ColaVaciaError);
  });

  it('una hora inválida se rechaza con error claro', () => {
    expect(() => new ColaTurnos([pend(1, '08:00:00')]).llamarSiguiente('mañana')).toThrow(HoraInvalidaError);
  });
});

describe('ColaTurnos - números únicos', () => {
  it('los números nuevos continúan desde el máximo', () => {
    const cola = new ColaTurnos([pend(4, '08:00:00'), pend(9, '08:01:00')]);
    expect(cola.solicitarTurno('09:00:00').numero).toBe(10);
  });

  it('no reutiliza el número de un turno cancelado ni de uno atendido', () => {
    const cola = new ColaTurnos([pend(1, '08:00:00'), pend(2, '08:01:00')]);
    cola.cancelarTurno(2);
    cola.llamarSiguiente('08:10:00');
    expect(cola.solicitarTurno('08:20:00').numero).toBe(3);
  });

  it('1000 solicitudes seguidas no repiten ningún número', () => {
    const cola = new ColaTurnos();
    const numeros = new Set<number>();
    for (let i = 0; i < 1000; i++) numeros.add(cola.solicitarTurno('08:00:00').numero);
    expect(numeros.size).toBe(1000);
  });

  it('el constructor se niega a recibir números repetidos', () => {
    expect(() => new ColaTurnos([pend(1, '08:00:00'), pend(1, '08:05:00')])).toThrow();
  });

  it('el estado interno no se puede alterar desde afuera', () => {
    const cola = new ColaTurnos([pend(1, '08:00:00')]);
    cola.obtenerPendientes()[0].estado = 'atendido';
    expect(cola.cantidadEnEspera()).toBe(1);
  });
});

describe('ColaTurnos - cancelar y posición', () => {
  it('un turno cancelado sale de la fila y no se llama', () => {
    const cola = new ColaTurnos([pend(1, '08:00:00'), pend(2, '08:05:00')]);
    cola.cancelarTurno(1);
    expect(cola.llamarSiguiente('09:00:00').numero).toBe(2);
  });

  it('solo se cancela un pendiente', () => {
    const cola = new ColaTurnos([pend(1, '08:00:00')]);
    cola.llamarSiguiente('08:10:00');
    expect(() => cola.cancelarTurno(1)).toThrow(TransicionInvalidaError);
    expect(() => cola.cancelarTurno(99)).toThrow(TurnoNoEncontradoError);
  });

  it('calcula la posición en la fila', () => {
    const cola = new ColaTurnos([pend(1, '08:00:00'), pend(2, '08:05:00'), pend(3, '08:10:00')]);
    expect(cola.posicionEnFila(3)).toBe(3);
    cola.llamarSiguiente('09:00:00');
    expect(cola.posicionEnFila(3)).toBe(2);
  });
});

describe('ColaTurnos - el orden se respeta en TODOS los casos (aleatorio)', () => {
  // Generador pseudoaleatorio con semilla: si falla, falla igual siempre y se puede depurar.
  function aleatorio(semilla: number) {
    let s = semilla;
    return () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  it('con 200 colas desordenadas, con duplicados y con cancelados, salen en orden de llegada', () => {
    for (let semilla = 1; semilla <= 200; semilla++) {
      const azar = aleatorio(semilla);
      const crudos = Array.from({ length: 30 }, () => ({
        numero: 1 + Math.floor(azar() * 20), // fuerza repetidos
        hora_solicitud: `08:${String(Math.floor(azar() * 60)).padStart(2, '0')}:${String(Math.floor(azar() * 60)).padStart(2, '0')}`,
        hora_atencion: null,
        estado: azar() < 0.2 ? 'cancelado' : 'pendiente',
      }));

      const cola = new ColaTurnos(prepararTurnos(crudos).turnos);
      cola.solicitarTurno('09:00:00'); // y uno nuevo al final

      const salida: Turno[] = [];
      while (cola.cantidadEnEspera() > 0) salida.push(cola.llamarSiguiente('10:00:00'));

      for (let i = 1; i < salida.length; i++) {
        const anterior = horaASegundos(salida[i - 1].hora_solicitud) ?? 0;
        const actual = horaASegundos(salida[i].hora_solicitud) ?? 0;
        expect(actual).toBeGreaterThanOrEqual(anterior);
      }
      expect(new Set(salida.map((t) => t.numero)).size).toBe(salida.length);
    }
  });
});
