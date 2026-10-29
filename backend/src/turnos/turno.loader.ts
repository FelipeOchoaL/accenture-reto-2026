import * as fs from 'fs';
import * as path from 'path';
import { ResultadoCarga, prepararTurnos } from './turno.normalizer';

export const RUTA_DATOS_POR_DEFECTO = path.resolve(__dirname, '../../../data/documentation.json');

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

export function extraerRegistros(contenido: unknown): unknown[] {
  if (Array.isArray(contenido)) return contenido;
  if (!esObjeto(contenido)) throw new Error('El JSON no tiene una estructura de datos reconocible.');

  if (Array.isArray(contenido.records)) return contenido.records;

  if (Array.isArray(contenido.workbooks)) {
    const registros: unknown[] = [];
    for (const libro of contenido.workbooks) {
      if (!esObjeto(libro) || !esObjeto(libro.sheets)) continue;
      for (const hoja of Object.values(libro.sheets)) {
        if (esObjeto(hoja) && Array.isArray(hoja.records)) registros.push(...hoja.records);
      }
    }
    if (registros.length > 0) return registros;
  }

  throw new Error('No se encontraron registros de turnos en el JSON.');
}

export function cargarTurnosDesdeArchivo(
  ruta: string = process.env.TURNOS_DATA_PATH ?? RUTA_DATOS_POR_DEFECTO,
): ResultadoCarga {
  let texto: string;
  try {
    texto = fs.readFileSync(ruta, 'utf-8');
  } catch {
    throw new Error(`No se pudo leer el archivo de datos: ${ruta}`);
  }

  let contenido: unknown;
  try {
    contenido = JSON.parse(texto.replace(/^\uFEFF/, '')); // quita BOM si lo trae
  } catch {
    throw new Error(`El archivo ${ruta} no es un JSON válido.`);
  }

  return prepararTurnos(extraerRegistros(contenido));
}
