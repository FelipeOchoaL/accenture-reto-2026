import { Turno } from './turno.types';
import { compararPorLlegada } from './turno.orden';
import { horaActual, horaASegundos, segundosAHora } from './tiempo.util';
import {
  ColaVaciaError,
  HoraInvalidaError,
  TransicionInvalidaError,
  TurnoNoEncontradoError,
} from './turno.errors';
import { Estadisticas, calcularEstadisticas } from './turno.estadisticas';

export class ColaTurnos {
  private readonly turnos: Turno[];

  constructor(turnos: readonly Turno[] = []) {
    const vistos = new Set<number>();
    for (const t of turnos) {
      if (vistos.has(t.numero)) {
        throw new Error(
          `Número de turno repetido: ${t.numero}. Pasa los datos por prepararTurnos() primero.`,
        );
      }
      vistos.add(t.numero);
    }
    this.turnos = turnos.map((t) => ({ ...t }));
  }

  obtenerTodos(): Turno[] {
    return [...this.turnos].sort(compararPorLlegada).map((t) => ({ ...t }));
  }

  /** Pendientes en el orden exacto en que serán llamados. */
  obtenerPendientes(): Turno[] {
    return this.pendientes().map((t) => ({ ...t }));
  }

  verSiguiente(): Turno | null {
    const siguiente = this.pendientes()[0];
    return siguiente ? { ...siguiente } : null;
  }

  cantidadEnEspera(): number {
    return this.pendientes().length;
  }

  /** Posición en la fila (1 = el siguiente en ser llamado). */
  posicionEnFila(numero: number): number {
    const turno = this.buscar(numero);
    if (turno.estado !== 'pendiente') {
      throw new TransicionInvalidaError(numero, turno.estado, 'consultar la posición de');
    }
    return this.pendientes().findIndex((t) => t.numero === numero) + 1;
  }

  estadisticas(): Estadisticas {
    return calcularEstadisticas(this.turnos);
  }

  /** El cliente pide turno: entra al FINAL de la fila con el siguiente número libre. */
  solicitarTurno(ahora: string = horaActual()): Turno {
    const nuevo: Turno = {
      numero: this.siguienteNumero(),
      hora_solicitud: segundosAHora(this.segundosMonotonos(ahora, this.ultimaSolicitud())),
      hora_atencion: null,
      estado: 'pendiente',
    };
    this.turnos.push(nuevo);
    return { ...nuevo };
  }

  /** El asesor llama al siguiente: el pendiente más antiguo pasa a "atendido". */
  llamarSiguiente(ahora: string = horaActual()): Turno {
    const siguiente = this.pendientes()[0];
    if (!siguiente) throw new ColaVaciaError();

    const piso = horaASegundos(siguiente.hora_solicitud) ?? 0;
    siguiente.hora_atencion = segundosAHora(this.segundosMonotonos(ahora, piso));
    siguiente.estado = 'atendido';
    return { ...siguiente };
  }

  /** Solo se puede cancelar un turno que sigue pendiente. */
  cancelarTurno(numero: number): Turno {
    const turno = this.buscar(numero);
    if (turno.estado !== 'pendiente') {
      throw new TransicionInvalidaError(numero, turno.estado, 'cancelar');
    }
    turno.estado = 'cancelado';
    return { ...turno };
  }

  private pendientes(): Turno[] {
    return this.turnos.filter((t) => t.estado === 'pendiente').sort(compararPorLlegada);
  }

  private buscar(numero: number): Turno {
    const turno = this.turnos.find((t) => t.numero === numero);
    if (!turno) throw new TurnoNoEncontradoError(numero);
    return turno;
  }

  /** max + 1 sobre TODOS (incluidos cancelados y atendidos): un número jamás se reutiliza. */
  private siguienteNumero(): number {
    return this.turnos.reduce((m, t) => Math.max(m, t.numero), 0) + 1;
  }

  private ultimaSolicitud(): number {
    return this.turnos.reduce((m, t) => Math.max(m, horaASegundos(t.hora_solicitud) ?? 0), 0);
  }

  private segundosMonotonos(ahora: string, piso: number): number {
    const segundos = horaASegundos(ahora);
    if (segundos === null) throw new HoraInvalidaError(ahora);
    return Math.max(segundos, piso);
  }
}
