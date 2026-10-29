export class ColaVaciaError extends Error {
  readonly codigo = 'COLA_VACIA';
  constructor() {
    super('No hay turnos en espera: la fila está vacía.');
    this.name = 'ColaVaciaError';
  }
}

export class TurnoNoEncontradoError extends Error {
  readonly codigo = 'TURNO_NO_ENCONTRADO';
  constructor(numero: number) {
    super(`No existe el turno número ${numero}.`);
    this.name = 'TurnoNoEncontradoError';
  }
}

export class TransicionInvalidaError extends Error {
  readonly codigo = 'TRANSICION_INVALIDA';
  constructor(numero: number, estadoActual: string, accion: string) {
    super(`No se puede ${accion} el turno ${numero}: está "${estadoActual}".`);
    this.name = 'TransicionInvalidaError';
  }
}

export class HoraInvalidaError extends Error {
  readonly codigo = 'HORA_INVALIDA';
  constructor(valor: unknown) {
    super(`Hora inválida: ${JSON.stringify(valor)}. Formato esperado HH:MM o HH:MM:SS.`);
    this.name = 'HoraInvalidaError';
  }
}
