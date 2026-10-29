import { ESTADOS, EstadoTurno, Turno } from './turno.types';
import { horaASegundos, segundosAHora } from './tiempo.util';

export interface ErrorValidacion {
  campo: string;
  mensaje: string;
}

export interface ResultadoValidacion {
  turno?: Turno;
  errores: ErrorValidacion[];
  advertencias: string[];
}

function estaVacio(valor: unknown): boolean {
  return valor === null || valor === undefined || (typeof valor === 'string' && valor.trim() === '');
}
export function validarRegistro(raw: unknown): ResultadoValidacion {
  const errores: ErrorValidacion[] = [];
  const advertencias: string[] = [];

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { errores: [{ campo: 'registro', mensaje: 'El registro debe ser un objeto.' }], advertencias };
  }
  const r = raw as Record<string, unknown>;

  // numero
  let numero = Number.NaN;
  if (typeof r.numero === 'number') numero = r.numero;
  else if (typeof r.numero === 'string' && /^\d+$/.test(r.numero.trim())) numero = Number(r.numero.trim());
  if (!Number.isInteger(numero) || numero <= 0) {
    errores.push({ campo: 'numero', mensaje: 'Debe ser un entero mayor que 0.' });
  }

  // estado
  const estadoTexto = typeof r.estado === 'string' ? r.estado.trim().toLowerCase() : '';
  const estado: EstadoTurno | undefined = ESTADOS.find((e) => e === estadoTexto);
  if (!estado) {
    errores.push({ campo: 'estado', mensaje: `Debe ser uno de: ${ESTADOS.join(', ')}.` });
  }

  // hora_solicitud
  const solicitud = horaASegundos(r.hora_solicitud);
  if (solicitud === null) {
    errores.push({ campo: 'hora_solicitud', mensaje: 'Obligatoria, con formato HH:MM o HH:MM:SS.' });
  }

  // hora_atencion
  let atencion: number | null = null;
  if (!estaVacio(r.hora_atencion)) {
    atencion = horaASegundos(r.hora_atencion);
    if (atencion === null) {
      errores.push({ campo: 'hora_atencion', mensaje: 'Si viene, debe tener formato HH:MM o HH:MM:SS.' });
    }
  }

  // reglas cruzadas
  if (estado && solicitud !== null && errores.every((e) => e.campo !== 'hora_atencion')) {
    if (estado === 'atendido') {
      if (atencion === null) {
        errores.push({ campo: 'hora_atencion', mensaje: 'Un turno atendido necesita hora_atencion.' });
      } else if (atencion < solicitud) {
        errores.push({ campo: 'hora_atencion', mensaje: 'No puede ser anterior a hora_solicitud.' });
      }
    } else if (atencion !== null) {
      advertencias.push(
        `Turno ${numero} está "${estado}" pero traía hora_atencion; se ignoró esa hora.`,
      );
      atencion = null;
    }
  }

  if (errores.length > 0 || !estado || solicitud === null) {
    return { errores, advertencias };
  }

  return {
    turno: {
      numero,
      hora_solicitud: segundosAHora(solicitud),
      hora_atencion: atencion === null ? null : segundosAHora(atencion),
      estado,
    },
    errores,
    advertencias,
  };
}
