# Módulo `turnos` — datos, validaciones y FIFO

TypeScript puro, sin dependencias (no usa NestJS). El back lo envuelve en un `@Injectable()`.

| Archivo | Para qué sirve |
|---|---|
| `turno.types.ts` | Tipo `Turno` y estados válidos |
| `turno.errors.ts` | Errores de negocio con `codigo` (fila vacía, no encontrado, etc.) |
| `tiempo.util.ts` | Hora <-> segundos, formato `HH:MM:SS` |
| `turno.orden.ts` | **La** definición de orden de llegada (FIFO) |
| `turno.validator.ts` | Valida un registro; `hora_atencion` puede ser `null` |
| `turno.normalizer.ts` | Valida todo, arregla números repetidos y ordena |
| `turno.estadisticas.ts` | Espera promedio y conteos |
| `cola-turnos.ts` | La fila: solicitar, llamar al siguiente, cancelar, posición |
| `turno.loader.ts` | Lee `data/documentation.json` |
| `*.spec.ts` | Pruebas (Jest) |

Reporte rápido de datos: `npx tsx backend/scripts/reporte-datos.ts`

## Uso desde NestJS

```ts
const { turnos } = cargarTurnosDesdeArchivo();   // o prepararTurnos(filasDeLaBD)
const cola = new ColaTurnos(turnos);
cola.solicitarTurno();     // POST /turnos
cola.llamarSiguiente();    // POST /fila/siguiente   (ColaVaciaError -> 409)
cola.estadisticas();       // GET  /estadisticas
```
turno.types.ts: define Turno con los mismos campos del JSON (hora_atencion: string | null), así no hay que mapear nada.
turno.validator.ts: valida un registro y no lanza excepciones, devuelve la lista de errores.
hora_atencion puede ser null, undefined o vacía.
Un atendido sin hora_atencion se rechaza, porque no se podría calcular la espera.
Un pendiente o cancelado con hora_atencion se acepta, pero esa hora se ignora y queda una advertencia.
turno.normalizer.ts: valida todos los registros, arregla los números repetidos y ordena. Un registro malo va a rechazados y no tumba la carga.
turno.orden.ts: es la única definición de FIFO del proyecto (hora de llegada y luego número). Se ordena por hora, no por número ni por posición en el archivo, porque el turno 9 aparece antes que el 7 y el 8.
cola-turnos.ts: la fila. Tiene solicitarTurno, llamarSiguiente, cancelarTurno, posicionEnFila y estadisticas, y garantiza las tres reglas del caso. Un número nunca se reutiliza, ni siquiera el de un cancelado.
turno.errors.ts: errores con un codigo estable (COLA_VACIA, etc.) para que el controlador los traduzca a 409, 404 o 400.
turno.estadisticas.ts: la espera promedio da 12,2 min con los datos de la mañana. Si no hay atendidos devuelve null, no 0.
turno.loader.ts: lee data/documentation.json y entiende la forma actual del extractor y también un arreglo simple. Si tu compañero cambia el formato, solo se toca extraerRegistros

