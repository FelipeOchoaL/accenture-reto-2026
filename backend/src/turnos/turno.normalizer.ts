import { Turno } from './turno.types';
import { ErrorValidacion, validarRegistro } from './turno.validator';
import { compararPorLlegada } from './turno.orden';
import { horaASegundos } from './tiempo.util';

export interface RegistroRechazado {
  indice: number;
  registro: unknown;
  errores: ErrorValidacion[];
}

export interface ResultadoCarga {
  turnos: Turno[];
  rechazados: RegistroRechazado[];
  advertencias: string[];
}

interface Item {
  turno: Turno;
  indice: number;
}

function prioridadParaConservar(a: Item, b: Item): number {
  const ca = a.turno.estado === 'cancelado' ? 1 : 0;
  const cb = b.turno.estado === 'cancelado' ? 1 : 0;
  if (ca !== cb) return ca - cb;
  const porLlegada = compararPorLlegada(a.turno, b.turno);
  return porLlegada !== 0 ? porLlegada : a.indice - b.indice;
}

/**
 * Un número repetido no se reasigna cuando uno está pendiente (o atendido) y otro cancelado:
 * se queda el activo con su número y el cancelado no se carga.
 * Solo se reasigna si el repetido también está activo, para no dejar dos turnos con el mismo número.
 */
function resolverNumerosDuplicados(items: Item[], advertencias: string[]): Item[] {
  const grupos = new Map<number, Item[]>();
  for (const item of items) {
    const grupo = grupos.get(item.turno.numero) ?? [];
    grupo.push(item);
    grupos.set(item.turno.numero, grupo);
  }

  const conservados: Item[] = [];
  const sobrantes: Item[] = [];

  for (const grupo of grupos.values()) {
    if (grupo.length < 2) {
      conservados.push(grupo[0]);
      continue;
    }

    grupo.sort(prioridadParaConservar);
    const [primero, ...resto] = grupo;
    conservados.push(primero);

    for (const item of resto) {
      const elNumeroYaTieneTurnoActivo = primero.turno.estado !== 'cancelado';
      if (elNumeroYaTieneTurnoActivo && item.turno.estado === 'cancelado') {
        advertencias.push(
          `Número ${item.turno.numero} repetido: se deja el turno ${primero.turno.estado} ` +
            `de las ${primero.turno.hora_solicitud} y no se carga el cancelado de las ${item.turno.hora_solicitud}. ` +
            `No se le asigna otro número.`,
        );
        continue;
      }
      sobrantes.push(item);
    }
  }

  sobrantes.sort((a, b) => compararPorLlegada(a.turno, b.turno) || a.indice - b.indice);

  const todos = [...conservados, ...sobrantes];
  let maximo = todos.reduce((m, i) => Math.max(m, i.turno.numero), 0);
  for (const item of sobrantes) {
    const original = item.turno.numero;
    maximo += 1;
    item.turno.numero = maximo;
    item.turno.numero_original = original;
    advertencias.push(
      `Número ${original} repetido: el turno de las ${item.turno.hora_solicitud} ` +
        `(${item.turno.estado}) pasó a ser el ${maximo}.`,
    );
  }

  return todos;
}

function detectarSaltosDeFila(turnos: Turno[], advertencias: string[]): void {
  for (const pendiente of turnos.filter((t) => t.estado === 'pendiente')) {
    const sp = horaASegundos(pendiente.hora_solicitud) ?? 0;
    for (const t of turnos) {
      const st = horaASegundos(t.hora_solicitud) ?? 0;
      if (t.estado === 'atendido' && st > sp) {
        advertencias.push(
          `Posible salto de fila: el turno ${t.numero} fue atendido antes que el pendiente ${pendiente.numero}, que llegó primero.`,
        );
      }
    }
  }
}

export function prepararTurnos(registros: readonly unknown[]): ResultadoCarga {
  const advertencias: string[] = [];
  const rechazados: RegistroRechazado[] = [];
  const items: Item[] = [];

  registros.forEach((raw, indice) => {
    const resultado = validarRegistro(raw);
    resultado.advertencias.forEach((a) => advertencias.push(`Registro #${indice + 1}: ${a}`));
    if (resultado.turno) items.push({ turno: resultado.turno, indice });
    else rechazados.push({ indice, registro: raw, errores: resultado.errores });
  });

  const itemsUnicos = resolverNumerosDuplicados(items, advertencias);

  const turnos = itemsUnicos.map((i) => i.turno).sort(compararPorLlegada);
  detectarSaltosDeFila(turnos, advertencias);

  return { turnos, rechazados, advertencias };
}
